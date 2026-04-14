#!/usr/bin/env bash

set -euo pipefail

TABLE_NAME="${TABLE_NAME:-portfolio_symbols_dev}"
AWS_REGION="${AWS_REGION:-us-east-1}"

if aws dynamodb describe-table \
  --table-name "$TABLE_NAME" \
  --region "$AWS_REGION" \
  >/dev/null 2>&1; then
  echo "DynamoDB table '$TABLE_NAME' already exists in region '$AWS_REGION'."
else
  aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions \
      AttributeName=user,AttributeType=S \
      AttributeName=quantity,AttributeType=N \
    --key-schema \
      AttributeName=user,KeyType=HASH \
      AttributeName=quantity,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region "$AWS_REGION"
fi

aws dynamodb wait table-exists \
  --table-name "$TABLE_NAME" \
  --region "$AWS_REGION"

aws dynamodb describe-table \
  --table-name "$TABLE_NAME" \
  --region "$AWS_REGION" \
  --query 'Table.{TableName:TableName,TableStatus:TableStatus,TableArn:TableArn}' \
  --output table
