import json
import boto3
import os

def lambda_handler(event, context):
    # s3 = boto3.client('s3')
    ses = boto3.client('ses')
    
    
    # Extract bucket name and object key from the event
    # bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_name = event['Records'][0]['s3']['object']['key']
    
    # # Get the document from S3
    # s3_object = s3.list_objects_v2(Bucket=bucket_name)
    # document_content = s3_object['Body'].read().decode('utf-8')

    # Send an email notification using SES
    response = ses.send_email(
        Source='soccerdude1312@gmail.com',
        Destination={
            'ToAddresses': [
                'colin.chambachan@gmail.com',
            ],
        },
        Message={
            'Subject': {
                'Data': 'PortfolioPulse - New Document Uploaded',
            },
            'Body': {
                'Text': {
                    'Data': f'Hi there,\nThis message is to inform you that a new Document, named {object_name}, has been uploaded to your S3 bucket!\n\nRegards,\nPortfolioPulse',
                },
            },
        }
    )

    return 'Email sent successfully!'

 