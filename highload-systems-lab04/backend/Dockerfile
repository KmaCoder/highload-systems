FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose gRPC port
EXPOSE 50051

# Run the server
CMD ["python", "server.py"] 