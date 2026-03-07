import joblib
from pathlib import Path
import warnings

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model/xgb_model.joblib"
ENCODER_PATH = BASE_DIR / "model/label_encoder.joblib"

model = None
label_encoder = None

def load_models():
    """Lazy load ML models to avoid import-time errors during migrations"""
    global model, label_encoder
    if model is None:
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model = joblib.load(MODEL_PATH)
                label_encoder = joblib.load(ENCODER_PATH)
        except Exception as e:
            print(f"Warning: Could not load ML models: {e}")
            model = None
            label_encoder = None
    return model, label_encoder
