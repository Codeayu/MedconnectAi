import cv2
import pytesseract
import numpy as np
from PIL import Image
import tempfile
import os
import shutil


# Auto-detect Tesseract path (uses system PATH first, falls back to common install locations)
if shutil.which('tesseract'):
    # Tesseract is in system PATH - no need to set path
    pass
elif os.path.exists(r"C:\Program Files\Tesseract-OCR\tesseract.exe"):
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# -------------------------
# MAIN OCR FUNCTION
# -------------------------

def extract_text_from_image(uploaded_file):
    """
    Extracts text from prescription or medical images.
    """
    temp_img_path = None

    try:
        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_img:
            for chunk in uploaded_file.chunks():
                temp_img.write(chunk)
            temp_img_path = temp_img.name

        # Load image
        image = cv2.imread(temp_img_path)

        if image is None:
            return "Unable to read the image file."

        # Preprocess
        processed = preprocess_image(image)

        # OCR configuration tuned for medical text
        custom_config = r"--oem 3 --psm 6"

        text = pytesseract.image_to_string(
            processed,
            config=custom_config
        )

        if not text.strip():
            return "No readable text found in the image."

        return clean_medical_text(text)

    except Exception as e:
        return f"OCR Error: {str(e)}"

    finally:
        if temp_img_path and os.path.exists(temp_img_path):
            os.remove(temp_img_path)


# -------------------------
# IMAGE PREPROCESSING
# -------------------------

def preprocess_image(image):
    """
    Improves image quality for OCR (medical documents).
    """

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize (improves OCR accuracy)
    gray = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_LINEAR)

    # Noise removal
    gray = cv2.medianBlur(gray, 3)

    # Contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    # Thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 2
    )

    return thresh


# -------------------------
# TEXT CLEANING
# -------------------------

def clean_medical_text(text):
    """
    Cleans OCR output safely for medical understanding.
    """
    # Basic cleaning
    text = text.replace("\n", " ")
    text = " ".join(text.split())

    # Common OCR corrections for medical terms
    replacements = {
        "mg.": "mg",
        "ml.": "ml",
        "tab.": "tablet",
        "cap.": "capsule",
        "inj.": "injection",
        "syr.": "syrup"
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    return text.strip()
