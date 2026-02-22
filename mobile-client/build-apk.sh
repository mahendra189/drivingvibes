#!/bin/bash

# SteerByPhone - Android APK Build Script
# This script builds the Android APK using EAS Build

echo "🚗 SteerByPhone - Building Android APK"
echo "======================================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if logged in to Expo
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to your Expo account:"
    eas login
fi

# Configure project if needed
if ! grep -q "projectId" app.json; then
    echo "⚙️  Configuring EAS project..."
    eas build:configure
fi

# Build APK
echo ""
echo "🔨 Building APK (this may take several minutes)..."
echo "Choose 'preview' profile when prompted for faster builds"
echo ""

eas build --platform android --profile preview

echo ""
echo "✅ Build complete!"
echo "📱 Download the APK from the link above and install it on your Android device"
echo ""
echo "Note: You may need to enable 'Install from Unknown Sources' in your Android settings"
