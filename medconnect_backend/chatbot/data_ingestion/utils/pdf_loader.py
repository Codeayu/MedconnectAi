import fitz  # PyMuPDF
import pytesseract
import cv2
import numpy as np
import shutil
import os


# Auto-detect Tesseract path (uses system PATH first, falls back to common install locations)
if shutil.which('tesseract'):
    # Tesseract is in system PATH - no need to set path
    pass
elif os.path.exists(r"C:\Program Files\Tesseract-OCR\tesseract.exe"):
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def load_pdf_text(pdf_path):
    """
    Extracts clean text from medical PDFs.
    Supports both text-based and scanned PDFs.
    """

    doc = fitz.open(pdf_path)
    full_text = ""

    for page in doc:
        text = page.get_text("text")

        if text and text.strip():
            full_text += text + "\n"
        else:
            # OCR fallback for scanned pages
            full_text += ocr_pdf_page(page) + "\n"

    doc.close()

    return clean_text(full_text)


def ocr_pdf_page(page):
    """
    OCR for scanned PDF pages.
    """

    pix = page.get_pixmap(dpi=300)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
        pix.height, pix.width, pix.n
    )

    if pix.n == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    return pytesseract.image_to_string(
        gray,
        config="--oem 3 --psm 6"
    )


def clean_text(text):
    """
    Cleans extracted medical text for embeddings.
    """

    text = text.replace("\n", " ")
    text = " ".join(text.split())

    return text
