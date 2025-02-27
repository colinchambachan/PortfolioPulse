import boto3
from botocore.exceptions import ClientError

region = 'us-east-1'  

ses = boto3.client('ses', region_name=region)

try:
    response = ses.send_email(
        Source='colin.chambachan@gmail.com',
        Destination={
            'ToAddresses': [
                'colin.chambachan@gmail.com',
            ],
        },
        Message={
            'Subject': {
                'Data': 'Test Email',
            },
            'Body': {
                'Text': {
                    'Data': 'This is a test email once again.',
                },
            },
        }
    )
    print("Email sent! Message ID:", response['MessageId'])
except ClientError as e:
    print("An error occurred:", e)
