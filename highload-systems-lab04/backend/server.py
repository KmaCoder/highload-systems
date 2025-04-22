import grpc
from concurrent import futures
import time
import logging

# Import the generated proto modules
import lightbulb_pb2 as lightbulb_pb2
import lightbulb_pb2_grpc as lightbulb_pb2_grpc
from lightbulb_servicer import LightbulbServicer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def serve():
    """Start the gRPC server."""
    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add the servicer to the server
    lightbulb_pb2_grpc.add_LightbulbServiceServicer_to_server(
        LightbulbServicer(), server)
    
    # Listen on port 50051 (explicitly on all interfaces with IPv4)
    port = '50051'
    server.add_insecure_port(f'0.0.0.0:{port}')
    server.start()
    
    logger.info(f"Server started, listening on port {port}")
    
    try:
        # Keep thread alive
        while True:
            time.sleep(86400)  # One day in seconds
    except KeyboardInterrupt:
        server.stop(0)
        logger.info("Server stopped")


if __name__ == '__main__':
    serve() 