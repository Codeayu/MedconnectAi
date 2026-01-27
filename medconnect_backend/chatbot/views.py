from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging
import traceback

from chatbot.router import route_request
from chatbot.generator import generate_response
from chatbot.safety import apply_safety_checks

from chatbot.multimodal.image_ocr import extract_text_from_image
from chatbot.multimodal.pdf_parser import extract_text_from_pdf

try:
    from chatbot.multimodal.audio_transcriber import transcribe_audio
except ImportError:
    transcribe_audio = None


logger = logging.getLogger(__name__)


@api_view(["POST"])
def medical_chatbot(request):
    """
    Main entry point for MedConnect multimodal chatbot
    """
    try:
        user_text = request.data.get("text", "").strip()
        uploaded_file = request.FILES.get("file")

        extracted_text = ""
        input_sources = []

        print(f"📥 Received chatbot request: text='{user_text[:100] if user_text else 'None'}...'")

        # ---------- MULTIMODAL INPUT HANDLING ----------
        if uploaded_file:
            file_type = uploaded_file.content_type
            print(f"📎 File uploaded: {uploaded_file.name} ({file_type})")

            try:
                if file_type.startswith("image/"):
                    extracted_text = extract_text_from_image(uploaded_file)
                    input_sources.append("image")

                elif file_type == "application/pdf":
                    extracted_text = extract_text_from_pdf(uploaded_file)
                    input_sources.append("pdf")

                elif file_type.startswith("audio/") and transcribe_audio:
                    extracted_text = transcribe_audio(uploaded_file)
                    input_sources.append("audio")

                else:
                    return Response(
                        {"error": "Unsupported file type"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                print(f"⚠️ File processing error: {e}")
                logger.error(f"File processing error: {e}")

        # ---------- COMBINE INPUT ----------
        final_input_text = "\n".join(
            part for part in [user_text, extracted_text] if part
        ).strip()

        if not final_input_text:
            return Response(
                {"error": "No valid input provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        print(f"📝 Processing query: {final_input_text[:150]}...")
        logger.info(f"Input Sources: {input_sources}")
        logger.info(f"Final Input Text: {final_input_text[:200]}")

        # ---------- ROUTING ----------
        context_data = route_request(final_input_text)
        route = context_data.get("route")
        print(f"🔀 Route determined: {route}")

        # ---------- EMERGENCY SHORT-CIRCUIT ----------
        if route == "EMERGENCY":
            emergency_message = context_data.get("message", "")
            safe_message = apply_safety_checks(
                llm_response=emergency_message,
                user_query=final_input_text
            )
            return Response(
                {
                    "query": final_input_text,
                    "route": route,
                    "response": safe_message or emergency_message
                },
                status=status.HTTP_200_OK
            )

        # ---------- LLM GENERATION ----------
        print("🤖 Generating LLM response...")
        raw_response = generate_response(
            user_query=final_input_text,
            context=context_data
        )
        print(f"✅ LLM response generated ({len(raw_response)} chars)")

        # ---------- SAFETY FILTER ----------
        safe_response = apply_safety_checks(
            llm_response=raw_response,
            user_query=final_input_text,
            route=route,
            confidence=context_data.get("confidence")
        )

        # ---------- FINAL RESPONSE ----------
        return Response(
            {
                "query": final_input_text,
                "route": route,
                "input_sources": input_sources,
                "response": safe_response
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"🔥 Chatbot Error: {type(e).__name__}: {e}")
        traceback.print_exc()
        logger.error(f"Chatbot error: {e}", exc_info=True)
        
        return Response(
            {
                "error": "An error occurred processing your request. Please try again.",
                "response": (
                    "I apologize, but I encountered an error processing your request. "
                    "Please try again or rephrase your question.\n\n"
                    "⚠️ **Medical Disclaimer:** This information is for educational purposes only "
                    "and does not replace professional medical advice."
                )
            },
            status=status.HTTP_200_OK  # Return 200 so frontend shows the message
        )
