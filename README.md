# Smartphone Steering Wheel

Turn your smartphone into a steering wheel for PC racing games (like Live For Speed) using the accelerometer/gyroscope.

## Prerequisites

- **PC**: Python 3.x installed.
- **Smartphone**: Expo Go app installed (available on iOS App Store and Google Play Store).
- **Network**: PC and Smartphone must be on the same Wi-Fi network.

## Setup Guide

### 1. PC Receiver (Windows)

The PC receiver acts as a virtual joystick (vJoy).

1.  **Install vJoy Driver**:
    - Download and install vJoy from [SourceForge](https://sourceforge.net/projects/vjoystick/).
    - Configure vJoy Serial Feeder (optional, but ensure vJoy is enabled in Device Manager).
    - By default, device #1 is used.

2.  **Environment Setup**:
    Open a terminal (Command Prompt/PowerShell) in the `pc-receiver` directory.

    ```bash
    cd pc-receiver
    # Create virtual environment (optional but recommended)
    python -m venv venv
    .\venv\Scripts\activate
    
    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Run the Server**:
    ```bash
    python server.py
    ```
    - You should see: `Server listening on 0.0.0.0:8080`.
    - If on Windows, it will also confirm `Windows detected: Is vJoy loaded? ...`.

4.  **Find your PC's IP Address**:
    - Open a new terminal and run `ipconfig`.
    - Look for "IPv4 Address" (e.g., `192.168.1.50`). You will need this for the mobile app.

### 2. Mac Receiver (macOS)

On macOS, the app simulates **Arrow Keys** (Left/Right) since virtual joystick support is limited.

1.  **Setup**:
    Open a terminal in the `mac-receiver` directory.

    ```bash
    cd mac-receiver
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Permissions**:
    - When you run the script for the first time, macOS might ask to grant "Input Monitoring" or "Accessibility" permissions to your Terminal or Python. **You must allow this** for the script to control the keyboard.
    - Go to System Settings -> Privacy & Security -> Accessibility / Input Monitoring.

3.  **Run**:
    ```bash
    python server_mac.py
    ```
    - Verify your IP address (usually found in System Settings -> Wi-Fi -> Details).

### 3. Mobile Client (iOS / Android)

The mobile client sends sensor data to the PC.

1.  **Install Dependencies**:
    Open a terminal in the `mobile-client` directory.

    ```bash
    cd mobile-client
    npm install
    ```

2.  **Start the App**:
    ```bash
    npx expo start
    ```
    - A QR code will appear in the terminal.

3.  **Run on Phone**:
    - Open **Expo Go** on your phone.
    - Scan the QR code (Android) or use the Camera app (iOS).
    - The app "SteerByPhone" will load.

4.  **Connect**:
    - In the app, enter your PC's IP address (from step 1.4).
    - Tap **CONNECT**.
    - Status should change to "Connected".
    - Rotate your phone to steer!

## Troubleshooting

- **"Connection failed"**:
    - Check if PC and Phone are on the **same Wi-Fi**.
    - Check if Windows Firewall is blocking Python. Allow access for `python.exe` on private networks.
    - Double-check the IP address.
- **PC Server Error "pyvjoy not found"**:
    - Ensure you ran `pip install -r requirements.txt` on Windows.
- **Steering not working**:
    - Verify vJoy is installed and enabled in "Game Controllers" (search in Windows Start menu).
    - Open "Setup USB Game Controllers" -> Properties -> Test to see if the bars move when you tilt the phone.

## Development

- **Mac/Linux**: The server runs in "Development Mode" (prints values to console) since vJoy is Windows-only.
- **Mobile**: Modify `App.js` to change sensor update intervals or UI.
