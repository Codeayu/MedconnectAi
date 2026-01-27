import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "model/xgb_model.joblib"
ENCODER_PATH = BASE_DIR / "model/label_encoder.joblib"

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)
