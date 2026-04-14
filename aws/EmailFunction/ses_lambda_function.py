from __future__ import annotations

import os
import sys
from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal
from pathlib import Path

import boto3
from botocore.exceptions import ClientError

sys.path.append(os.path.join(os.path.dirname(__file__), "libraries"))
import finnhub

PORTFOLIO_RECORD_SORT_KEY = Decimal(os.getenv("PORTFOLIO_RECORD_SORT_KEY", "0"))
TEMPLATE_PATH = Path(__file__).with_name("email_template.html")


def get_headlines(symbol, client):
    results = []
    date_today = date.today()
    date_prev = date_today - timedelta(days=5)
    data = client.company_news(symbol, _from=date_prev.isoformat(), to=date_today.isoformat())

    for index in range(min(len(data), 3)):
        results.append((data[index]["headline"], data[index]["url"]))

    return results


def get_email_body(stock_data):
    subject = "PortfolioPulse - Your Daily Insight"
    body_text = "PortfolioPulse daily market updates."
    stock_list_items = ""
    stocks_with_news = []
    stocks_without_news = []

    for stock in stock_data:
        if stock["news"]:
            stocks_with_news.append(stock)
        else:
            stocks_without_news.append(stock)

    sorted_stocks = (stocks_with_news + stocks_without_news)[: min(3, len(stock_data))]

    for stock in sorted_stocks:
        stock_item_html = (
            f"<div class='stock-item'><h3><b>{stock['symbol']} ({stock['quantity']} Shares)</b></h3>"
        )
        stock_item_html += "<ul class='news-list'>"

        if stock["news"]:
            for news_item in stock["news"]:
                stock_item_html += f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>"
        else:
            stock_item_html += "<li>No New Updates!</li>"

        stock_item_html += "</ul></div>"
        stock_list_items += stock_item_html

    body_html = TEMPLATE_PATH.read_text(encoding="utf-8")
    body_html = body_html.replace("{SUBJECT}", subject)
    body_html = body_html.replace("{stock_list_items}", stock_list_items)

    return subject, body_text, body_html


def normalize_portfolios(items):
    portfolios = []
    legacy_groups = defaultdict(list)

    for item in items:
        if "positions" in item:
            holdings = []
            for symbol, quantity in item["positions"].items():
                holdings.append(
                    {
                        "symbol": str(symbol).upper(),
                        "quantity": Decimal(str(quantity)),
                    }
                )

            portfolios.append(
                {
                    "user": item["user"],
                    "email": item.get("email"),
                    "holdings": sorted(holdings, key=lambda entry: entry["quantity"], reverse=True),
                }
            )
            continue

        legacy_groups[item["user"]].append(item)

    for user, group in legacy_groups.items():
        if "@" not in user:
            continue

        holdings = []
        for item in group:
            symbol = item.get("symbol")
            quantity = item.get("quantity")
            if not symbol or quantity is None:
                continue

            holdings.append(
                {
                    "symbol": str(symbol).upper(),
                    "quantity": Decimal(str(quantity)),
                }
            )

        if holdings:
            portfolios.append(
                {
                    "user": user,
                    "email": user,
                    "holdings": sorted(holdings, key=lambda entry: entry["quantity"], reverse=True),
                }
            )

    return portfolios


def send_portfolio_email(ses_client, sender, recipient, stock_data):
    charset = "UTF-8"
    subject, body_text, body_html = get_email_body(stock_data)

    ses_client.send_email(
        Destination={"ToAddresses": [recipient]},
        Message={
            "Body": {
                "Html": {"Charset": charset, "Data": body_html},
                "Text": {"Charset": charset, "Data": body_text},
            },
            "Subject": {"Charset": charset, "Data": subject},
        },
        Source=sender,
    )


def lambda_handler(event, context):
    aws_default_region = os.getenv("AWS_DEFAULT_REGION")
    sender = os.getenv("SENDER")
    recipient_override = os.getenv("RECIPIENT")
    table_name = os.getenv("TABLE_NAME")
    finnhub_api = os.getenv("FINNHUB_API")

    ses_client = boto3.client("ses", region_name=aws_default_region)
    dynamodb_resource = boto3.resource("dynamodb", region_name=aws_default_region)
    finnhub_client = finnhub.Client(api_key=finnhub_api)

    try:
        table = dynamodb_resource.Table(table_name)
        response = table.scan()
        items = list(response.get("Items", []))

        while "LastEvaluatedKey" in response:
            response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            items.extend(response.get("Items", []))

        portfolios = normalize_portfolios(items)
        sent_count = 0

        for portfolio in portfolios:
            recipient = recipient_override or portfolio.get("email")
            if not recipient:
                continue

            stock_data = []
            for holding in portfolio["holdings"][:3]:
                stock_data.append(
                    {
                        "symbol": holding["symbol"],
                        "quantity": holding["quantity"],
                        "news": get_headlines(holding["symbol"], finnhub_client),
                    }
                )

            if not stock_data:
                continue

            send_portfolio_email(
                ses_client=ses_client,
                sender=sender,
                recipient=recipient,
                stock_data=stock_data,
            )
            sent_count += 1

        return f"Sent {sent_count} portfolio emails successfully."
    except ClientError as error:
        print(error.response["Error"]["Message"])
        raise
