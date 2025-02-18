import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

region = 'us-east-1'  
TABLE_NAME="portfolio_symbols"

dynamodb_resource = boto3.resource('dynamodb', region_name=region)


try:
    table = dynamodb_resource.Table(TABLE_NAME)

    filtering_exp = Key("user").eq("colin")
    response = table.query(KeyConditionExpression=filtering_exp)

    for item in response.get("Items"):
        print(item["quantity"])
    

    
except ClientError as e:
    print("An error occurred:", e)
