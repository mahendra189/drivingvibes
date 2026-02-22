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
                    
                    # New Momentary/Toggle Controls
                    elif t == "headlight":
                        process_key('h', val)
                    elif t == "handbrake":
                        process_key('b', val)
                    elif t == "autopilot":
                        process_key('f', val)
                    elif t == "cruise":
                        process_key('j', val)

            except json.JSONDecodeError:
                pass
            except Exception as e:
                print(f"Error handling message: {e}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
        # Release keys on disconnect
        keyboard.release(Key.up)
        keyboard.release(Key.down)

def process_key(key_char, pressed):
    """Generic handler for simple key presses"""
    if pressed:
        print(f"\rKey '{key_char.upper()}' ON   ", end="    ")
        keyboard.press(key_char)
    else:
        # Check if we should release immediately or if it's a toggle logic
        # For now, map 1:1 with button press
        print(f"\rKey '{key_char.upper()}' OFF  ", end="    ")
        keyboard.release(key_char)

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

# Screen Width Configuration (Points)
# Common specific values: 1280, 1440, 1470, 1728
SCREEN_WIDTH = 1440 
MAX_ANGLE = 45 # Degrees for full lock

def process_steer(angle):
    """
    Absolute Steering: Map Tilt Angle to Screen Position.
    -MAX_ANGLE -> Left Edge (0)
    0          -> Center (Width/2)
    +MAX_ANGLE -> Right Edge (Width)
    """
    
    # Clamp angle
    if angle > MAX_ANGLE: angle = MAX_ANGLE
    if angle < -MAX_ANGLE: angle = -MAX_ANGLE
    
    # Calculate percentage (-1.0 to 1.0)
    ratio = angle / MAX_ANGLE 
    
    # Center X
    center_x = SCREEN_WIDTH / 2
    
    # Calculate Target X
    # If ratio is -1 (Left), target is 0
    # If ratio is 0 (Center), target is center_x
    # If ratio is 1 (Right), target is SCREEN_WIDTH
    
    # Formula: center_x + (ratio * center_x)
    target_x = center_x + (ratio * center_x)
    
    # Get current position to preserve Y
    current_pos = mouse.position
    
    mouse.position = (int(target_x), current_pos[1])
    
    # print(f"\rSteer: {angle:.1f}° -> dx: {delta_x}", end="    ")

def get_local_ip():
    """Get the local IP address of this machine"""
    import socket
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Connect to a public DNS server (doesn't actually send data)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "Unable to detect"

async def main():
    local_ip = get_local_ip()
    
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print("=" * 60)
        print("🚗 SteerByPhone Mac Receiver Started")
        print("=" * 60)
        print(f"\n📱 Enter this IP address in your phone app:")
        print(f"   {local_ip}:8080")
        print(f"\n🎮 Controls:")
        print(f"   • Tilt phone → Mouse X-axis (steering)")
        print(f"   • Right button → Up Arrow (throttle)")
        print(f"   • Left button → Down Arrow (brake)")
        print(f"\n⚙️  Server listening on: 0.0.0.0:8080")
        print(f"   Press Control+C to stop.\n")
        print("=" * 60)
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped.")

