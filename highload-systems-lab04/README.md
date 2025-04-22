# Lightbulb Control System

A simple system for controlling a virtual lightbulb using gRPC communication between a Python server and a React frontend.

## Features

- Turn the lightbulb on and off
- Adjust brightness (0-100%)
- Change color temperature (2700K-6500K)
- Real-time visualization of the lightbulb state

## Project Structure

```
.
├── backend/                 # Python gRPC server
│   ├── proto/               # Protocol Buffer definitions 
│   ├── server.py            # Server implementation
│   ├── generate_protos.py   # Script to generate gRPC code
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # React source code
│   │   ├── components/      # React components
│   │   ├── services/        # gRPC service client
│   │   └── proto/           # Generated gRPC web code
│   └── package.json         # Node.js dependencies
├── envoy.yaml               # Envoy proxy configuration for gRPC-Web
└── docker-compose.yml       # Docker Compose for Envoy
```

## Setup and Running

### Prerequisites

- Python 3.7+
- Node.js 14+
- Docker and Docker Compose (for the Envoy proxy)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Generate Python code from protobuf definitions:
   ```
   ./generate_protos.sh
   ```

4. Start the gRPC server:
   ```
   python server.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Generate JavaScript code from protobuf definitions:
   ```
   npm run generate-proto
   ```

4. Start the React development server:
   ```
   npm start
   ```

### Envoy Proxy (for gRPC-Web)

Start the Envoy proxy using Docker Compose:
```
docker compose up -d
```

## Accessing the Application

After starting all components, you can access the application at:
- Frontend: http://localhost:3000

## Architecture

- The Python server implements the gRPC service defined in the protobuf file
- The Envoy proxy translates between gRPC-Web (browser) and gRPC (server)
- The React frontend communicates with the server via gRPC-Web

## Technologies Used

- gRPC and Protocol Buffers
- Python
- React.js
- Envoy Proxy
- Docker