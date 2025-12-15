import asyncio
import websockets
import json
from pynput.keyboard import Key, Controller as KeyboardController
from pynput.mouse import Controller as MouseController

keyboard = KeyboardController()
mouse = MouseController()

# Configuration
DEAD_ZONE = 5  
SENSITIVITY = 15 # Multiplier for mouse movement

async def handler(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                # Old format check
                if "roll" in data:
                    process_steer(data["roll"])
                
                # New format
                if "type" in data:
                    t = data["type"]
                    val = data["val"]
                    
                    if t == "steer":
                        process_steer(val)
                    elif t == "throttle":
                        process_throttle(val)
                    elif t == "brake":
                        process_brake(val)
                    elif t == "reset":
                        process_reset()

            except json.JSONDecodeError:
                pass
            except Exception as e:
                print(f"Error handling message: {e}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
        # Release keys on disconnect
        keyboard.release(Key.up)
        keyboard.release(Key.down)

def process_reset():
    print("\rRESET (r)     ", end="    ")
    keyboard.press('r')
    keyboard.release('r')

def process_throttle(pressed):
    if pressed:
        print("\rThrottle ON ", end="    ")
        keyboard.press(Key.up)
    else:
        print("\rThrottle OFF", end="    ")
        keyboard.release(Key.up)

def process_brake(pressed):
    if pressed:
        print("\rBrake ON    ", end="    ")
        keyboard.press(Key.down)
    else:
        print("\rBrake OFF   ", end="    ")
        keyboard.release(Key.down)

def process_steer(angle):
    """
    Move mouse based on tilt angle.
    Angle is roughly -90 to 90.
    """
    if abs(angle) < DEAD_ZONE:
        return

    # Relative movement logic
    # More tilt = faster cursor movement
    # angle is in degrees.
    
    # Tuned Sensitivity: 2.0x factor
    delta_x = int(angle * 1.0) 
    
    mouse.move(delta_x, 0)
    
    # print(f"\rSteer: {angle:.1f}° -> dx: {delta_x}", end="    ")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print("Mac Receiver Started on 0.0.0.0:8080")
        print("Controls: Tilt -> Mouse X | Right Btn -> Up Arrow | Left Btn -> Down Arrow")
        print("Use Control+C to stop.")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
