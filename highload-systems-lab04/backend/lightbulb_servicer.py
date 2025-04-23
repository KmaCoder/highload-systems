import logging
import time
import threading
import queue
import uuid
import lightbulb_pb2 as lightbulb_pb2
import lightbulb_pb2_grpc as lightbulb_pb2_grpc
import grpc
from rabbitmq_publisher import publisher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""Implementation of the LightbulbService service."""
class LightbulbServicer(lightbulb_pb2_grpc.LightbulbServiceServicer):

    def __init__(self):
        # Initialize the default state of the lightbulb
        self.state = {
            "is_on": False,
            "brightness": 50,  # Default brightness level (0-100)
            "color_temperature": 4000  # Default color temperature (2700-6500K)
        }
        # For event-based state streaming
        self.state_subscribers = {}
        self.state_lock = threading.RLock()
        logger.info("Lightbulb service initialized with default state: %s", self.state)

    """Helper method to create a LightbulbState message from current state."""
    def _get_current_state(self):
        return lightbulb_pb2.LightbulbState(
            is_on=self.state["is_on"],
            brightness=self.state["brightness"],
            color_temperature=self.state["color_temperature"]
        )
        
    """Notify all active stream subscribers about a state change"""
    def _notify_state_change(self):
        with self.state_lock:
            # Create a fresh state object for all subscribers
            current_state = self._get_current_state()
            # Notify all subscribers about the change
            closed_subscribers = []
            
            for subscriber_id, subscriber_queue in self.state_subscribers.items():
                try:
                    subscriber_queue.put(current_state, block=False)
                except queue.Full:
                    logger.warning(f"Queue full for subscriber {subscriber_id}, marking for removal")
                    closed_subscribers.append(subscriber_id)
            
            # Remove closed or problematic subscribers
            for subscriber_id in closed_subscribers:
                self.state_subscribers.pop(subscriber_id, None)
                logger.info(f"Removed subscriber {subscriber_id}")

    """Return the current state of the lightbulb."""
    def GetState(self, request, context):
        logger.info("GetState request received")
        return self._get_current_state()

    """Turn the lightbulb on or off."""
    def SetPower(self, request, context):
        logger.info("SetPower request received: %s", request.is_on)
        
        state_changed = False
        with self.state_lock:
            # Only publish if the state is actually changing
            if self.state["is_on"] != request.is_on:
                old_value = self.state["is_on"]
                self.state["is_on"] = request.is_on
                state_changed = True
                
                # Publish event to RabbitMQ
                publisher.publish_event('power_changed', {
                    'old_value': old_value,
                    'new_value': request.is_on,
                    'current_state': self.state
                })
            else:
                self.state["is_on"] = request.is_on
                
        # Notify stream subscribers about the state change
        if state_changed:
            self._notify_state_change()
            
        return self._get_current_state()

    """Set the brightness of the lightbulb."""
    def SetBrightness(self, request, context):
        brightness = max(0, min(100, request.brightness))  # Clamp to 0-100 range
        logger.info("SetBrightness request received: %s", brightness)
        
        state_changed = False
        with self.state_lock:
            # Only publish if the brightness is actually changing
            if self.state["brightness"] != brightness:
                old_value = self.state["brightness"]
                self.state["brightness"] = brightness
                state_changed = True
                
                # Publish event to RabbitMQ
                publisher.publish_event('brightness_changed', {
                    'old_value': old_value,
                    'new_value': brightness,
                    'current_state': self.state
                })
            else:
                self.state["brightness"] = brightness
        
        # Notify stream subscribers about the state change
        if state_changed:
            self._notify_state_change()
            
        return self._get_current_state()

    """Set the color temperature of the lightbulb."""
    def SetColorTemperature(self, request, context):
        temperature = max(2700, min(6500, request.temperature))  # Clamp to 2700-6500K range
        logger.info("SetColorTemperature request received: %s", temperature)
        
        state_changed = False
        with self.state_lock:
            # Only publish if the color temperature is actually changing
            if self.state["color_temperature"] != temperature:
                old_value = self.state["color_temperature"]
                self.state["color_temperature"] = temperature
                state_changed = True
                
                # Publish event to RabbitMQ
                publisher.publish_event('color_temperature_changed', {
                    'old_value': old_value,
                    'new_value': temperature,
                    'current_state': self.state
                })
            else:
                self.state["color_temperature"] = temperature
        
        # Notify stream subscribers about the state change
        if state_changed:
            self._notify_state_change()
            
        return self._get_current_state()
        
    """Stream the lightbulb state only when it changes."""
    def StreamState(self, request, context):
        logger.info("StreamState request received - subscribing to state changes")
        
        # Create a unique identifier for this subscriber
        subscriber_id = str(uuid.uuid4())
        # Create a queue for this subscriber
        subscriber_queue = queue.Queue(maxsize=10)  # Limit queue size to prevent memory issues
        
        # Register the subscriber
        with self.state_lock:
            self.state_subscribers[subscriber_id] = subscriber_queue
            
        # Always send the initial state immediately
        yield self._get_current_state()
        
        try:
            # Keep streaming until client disconnects
            while context.is_active():
                try:
                    # Wait for a state change notification with a timeout
                    # Using a timeout allows checking context.is_active() periodically
                    state = subscriber_queue.get(block=True, timeout=1.0)
                    yield state
                except queue.Empty:
                    # No state change, just continue and check if context is still active
                    continue
                        
        except Exception as e:
            logger.error("Error in StreamState: %s", str(e))
            context.set_details(f"Stream interrupted: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
        finally:
            # Unregister the subscriber when the stream ends
            with self.state_lock:
                self.state_subscribers.pop(subscriber_id, None)
                logger.info(f"Unregistered subscriber {subscriber_id}")