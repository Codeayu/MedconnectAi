import re


def chunk_text(
    text,
    chunk_size=250,
    overlap=50
):
    """
    Splits medical text into semantically meaningful chunks.
    Sentence-aware with overlap.
    """

    # Normalize text
    text = re.sub(r"\s+", " ", text).strip()

    # Split into sentences
    sentences = re.split(r"(?<=[.!?])\s+", text)

    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        words = sentence.split()
        sentence_length = len(words)

        # If adding sentence exceeds chunk size
        if current_length + sentence_length > chunk_size:
            chunks.append(" ".join(current_chunk))

            # Overlap handling
            overlap_words = current_chunk[-overlap:] if overlap > 0 else []
            current_chunk = overlap_words + words
            current_length = len(current_chunk)
        else:
            current_chunk.extend(words)
            current_length += sentence_length

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
