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

"""
get 3 headlines for the past 5 days for stock symbol
"""
def get_headlines(symbol, client):
    res = []
    
    date_today = date.today()
    date_prev = date.today()-timedelta(5)
    data=client.company_news(symbol, _from=date_prev, to=date_today)
    
    for i in range(min(len(data), 3)):
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
    
    # BODY_HTML = """<html>
    #             <head>
    #             </head>
    #             <body>
    #                 <h1>{subject}</h1>
                    
    #                 <p>Portfolio Update:</p>
    #                 <ul>
    #                     {stock_list}
    #                 </ul>
    #             </body>
    #             </html>"""
    # stock_list_items = "".join([
    #     f"<div class='stock-item'><h3><b>{stock['symbol']} ({str(stock['quantity'])} Shares)</b></h3>" +
    #     "<ul class='news-list'>" +
    #     "".join([f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>" for news_item in stock['news']]) +
    #     "</ul></div>"
    #     for stock in stock_data
    # ])
    stock_list_items = ""
    for stock in stock_data:
        stock_item_html = f"<div class='stock-item'><h3><b>{stock['symbol']} ({str(stock['quantity'])} Shares)</b></h3>"
        stock_item_html += "<ul class='news-list'>"
        
        if stock['news']:
            for news_item in stock['news']:
                stock_item_html += f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>"
        else:
            stock_item_html += "<li>No New Updates!</li>"
        
        stock_item_html += "</ul></div>"
        stock_list_items += stock_item_html
    
    BODY_HTML = """
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #1f2937;
        text-align: center;
        padding: 20px;
        background-color: #6d28d9;
        color: white;
        margin: 0;
      }
      .container {
        width: 80%;
        margin: 20px auto;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        padding: 20px;
      }
      p {
        font-size: 18px;
        color: #4b5563;
        margin-bottom: 16px;
        line-height: 1.6;
      }
      .stock-item {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 15px;
        margin-bottom: 15px;
      }
      .stock-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      h3 {
        font-size: 20px;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 10px;
      }
      .news-list {
        list-style: none;
        padding: 0;
        margin-top: 10px;
      }
      .news-list li {
        margin-bottom: 8px;
      }
      .news-list a {
        color: #6d28d9;
        text-decoration: none;
        font-weight: 500;
      }
      .news-list a:hover {
        text-decoration: underline;
      }
      .no-updates {
        color: black;
        font-style: italic;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <h1>""" + SUBJECT + """</h1>

    <div class="container">
      <p><strong>Portfolio Update:</strong></p>
      <div>""" + stock_list_items + """</div>
    </div>

    <div class="footer">
      <p>Thank you for using our service!</p>
      <p>Feel free to reach out if you have any questions.</p>
    </div>
  </body>
</html>
"""


    # Generate stock list HTML
    # stock_list_items = "".join([
    #             f"<h3><b>{stock['symbol']} ({stock['quantity']} Shares)</b></h3><ul>" +
    #             "".join([f"<li><a href='{news_item[1]}'>{news_item[0]}</a></li>" for news_item in stock['news']]) +
    #             "</ul>"
    #             for stock in stock_data
    #             ])
    

    # print("Stock List Items: ", stock_list_items)
    # print("Subject: ", SUBJECT)
    print(stock_data)
    # BODY_HTML = BODY_HTML
    
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


