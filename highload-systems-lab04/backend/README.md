# Lightbulb Control Server

A gRPC server implemented in Python that simulates controlling a lighting bulb.

## Features

- Control the power state (on/off)
- Adjust brightness (0-100%)
- Change color temperature (2700K-6500K)
- Get current state of the lightbulb

## Setup

1. Create `venv` and activate it

```bash
python -m venv venv
source ./venv/bin/activate

# Check the location of your Python interpreter
which python
```

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

If stuck on building wheel run

```bash
pip install --upgrade pip
pip install --upgrade setuptools wheel
```

2. Generate Python code from the Protocol Buffer definition:
```bash
./generate_protos.sh
```

3. Start the server:
```bash
python server.py
```

The server will run on port 50051.

## API

The server implements the following gRPC methods:

- `GetState`: Get the current state of the lightbulb
- `SetPower`: Turn the lightbulb on or off
- `SetBrightness`: Set the brightness level (0-100)
- `SetColorTemperature`: Set the color temperature (2700K-6500K)

See the `proto/lightbulb.proto` file for the complete service definition. 