from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_uploaded_file(file):
    """Save uploaded file with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return filepath

@app.route('/ocr', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        logger.error("No file part in request")
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error("Empty filename received")
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Save original file
        filepath = save_uploaded_file(file)
        logger.info(f"Processing file: {filepath}")

        if file.filename.lower().endswith('.pdf'):
            # PDF processing
            text = extract_pdf_text(filepath)
            return jsonify({
                'text': text,
                'fileType': 'pdf',
                'originalPath': filepath
            })
        else:
            # Image processing
            text = extract_image_text(filepath)
            return jsonify({
                'text': text,
                'fileType': 'image',
                'originalPath': filepath
            })

    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def extract_pdf_text(filepath):
    """Extract text from PDF using PyMuPDF"""
    text = ""
    try:
        doc = fitz.open(filepath)
        for page in doc:
            text += page.get_text()
        return text.strip()
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")

def extract_image_text(filepath):
    """Extract text from image using Tesseract"""
    try:
        image = Image.open(filepath)
        # Preprocessing for better OCR
        image = image.convert('L')  # Grayscale
        return pytesseract.image_to_string(image).strip()
    except Exception as e:
        raise Exception(f"Image processing failed: {str(e)}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)