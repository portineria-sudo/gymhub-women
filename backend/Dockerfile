FROM python:3.12-slim

LABEL maintainer="GymHub Women <hello@gymhubwomen.com>"
LABEL description="GymHub Women AI Coach — AMD × Fireworks AI Backend"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
