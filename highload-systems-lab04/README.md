# Lightbulb Service with RabbitMQ Event Notification

This project demonstrates a smart lightbulb control system with gRPC for the main API and RabbitMQ for event notifications.

## Project Components

1. **Python Backend**: gRPC service for controlling the lightbulb
2. **Node.js Notification Service**: Express server that listens for RabbitMQ events
3. **RabbitMQ**: Message broker for event distribution
4. **Frontend**: React application to control the lightbulb (communicates with gRPC)

## Quick Start with Docker Compose

The easiest way to run all services together is using Docker Compose:

```bash
# At first build app containers for Python backend, Node.js notification service and React Frontend
docker compose build

# Start RabbitMQ, Envy Proxy for gRPC, and application containers
docker compose up -d
```

## Services & Ports

- **RabbitMQ**: 
  - AMQP: 5672
  - Management UI: 15672 (http://localhost:15672 - guest/guest)
- **Python Backend**: 50051
- **Envy gRPC Proxy**: 8080
- **Node.js Notification Service**: 50052
- **Frontend**: 3000

## Event Types

The system publishes the following event types to RabbitMQ:

- `power_changed`: When the lightbulb is turned on or off
- `brightness_changed`: When the brightness level is adjusted
- `color_temperature_changed`: When the color temperature is modified

Each event includes:
- `old_value`: The previous state value
- `new_value`: The new state value
- `current_state`: The complete current state of the lightbulb