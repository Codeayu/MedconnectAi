import os
from google import genai
from google.genai import types

# -------------------------
# GEMINI CLIENT
# -------------------------

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-2.0-flash"  # Updated to stable model

# -------------------------
# PROMPTS
# -------------------------

SYSTEM_PROMPT = """
You are MedConnect AI, a helpful and knowledgeable medical information assistant.

Your role is to:
- Provide accurate, helpful health information
- Explain medical concepts in simple, easy-to-understand language
- Give practical self-care advice for common conditions
- Always encourage consulting a healthcare professional for serious concerns
- Be empathetic and supportive

Rules:
- Do NOT provide definitive diagnoses
- Do NOT prescribe specific medication dosages
- Do NOT replace professional medical advice
- If uncertain, clearly state limitations
- Always complete your responses fully
"""

ROUTE_INSTRUCTIONS = {
    "DRUG_INFO": """
You are answering a question about medication. Provide:
- What the medication is used for
- Common side effects to be aware of
- General precautions
- When to consult a doctor
Do NOT provide specific dosage instructions.
""",
    "RAG": """
Provide a helpful, complete response using your medical knowledge.
Include:
- Clear explanation of the condition/topic
- Practical advice and self-care tips
- Warning signs that require medical attention
- When to see a doctor
Keep your response comprehensive but easy to understand.
""",
    "EMERGENCY": """
This is an emergency situation. Reinforce urgency and advise immediate medical attention.
Provide basic first-aid guidance while emphasizing the need for professional help.
"""
}

DISCLAIMER = (
    "\n\n⚠️ **Medical Disclaimer:**\n"
    "This information is for educational purposes only and does not replace professional medical advice. "
    "Always consult a qualified healthcare provider before making medical decisions."
)

# -------------------------
# MAIN GENERATOR
# -------------------------

def generate_response(user_query: str, context: dict) -> str:
    try:
        route = context.get("route", "RAG")
        ctx = context.get("context", "")

        if isinstance(ctx, list):
            ctx = "\n".join(str(item) for item in ctx)

        # ---------- BUILD PROMPT ----------
        prompt = SYSTEM_PROMPT.strip() + "\n\n"

        # Add context if available
        if ctx and ctx.strip():
            if route == "DRUG_INFO":
                prompt += f"**Drug Information Context:**\n{ctx}\n\n"
            elif route == "RAG":
                prompt += f"**Medical Knowledge Context:**\n{ctx}\n\n"
        
        if route == "EMERGENCY":
            prompt += f"**Emergency Alert:** {context.get('message', '')}\n\n"

        # Add route-specific instructions
        prompt += f"**Instructions:** {ROUTE_INSTRUCTIONS.get(route, ROUTE_INSTRUCTIONS['RAG'])}\n\n"
        
        # Add user question
        prompt += f"**User Question:** {user_query}\n\n"
        prompt += "**Your Response (provide a complete, helpful answer):**"

        print(f"📝 Prompt being sent to Gemini:\n{prompt[:500]}...")  # Debug log

        # ---------- GEMINI CALL ----------
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=2048,  # Increased for complete responses
                top_p=0.9,
                top_k=40
            )
        )

        print(f"📨 Gemini response received: {response}")  # Debug log

        if not response:
            raise RuntimeError("No response from Gemini")
        
        if not response.text:
            # Check if response was blocked
            if hasattr(response, 'prompt_feedback'):
                print(f"⚠️ Prompt feedback: {response.prompt_feedback}")
            raise RuntimeError("Empty Gemini response text")

        final_answer = response.text.strip()

        # Ensure disclaimer is present
        if "Medical Disclaimer" not in final_answer:
            final_answer += DISCLAIMER

        return final_answer

    except Exception as e:
        print(f"🔥 Gemini Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        
        # Provide a helpful fallback response based on the query
        fallback = generate_fallback_response(user_query)
        return fallback + DISCLAIMER


def generate_fallback_response(query: str) -> str:
    """Generate a helpful fallback when API fails"""
    query_lower = query.lower()
    
    if "fever" in query_lower:
        return """**Managing Fever at Home:**

Here are some general tips for managing a fever:

1. **Rest** - Your body needs energy to fight infection
2. **Stay Hydrated** - Drink plenty of water, clear broths, or electrolyte drinks
3. **Cool Compress** - Apply a cool, damp cloth to your forehead
4. **Light Clothing** - Wear lightweight clothes and use light bedding
5. **Room Temperature** - Keep your room comfortably cool

**When to Seek Medical Care:**
- Fever above 103°F (39.4°C)
- Fever lasting more than 3 days
- Severe headache, stiff neck, or confusion
- Difficulty breathing
- Persistent vomiting
- Rash or unusual symptoms

**Note:** Over-the-counter medications like acetaminophen or ibuprofen can help reduce fever, but consult a pharmacist or doctor for appropriate use."""

    elif "headache" in query_lower:
        return """**Managing Headaches:**

1. **Rest** in a quiet, dark room
2. **Hydrate** - Dehydration often causes headaches
3. **Cold or Warm Compress** - Apply to forehead or neck
4. **Reduce Screen Time** - Take breaks from screens
5. **Gentle Massage** - Temples and neck area

**Seek Medical Care If:**
- Sudden, severe headache ("worst headache of your life")
- Headache with fever, stiff neck, confusion
- Headache after head injury
- Persistent or worsening headaches"""

    else:
        return """I apologize, but I'm having trouble generating a complete response right now.

**General Health Advice:**
- If you're experiencing concerning symptoms, please consult a healthcare provider
- For emergencies, call emergency services immediately
- Keep track of your symptoms to share with your doctor

Please try asking your question again, or consult with a medical professional for personalized advice."""
