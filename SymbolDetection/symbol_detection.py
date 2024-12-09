import boto3
from botocore.exceptions import ClientError
import env
import os

def lambda_handler(event, context):
     # Get env constants
    AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
    SNS_TOPIC = os.getenv("SNS_TOPIC")
    ROLE_ARN = os.getenv("ROLE_ARN")
    
    try:
        # s3 = boto3.client('s3', region_name=AWS_DEFAULT_REGION)
        textract = boto3.client('textract', region_name=AWS_DEFAULT_REGION)
        
        
        # Extract bucket name and object key from the event
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        document_name = event['Records'][0]['s3']['object']['key']
        

    
        # for reading body stream file
        # statment_document = s3.get_object(Bucket=bucket_name, Key=document_name)
        # statment_document_content = statment_document['Body'].read()

        response = textract.start_document_analysis(
                DocumentLocation={
                    "S3Object": {"Bucket": bucket_name, "Name": document_name}
                },
                NotificationChannel={
                    "SNSTopicArn": SNS_TOPIC,
                    "RoleArn": ROLE_ARN,
                },
                FeatureTypes=["TABLES"],
            )
        job_id = response["JobId"]
        print("job id:", job_id)
        

    except ClientError as e:
        print(e.response['Error']['Message'])

    else:
        return "done"