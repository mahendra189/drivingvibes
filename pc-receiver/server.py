import asyncio
import websockets
import json
import platform
import math

# OS Detection
IS_WINDOWS = platform.system() == "Windows"
VJOY_DEVICE_ID = 1

if IS_WINDOWS:
    try:
        import pyvjoy
        j = pyvjoy.VJoyDevice(VJOY_DEVICE_ID)
        print(f"Windows detected: Is vJoy loaded? {j}")
    except ImportError:
        print("pyvjoy not found. Please install it with 'pip install pyvjoy' on Windows.")
        IS_WINDOWS = False # Fallback to debug mode
    except Exception as e:
        print(f"Failed to initialize vJoy: {e}")
        IS_WINDOWS = False
else:
    print(f"Running on {platform.system()}. vJoy is disabled. Development Mode enabled.")

async def handler(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if "roll" in data:
                    process_roll(data["roll"])
            except json.JSONDecodeError:
                print("Invalid JSON received")
            except Exception as e:
                print(f"Error processing message: {e}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

def process_roll(roll_degrees):
    """
    Map roll degrees (-45 to +45) to vJoy X-Axis (0 to 32767).
    Center (0 degrees) = 16383.
    """
    # Clamp input to -45 to +45
    clamped_roll = max(-45, min(45, roll_degrees))
    
    # Map -45..45 to 0..32767
    # (-45 -> 0, 0 -> 16383, 45 -> 32767)
    
    # Normalize to 0..1 range
    # (roll + 45) / 90
    normalized = (clamped_roll + 45) / 90.0
    
    # Scale to vJoy range
    vjoy_value = int(normalized * 32767)
    
    if IS_WINDOWS:
        # Set Axis X
        # Usage: j.set_axis(HID_USAGE_X, value) or higher level API
        # pyvjoy's set_axis generally takes HID_USAGE_X which is 0x30
        try:
             j.set_axis(pyvjoy.HID_USAGE_X, vjoy_value)
        except Exception as e:
            print(f"vJoy Error: {e}")
    else:
        # Development Mode Output
        # Print a simple visual bar for debugging
        bar_width = 40
        pos = int(normalized * bar_width)
        bar = [" "] * bar_width
        if 0 <= pos < bar_width:
            bar[pos] = "|"
        print(f"\rDev Mode: Roll {roll_degrees:.2f}° [{''.join(bar)}] val={vjoy_value}", end="")

async def main():
    server = await websockets.serve(handler, "0.0.0.0", 8080)
    print("Server listening on 0.0.0.0:8080")
    # Keep the server running
    await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped.")
