import json
import logging
import pika
import os
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class RabbitMQPublisher:
    def __init__(self, host=None, queue_name='lightbulb_events', username=None, password=None):
        self.host = host or os.environ.get('RABBITMQ_HOST', 'localhost')
        self.queue_name = queue_name
        self.username = username or os.environ.get('RABBITMQ_USER', 'guest')
        self.password = password or os.environ.get('RABBITMQ_PASS', 'guest')
        self.connection = None
        self.channel = None
        logger.info(f"Initializing RabbitMQ publisher with host: {self.host}")
        self._connect()
    
    def _connect(self):
        try:
            # Set up connection parameters and connect
            credentials = pika.PlainCredentials(self.username, self.password)
            parameters = pika.ConnectionParameters(
                host=self.host,
                credentials=credentials
            )
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            
            # Declare the queue
            self.channel.queue_declare(queue=self.queue_name, durable=False)
            
            logger.info(f"Successfully connected to RabbitMQ on {self.host}")
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {str(e)}")
            self.connection = None
            self.channel = None
    
    @contextmanager
    def ensure_connection(self):
        """Context manager to ensure connection is available."""
        if self.connection is None or self.connection.is_closed:
            self._connect()
        
        try:
            yield
        except pika.exceptions.AMQPError as e:
            logger.error(f"AMQP error during publishing: {str(e)}")
            self._connect()  # Try to reconnect
        except Exception as e:
            logger.error(f"Unexpected error during publishing: {str(e)}")
    
    def publish_event(self, event_type, data):
        """Publish an event to the RabbitMQ queue.
        
        Args:
            event_type (str): Type of event (e.g., 'power_changed', 'brightness_changed')
            data (dict): Data associated with the event
        """
        with self.ensure_connection():
            if self.channel is None:
                logger.error("Cannot publish message: RabbitMQ channel is not available")
                return False
            
            try:
                # Create message payload
                message = {
                    'event_type': event_type,
                    'data': data
                }
                
                # Publish the message
                self.channel.basic_publish(
                    exchange='',
                    routing_key=self.queue_name,
                    body=json.dumps(message),
                    properties=pika.BasicProperties(
                        delivery_mode=1,  # Non-persistent
                        content_type='application/json'
                    )
                )
                logger.info(f"Published event '{event_type}' to RabbitMQ")
                return True
            except Exception as e:
                logger.error(f"Failed to publish message: {str(e)}")
                return False
    
    def close(self):
        """Close the RabbitMQ connection."""
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            logger.info("RabbitMQ connection closed")

# A singleton instance
publisher = RabbitMQPublisher() 