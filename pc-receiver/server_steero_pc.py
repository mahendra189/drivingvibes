import asyncio
import websockets
import json
from pynput.mouse import Controller as MouseController

mouse = MouseController()

# Configuration
# Adjust this for your Windows Screen Resolution (e.g., 1920, 2560)
SCREEN_WIDTH = 1920 
MAX_VIRTUAL_ANGLE = 270 # This corresponds to 100% left/right on screen
DEAD_ZONE = 2

async def handler(websocket):
    print("Steero Client connected")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if "type" in data and data["type"] == "steer":
                    process_steer(data["val"])
            except json.JSONDecodeError:
                pass
            except Exception as e:
                print(f"Error: {e}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

def process_steer(angle):
    """
    Map Virtual Angle (-270 to 270) to Screen X (0 to Width).
    """
    if abs(angle) < DEAD_ZONE:
        # Optional: Snap to center if very close?
        pass

    # Clamp
    if angle > MAX_VIRTUAL_ANGLE: angle = MAX_VIRTUAL_ANGLE
    if angle < -MAX_VIRTUAL_ANGLE: angle = -MAX_VIRTUAL_ANGLE

    # Ratio -1.0 to 1.0
    ratio = angle / MAX_VIRTUAL_ANGLE 

    center_x = SCREEN_WIDTH / 2
    target_x = center_x + (ratio * center_x)
    
    current_pos = mouse.position
    mouse.position = (int(target_x), current_pos[1])

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print(f"Steero PC Server running on 0.0.0.0:8080")
        print(f"Screen Mapping: +/- {MAX_VIRTUAL_ANGLE} degrees -> Full Screen Width ({SCREEN_WIDTH}px)")
        print("Use Control+C to stop.")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
