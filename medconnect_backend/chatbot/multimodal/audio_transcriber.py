import os
import tempfile
from faster_whisper import WhisperModel
from pydub import AudioSegment


# -------------------------
# LOAD WHISPER MODEL (Lazy loading)
# -------------------------

# Options: tiny | base | small | medium | large-v2
# Recommended for medical: "small" (balance of speed + accuracy)

_model = None


def get_whisper_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            model_size_or_path="small",
            device="cpu",
            compute_type="int8"
        )
    return _model


# -------------------------
# MAIN TRANSCRIBER
# -------------------------

def transcribe_audio(uploaded_file):
    """
    Transcribes medical audio into clean text (offline, open-source).
    """
    temp_audio_path = None

    try:
        # Save uploaded audio temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            audio = AudioSegment.from_file(uploaded_file)
            audio = audio.set_channels(1).set_frame_rate(16000)
            audio.export(temp_audio.name, format="wav")
            temp_audio_path = temp_audio.name

        # Transcription
        model = get_whisper_model()
        segments, _ = model.transcribe(
            temp_audio_path,
            language="en",
            vad_filter=True
        )

        text_chunks = [segment.text for segment in segments]
        text = " ".join(text_chunks).strip()

        if not text:
            return "No clear speech detected in the audio."

        return clean_transcribed_text(text)

    except Exception as e:
        return f"Audio transcription error: {str(e)}"

    finally:
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)


# -------------------------
# CLEANING FUNCTION
# -------------------------

def clean_transcribed_text(text: str):
    """
    Cleans and normalizes medical speech text.
    """

    replacements = {
        "bp": "blood pressure",
        "sugar": "blood sugar",
        "doc": "doctor",
        "med": "medicine",
        "tab": "tablet",
        "caps": "capsule"
    }

    text = text.lower()

    for key, value in replacements.items():
        text = text.replace(f" {key} ", f" {value} ")

    return text.capitalize()
