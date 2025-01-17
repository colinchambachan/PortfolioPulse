# Portfolio Pulse

_Daily stock insights right to your inbox with the quick scan of a PDF_

## Description

Portfolio Pulse is a tool which delievers daily news updates to your inbox based on your stock portfolio. Each day at 6 am, the top stories based on your most-sizeable investments are collected and emailed to you so you can stay ahead of the market.

## Technology

### Tech Stack

- Python (boto3 AWS SDK)
- AWS Tools (Lambda, SES, SNS, S3, DynamoDB, Textract)

### Sample Workflow + Architecture

1. User submits PDF to S3 bucket (manually, for now)
2. On upload, SymbolDetection Lambda Function is triggered sending document to textract
3. Textract begins document analysis and creates notification pending to SNS
4. Once complete, Textract notifies SNS and Lambda function is triggered, writing the collected symbols (if any new) to DyanamoDB
5. EmailFunction Lambda function is triggered daily at 6am using cron job trigger, which collects symbols, feeds through News API, and delievers insights to email inbox via SES

## Future Iterations

Features on the agenda for future iterations:

- CLI Tool for Statement upload (and pdf to jpg conversion via ffmpeg)
- Email UI enhancements [COMPLETE]
- Gen AI Recommendations for Portfolio based on News

<!-- 2. Tech + Architecture

- Draw out workflow -->
