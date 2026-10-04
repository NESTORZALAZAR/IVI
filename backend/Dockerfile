FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        espeak \
        ffmpeg \
        tesseract-ocr \
        tesseract-ocr-spa \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 1000 user

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user:user . .
RUN chmod +x /app/entrypoint.sh

USER user

EXPOSE 7860
ENTRYPOINT ["/app/entrypoint.sh"]
