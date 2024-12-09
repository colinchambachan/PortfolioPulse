import json
import boto3
import os
# from dotenv import load_dotenv
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from datetime import date, timedelta
# need to include library in aws config files
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'libraries'))
import finnhub
import env

"""
get 3 headlines for the past 5 days for stock symbol
"""
def get_headlines(symbol, client):
    res = []
    
    date_today = date.today()
    date_prev = date.today()-timedelta(5)
    data=client.company_news(symbol, _from=date_prev, to=date_today)
    
    for i in range(3):
        res.append((data[i]["headline"], data[i]["url"]))

    return res


def get_email_body(stock_data):
    # The subject line for the email.
    SUBJECT = "PortfolioPulse - Your Daily Insight"

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = ("Amazon SES Test (Python)\r\n"
                    "This email was sent with Amazon SES using the "
                    "AWS SDK for Python (Boto)."
                    )
    
    BODY_HTML = """<html>
                <head>
                </head>
                <body>
                    <h1>{subject}</h1>
                    
                    <p>Portfolio Update:</p>
                    <ul>
                        {stock_list}
                    </ul>
                </body>
                </html>"""
    
    # Generate stock list HTML
    stock_list_items = "".join([
                f"<h3><b>{stock['symbol']} ({stock['quantity']} Shares)</b></h3><ul>" +
                "".join([f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>" for news_item in stock['news']]) +
                "</ul>"
                for stock in stock_data
                ])
    BODY_HTML = BODY_HTML.format(stock_list=stock_list_items, subject=SUBJECT)
    
    return SUBJECT, BODY_TEXT, BODY_HTML

def lambda_handler(event, context):
    # Get env constants
    AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
    SENDER = os.getenv("SENDER")
    RECIPIENT = os.getenv("RECIPIENT")
    TABLE_NAME = os.getenv("TABLE_NAME")
    FINNHUB_API = os.getenv("FINNHUB_API")

    
    # Resource declarations
    ses = boto3.client('ses', region_name=AWS_DEFAULT_REGION)
    dynamodb_resource = boto3.resource('dynamodb', region_name=AWS_DEFAULT_REGION)
    finnhub_client = finnhub.Client(api_key=FINNHUB_API)
    
    try:

        # query table for stock expressions under colin
        table = dynamodb_resource.Table(TABLE_NAME)
        # filter for user colin
        filtering_exp = Key("user").eq("colin")
        response = table.scan(FilterExpression=filtering_exp)
        sorted_items = sorted(response['Items'], key=lambda x: x['quantity'], reverse=True)

        stock_data = []
        for item in sorted_items:
            temp = {}
            temp["symbol"] = item["symbol"]
            temp["quantity"] =  item["quantity"]
            temp["news"] = get_headlines(item["symbol"], finnhub_client)
            stock_data.append(temp)

        # email body formatting
        CHARSET = "UTF-8"
        SUBJECT, BODY_TEXT, BODY_HTML = get_email_body(stock_data)

        # Send an email notification using SES
        response = ses.send_email(
        Destination={
            'ToAddresses': [
                RECIPIENT,
            ],
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': CHARSET,
                    'Data': BODY_HTML,
                },
                'Text': {
                    'Charset': CHARSET,
                    'Data': BODY_TEXT,
                },
            },
            'Subject': {
                'Charset': CHARSET,
                'Data': SUBJECT,
            },
        },
        Source=SENDER,
        
    )

       
    except ClientError as e:
        print(e.response['Error']['Message'])

    else:
        return 'Email sent successfully!'


