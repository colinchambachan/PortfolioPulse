import boto3
import json
import env
import os
import re
from decimal import Decimal


def lambda_handler(event, context):
    try:
        # Initialize clients
        textract_client = boto3.client('textract')
        dynamodb = boto3.resource('dynamodb')
        TABLE_NAME = os.getenv("DYNAMO_TABLE")# DynamoDB table name
        table = dynamodb.Table(TABLE_NAME)



        # Parse SNS message
        for record in event['Records']:
            sns_message = json.loads(record['Sns']['Message'])
            job_id = sns_message['JobId']
            status = sns_message['Status']
            
            if status != 'SUCCEEDED':
                print(f"Job {job_id} did not succeed. Status: {status}")
                continue
            
            # Retrieve Textract results
            response = textract_client.get_document_analysis(JobId=job_id)
            
            # Parse the results to extract symbols and quantities
            parsed_data = parse_portfolio_data(response)
            
            symbols_and_quantities = extract_stock_symbols_and_quantities(parsed_data)
            
            for item in symbols_and_quantities:
                response = table.put_item(
                    Item={
                        'user': "colin",
                        'symbol': item['symbol'],
                        'quantity':  Decimal(str(round(item['quantity'], 1)))
                    }
                )
                        
            
            print(symbols_and_quantities)
            # # Write data to DynamoDB
            # write_to_dynamodb(parsed_data)
            
        return {"statusCode": 200, "response": symbols_and_quantities}
    
    except Exception as e:
        print(f"Error processing SNS message: {e}")
        return {"statusCode": 500, "body": str(e)}

 

def parse_portfolio_data(textract_response):
    """Parse Textract response for symbols and quantities."""
    extracted_data = []
    
    for block in textract_response['Blocks']:
        if block['BlockType'] == 'LINE':
            # Extract text and relationships for table cells
            cell_text = block.get('Text', '')
            extracted_data.append(cell_text)
    
    # Extract relevant rows (symbols, quantities, etc.) from the parsed data
    # (Custom parsing logic based on table structure)
    # symbols_and_quantities = extract_symbols_and_quantities(extracted_data)
    return extracted_data

def extract_stock_symbols_and_quantities(data):
    # Define a list to store the result
    result = []

    # Iterate over the input data
    for i in range(len(data)):
        # Check if the current item is a stock symbol and the next item is a quantity
        if re.match(r'^[A-Za-z]{1,5}$', data[i]) and i + 1 < len(data) and re.match(r'^\d+(\.\d+)?$', data[i + 1]):
            # Create a dictionary for the stock symbol and quantity
            stock_info = {
                "symbol": data[i],
                "quantity": float(data[i + 1])
            }
            result.append(stock_info)
    
    return result