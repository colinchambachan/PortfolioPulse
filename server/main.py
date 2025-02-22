from typing import Union
from decimal import Decimal
from fastapi import FastAPI, File, UploadFile
import pytesseract
from PIL import Image
import io
from pdf2image import convert_from_bytes
import re
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
import env


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://portfoliopulse.xyz" ], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def get_aws_credentials():
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    region = os.getenv("AWS_REGION")
    return aws_access_key_id, aws_secret_access_key, region

def get_ddb_connection():
    aws_access_key_id, aws_secret_access_key, region = get_aws_credentials()
    dynamodb = boto3.resource('dynamodb', region_name=region, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    return dynamodb

@app.get("/")
def read_root(user: Union[str, None] = None):
    return {"Hello": user}


@app.post("/user")
async def create_user(obj: dict):
    print(obj["email"], obj["portfolio"])
    ddb = get_ddb_connection()
    TABLE_NAME = os.getenv("TABLE_NAME")
    table = ddb.Table(TABLE_NAME)
    for symbol, quantity in obj["portfolio"].items():
        table.put_item(Item={
            "user": obj["email"],
            "quantity": Decimal(str(quantity)),
            "symbol": str(symbol)
        })
    return {"message": "User created successfully!"}

@app.delete("/user")
async def delete_user(email: str):
    ddb = get_ddb_connection()
    TABLE_NAME = os.getenv("TABLE_NAME")
    table = ddb.Table(TABLE_NAME)
    scan = table.scan()
    with table.batch_writer() as batch:
        for each in scan['Items']:
            if each['user'] == email:
                batch.delete_item(Key={
                    "user": email,
                    "quantity": each['quantity']
                })
    response = {"message": f"All items with user {email} have been deleted."}
    return response



def extract_stock_data(text: str):
    stock_data = {}

    pattern = r"([A-Z]{2,4})\s+([\d,\.]+)"

    matches = re.findall(pattern, text)

    for match in matches:
        symbol, quantity = match
        stock_data[symbol] = round(float(quantity.replace(",", "")), 2)
    
    return stock_data

@app.post("/extract-symbols")
async def create_upload_file(file: UploadFile):
    file_data = await file.read() 

    # Convert PDF pages to images
    if file.filename.endswith(".pdf"):
        
        images = convert_from_bytes(file_data)
        extracted_text = ""

        for img in images:
            extracted_text += pytesseract.image_to_string(img) + "\n"
    
    # Handle image files 
    else:
        image = Image.open(io.BytesIO(file_data))
        extracted_text = pytesseract.image_to_string(image)

    stock_data = extract_stock_data(extracted_text)

    return {"filename": file.filename, "extracted_text": stock_data}








