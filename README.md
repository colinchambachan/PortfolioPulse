# 📈 Portfolio Pulse

[https://www.portfoliopulse.xyz](https://www.portfoliopulse.xyz) <br>
_Daily stock insights delivered to your inbox with just a scan of your portfolio_

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://www.portfoliopulse.xyz)

<!-- [![Made with Python](https://img.shields.io/badge/Made%20with-Python-blue)](https://www.python.org/)
[![AWS Services](https://img.shields.io/badge/Powered%20by-AWS-orange)](https://aws.amazon.com/) -->

<img src="client\public\image.png" alt="Portfolio Pulse Demo" width="600"/>

## Overview

PortfolioPulse reshapes how you stay informed about your investments. Every morning at 6 AM, you receive curated news updates focused on your largest portfolio positions, helping you make informed decisions before the market opens.

## Key Features

- Automated portfolio analysis from PDF statements
- Daily personalized news digests
- Focus on your highest-value positions
- Real-time processing with AWS
- Modern, responsive web interface

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui

### Backend

- FastAPI (Python)
- AWS Services:
  - Lambda
  - SES (Simple Email Service)
  - SNS (Simple Notification Service)
  - S3
  - DynamoDB
  - Textract

## Workflow

1. User uploads portfolio statement (PDF)
2. SymbolDetection Lambda analyzes document via Textract (Tesseract in user-facing version)
3. Textract processes document and notifies SNS
4. Extracted symbols are stored in DynamoDB
5. Daily at 6 AM, EmailFunction Lambda:
   - Retrieves stored symbols
   - Fetches relevant news via News API
   - Delivers personalized insights via SES (Gmail SMTP in user-facing version)

## Roadmap

- [x] ~~CLI Tool~~ (Replaced with web app)
- [x] Email UI enhancements
- [ ] Portfolio performance analytics
- [ ] GenAI Recommendations, Summaries and insights

## Contact

Feel free to reach out with questions or feedback!
