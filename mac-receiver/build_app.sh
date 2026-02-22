#!/bin/bash

# SteerByPhone Mac Receiver - Manual App Bundle Builder
# This script creates a .app bundle manually without py2app

echo "🚗 SteerByPhone Mac Receiver - Building macOS App (Manual Method)"
echo "=================================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "server_mac.py" ]; then
    echo "❌ Error: server_mac.py not found. Please run this script from the mac-receiver directory."
    exit 1
fi

# Create app bundle structure
echo "📦 Creating app bundle structure..."
APP_NAME="SteerByPhone Receiver.app"
APP_DIR="dist/$APP_NAME"
CONTENTS_DIR="$APP_DIR/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

rm -rf "dist"
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Create launcher script
echo "🔧 Creating launcher script..."
cat > "$MACOS_DIR/launcher.sh" << 'EOF'
#!/bin/bash

# Get the directory where the app is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RESOURCES_DIR="$DIR/../Resources"

# Change to resources directory
cd "$RESOURCES_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Setting up virtual environment..."
    /usr/bin/python3 -m venv venv
    source venv/bin/activate
    pip install --quiet websockets pynput
else
    source venv/bin/activate
fi

# Run the server
python3 server_mac.py
EOF

chmod +x "$MACOS_DIR/launcher.sh"

# Copy Python script and requirements
echo "📋 Copying application files..."
cp server_mac.py "$RESOURCES_DIR/"
cp requirements.txt "$RESOURCES_DIR/"

# Create Info.plist
echo "📝 Creating Info.plist..."
cat > "$CONTENTS_DIR/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>SteerByPhone Receiver</string>
    <key>CFBundleDisplayName</key>
    <string>SteerByPhone Receiver</string>
    <key>CFBundleIdentifier</key>
    <string>com.steerbyphone.receiver</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleExecutable</key>
    <string>launcher.sh</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>LSUIElement</key>
    <false/>
    <key>NSAppleEventsUsageDescription</key>
    <string>SteerByPhone needs to control keyboard and mouse for steering.</string>
    <key>NSAccessibilityUsageDescription</key>
    <string>SteerByPhone needs accessibility permissions to simulate keyboard input for steering controls.</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.utilities</string>
</dict>
</plist>
EOF

# Create PkgInfo
echo "APPL????" > "$CONTENTS_DIR/PkgInfo"

echo ""
echo "✅ Build successful!"
echo ""
echo "📱 Application location: dist/$APP_NAME"
echo ""
echo "To run the app:"
echo "  1. Open Finder and navigate to: $(pwd)/dist"
echo "  2. Double-click 'SteerByPhone Receiver.app'"
echo "  3. Grant Accessibility permissions when prompted"
echo ""
echo "To install the app:"
echo "  - Drag 'SteerByPhone Receiver.app' to your Applications folder"
echo ""
echo "Note: On first launch:"
echo "  - The app will set up its own Python environment (takes ~30 seconds)"
echo "  - You may need to right-click and select 'Open' (if macOS blocks it)"
echo "  - Grant Accessibility permissions in System Settings"
