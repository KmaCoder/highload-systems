import logging
import lightbulb_pb2 as lightbulb_pb2
import lightbulb_pb2_grpc as lightbulb_pb2_grpc

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
        logger.info("Lightbulb service initialized with default state: %s", self.state)

    """Helper method to create a LightbulbState message from current state."""
    def _get_current_state(self):
        return lightbulb_pb2.LightbulbState(
            is_on=self.state["is_on"],
            brightness=self.state["brightness"],
            color_temperature=self.state["color_temperature"]
        )

    """Return the current state of the lightbulb."""
    def GetState(self, request, context):
        logger.info("GetState request received")
        return self._get_current_state()

    """Turn the lightbulb on or off."""
    def SetPower(self, request, context):
        logger.info("SetPower request received: %s", request.is_on)
        self.state["is_on"] = request.is_on
        return self._get_current_state()

    """Set the brightness of the lightbulb."""
    def SetBrightness(self, request, context):
        brightness = max(0, min(100, request.brightness))  # Clamp to 0-100 range
        logger.info("SetBrightness request received: %s", brightness)
        self.state["brightness"] = brightness
        return self._get_current_state()

    """Set the color temperature of the lightbulb."""
    def SetColorTemperature(self, request, context):
        temperature = max(2700, min(6500, request.temperature))  # Clamp to 2700-6500K range
        logger.info("SetColorTemperature request received: %s", temperature)
        self.state["color_temperature"] = temperature
        return self._get_current_state()