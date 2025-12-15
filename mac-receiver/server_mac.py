import asyncio
import websockets
import json
from pynput.keyboard import Key, Controller

keyboard = Controller()

# Configuration
DEAD_ZONE = 10  # Degrees of tilt required to register a key press

async def handler(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if "roll" in data:
                    process_roll(data["roll"])
            except json.JSONDecodeError:
                pass
            except Exception as e:
                print(f"Error: {e}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
        # Release keys on disconnect to be safe
        keyboard.release(Key.left)
        keyboard.release(Key.right)

def process_roll(roll_degrees):
    """
    Map roll degrees to Left/Right arrow keys.
    < -DEAD_ZONE  -> Turn Left
    > +DEAD_ZONE  -> Turn Right
    Between       -> Go Straight
    """
    
    if roll_degrees < -DEAD_ZONE:
        # Tilt Left
        print(f"\rLeft ({roll_degrees:.1f}°)", end="    ")
        keyboard.press(Key.left)
        keyboard.release(Key.right)
    elif roll_degrees > DEAD_ZONE:
        # Tilt Right
        print(f"\rRight ({roll_degrees:.1f}°)", end="    ")
        keyboard.press(Key.right)
        keyboard.release(Key.left)
    else:
        # Center
        print(f"\rCenter ({roll_degrees:.1f}°)", end="    ")
        keyboard.release(Key.left)
        keyboard.release(Key.right)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print("Mac Receiver Started on 0.0.0.0:8080")
        print("Emulating Left/Right arrow keys.")
        print("Use Control+C to stop.")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
