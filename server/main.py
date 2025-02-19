from typing import Union
from fastapi import FastAPI, File, UploadFile
import pytesseract
from PIL import Image
import io
from pdf2image import convert_from_bytes
import re


app = FastAPI()

@app.get("/")
def read_root(user: Union[str, None] = None):
    return {"Hello": user}



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








