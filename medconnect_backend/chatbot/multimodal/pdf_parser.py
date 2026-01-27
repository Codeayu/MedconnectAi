import fitz  # PyMuPDF
import tempfile
import os
import pytesseract
import cv2
import numpy as np


# -------------------------
# MAIN PDF PARSER
# -------------------------

def extract_text_from_pdf(uploaded_file):
    """
    Extracts text from medical PDF files.
    Supports both text-based and scanned PDFs.
    """
    temp_pdf_path = None

    try:
        # Save PDF temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            for chunk in uploaded_file.chunks():
                temp_pdf.write(chunk)
            temp_pdf_path = temp_pdf.name

        pdf_document = fitz.open(temp_pdf_path)

        extracted_text = ""

        for page in pdf_document:
            page_text = page.get_text("text")
            if page_text.strip():
                extracted_text += page_text + "\n"

        # ---------- OCR FALLBACK ----------
        if not extracted_text.strip():
            extracted_text = ocr_scanned_pdf(pdf_document)

        pdf_document.close()

        if not extracted_text.strip():
            return "No readable text found in the PDF. It may be a low-quality scan."

        return clean_medical_text(extracted_text)

    except Exception as e:
        return f"Error extracting PDF text: {str(e)}"

    finally:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)


# -------------------------
# OCR FOR SCANNED PDFs
# -------------------------

def ocr_scanned_pdf(pdf_document):
    """
    Performs OCR on scanned PDF pages.
    """

    text = ""

    for page in pdf_document:
        pix = page.get_pixmap(dpi=300)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
            pix.height, pix.width, pix.n
        )

        if pix.n == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

        page_text = pytesseract.image_to_string(
            gray,
            config="--oem 3 --psm 6"
        )

        text += page_text + "\n"

    return text


# -------------------------
# TEXT CLEANING
# -------------------------

def clean_medical_text(text):
    """
    Cleans extracted medical text for LLM & RAG usage.
    """

    text = text.replace("\n", " ")
    text = " ".join(text.split())

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
