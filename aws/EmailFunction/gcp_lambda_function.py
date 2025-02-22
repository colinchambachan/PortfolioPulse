"""
AWS Lambda function using GMAIL api to send email

"""
import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from datetime import date, timedelta
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'libraries'))
import smtplib
import base64
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import finnhub
import requests



def get_headlines(symbol, client):
    res = []
    date_today = date.today()
    date_prev = date.today() - timedelta(5)
    data = client.company_news(symbol, _from=date_prev, to=date_today)

    for i in range(min(len(data), 3)):
        res.append((data[i]["headline"], data[i]["url"]))

    return res


def get_email_body(stock_data):
    SUBJECT = "PortfolioPulse - Your Daily Insight"
    BODY_TEXT = "This email was sent using Gmail API OAuth 2.0."

    stock_list_items = ""
    stocks_with_news = []
    stocks_without_news = []

    for stock in stock_data:
        if stock['news']:
            stocks_with_news.append(stock)
        else:
            stocks_without_news.append(stock)

    sorted_stocks = stocks_with_news + stocks_without_news
    sorted_stocks = sorted_stocks[:min(3, len(sorted_stocks))]

    for stock in sorted_stocks:
        stock_item_html = f"<div class='stock-card'><div class='stock-header'><h3 class='stock-symbol'>{stock['symbol']}</h3><span class='stock-quantity'>{str(stock['quantity'])} shares</span></div>"
        stock_item_html += "<ul class='news-list'>"
        
        if stock['news']:
            for news_item in stock['news']:
                stock_item_html += f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>"
        else:
            stock_item_html += "<li>No New Updates!</li>"
        
        stock_item_html += "</ul></div>"
        stock_list_items += stock_item_html
    with open('email_template.html', 'r') as file:
        BODY_HTML = file.read()

    BODY_HTML = BODY_HTML.replace('{SUBJECT}', SUBJECT)
    BODY_HTML = BODY_HTML.replace('{stock_list_items}', stock_list_items)

    return SUBJECT, BODY_TEXT, BODY_HTML


def refresh_access_token(client_id, client_secret, refresh_token):
    # Get Access token via refresh token
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }

    TOKEN_URL = "https://oauth2.googleapis.com/token"
    response = requests.post(TOKEN_URL, data=payload)
    
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Failed to refresh token: {response.text}")


def send_email_via_gmail_oauth(subject, body_text, body_html, recipient, sender, access_token):
    # Send email (Using Gmail API)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient

    msg.attach(MIMEText(body_text, "plain"))
    msg.attach(MIMEText(body_html, "html"))

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode()

    gmail_api_url = f"https://gmail.googleapis.com/gmail/v1/users/{sender}/messages/send"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    payload = json.dumps({"raw": raw_message})

    response = requests.post(gmail_api_url, headers=headers, data=payload)

    if response.status_code == 200:
        return "Email sent successfully!"
    else:
        return f"Failed to send email: {response.text}"


def lambda_handler(event, context):
    AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
    SENDER = os.getenv("SENDER")  
    RECIPIENT = os.getenv("RECIPIENT") 
    TABLE_NAME = os.getenv("TABLE_NAME")
    FINNHUB_API = os.getenv("FINNHUB_API")
    CLIENT_ID = os.getenv("CLIENT_ID") 
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")  
    REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")  

    dynamodb_resource = boto3.resource('dynamodb', region_name=AWS_DEFAULT_REGION)
    finnhub_client = finnhub.Client(api_key=FINNHUB_API)

    try:
        table = dynamodb_resource.Table(TABLE_NAME)
        response = table.scan()
        users = {item['user'] for item in response['Items']}  # Get unique users
       
        # oauth access token
        access_token = refresh_access_token(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
        
        for user in users:
            filtering_exp = Key("user").eq(user)
            user_response = table.scan(FilterExpression=filtering_exp)
            sorted_items = sorted(user_response['Items'], key=lambda x: x['quantity'], reverse=True)

            stock_data = []
            for item in sorted_items:
                temp = {
                    "symbol": item["symbol"],
                    "quantity": item["quantity"],
                    "news": get_headlines(item["symbol"], finnhub_client),
                }
                stock_data.append(temp)

            SUBJECT, BODY_TEXT, BODY_HTML = get_email_body(stock_data)

            send_email_via_gmail_oauth(SUBJECT, BODY_TEXT, BODY_HTML, user, SENDER, access_token)

        return {"message": "Emails sent successfully!"}
    except Exception as error:
        return {"error": str(error)}
