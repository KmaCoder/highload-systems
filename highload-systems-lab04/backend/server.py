import grpc
from concurrent import futures
import time
import logging
import signal
import sys

# Import the generated proto modules
import lightbulb_pb2 as lightbulb_pb2
import lightbulb_pb2_grpc as lightbulb_pb2_grpc
from lightbulb_servicer import LightbulbServicer
from rabbitmq_publisher import publisher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

port = '50051'

def serve():
    """Start the gRPC server."""
    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add the servicer to the server
    lightbulb_servicer = LightbulbServicer()
    lightbulb_pb2_grpc.add_LightbulbServiceServicer_to_server(
        lightbulb_servicer, server)
    
    # Listen on port 50051 (explicitly on all interfaces with IPv4)
    server.add_insecure_port(f'0.0.0.0:{port}')
    
    # Start the server
    server.start()
    logger.info(f"Server started, listening on port {port}")
    
    # Define signal handler for graceful shutdown
    def signal_handler(sig, frame):
        logger.info("Shutting down server...")
        # Close RabbitMQ connection
        publisher.close()
        # Stop the server
        server.stop(0)
        logger.info("Server shut down complete")
        sys.exit(0)
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Keep the server running
    try:
        while True:
            time.sleep(86400)  # Sleep for a day
    except KeyboardInterrupt:
        # This will trigger the signal handler
        pass


if __name__ == '__main__':
    serve() 