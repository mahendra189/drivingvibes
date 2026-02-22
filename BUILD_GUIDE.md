# SteerByPhone - Build Guide

This guide explains how to build distributable versions of SteerByPhone for Android (APK) and macOS (Application Bundle).

## 📱 Building Android APK

### Prerequisites
- Node.js and npm installed
- Expo account (free tier is fine) - [Sign up here](https://expo.dev/signup)

### Quick Build

1. **Navigate to mobile client directory**:
   ```bash
   cd mobile-client
   ```

2. **Run the build script**:
   ```bash
   ./build-apk.sh
   ```

   The script will:
   - Install EAS CLI if needed
   - Log you into your Expo account
   - Configure the project
   - Build the APK

3. **Download the APK**:
   - After the build completes (5-10 minutes), you'll receive a download link
   - Download the APK file to your computer

### Manual Build Steps

If you prefer to build manually:

```bash
cd mobile-client

# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project (first time only)
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Installing the APK

1. **Transfer to Android device**:
   - Email the APK to yourself
   - Use Google Drive, Dropbox, or USB cable

2. **Enable installation from unknown sources**:
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Allow from this source"

3. **Install the APK**:
   - Open the APK file on your device
   - Tap "Install"
   - Open the app and enjoy!

---

## 🖥️ Building macOS Application

### Prerequisites
- macOS 10.13 or later
- Python 3.7 or later
- Xcode Command Line Tools (install with: `xcode-select --install`)

### Quick Build

1. **Navigate to mac-receiver directory**:
   ```bash
   cd mac-receiver
   ```

2. **Run the build script**:
   ```bash
   ./build_app.sh
   ```

   The script will:
   - Create a virtual environment
   - Install dependencies including py2app
   - Build the application bundle
   - Place the app in the `dist/` folder

3. **Find your app**:
   - The application will be at: `mac-receiver/dist/server_mac.app`

### Manual Build Steps

If you prefer to build manually:

```bash
cd mac-receiver

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install py2app

# Build the app
python setup.py py2app

# App will be in dist/server_mac.app
```

### Installing the macOS App

1. **Move to Applications**:
   ```bash
   cp -r dist/server_mac.app /Applications/
   ```

   Or drag `server_mac.app` to your Applications folder in Finder.

2. **First Launch**:
   - Right-click the app and select "Open" (required for unsigned apps)
   - Click "Open" in the security dialog
   - The app will request Accessibility permissions

3. **Grant Permissions**:
   - Go to System Settings → Privacy & Security → Accessibility
   - Enable permissions for "server_mac"
   - Restart the app

---

## 🚀 Distribution

### For Android APK

**Option 1: Direct Distribution**
- Share the APK file directly with users
- Users must enable "Install from Unknown Sources"

**Option 2: Google Play Store** (requires developer account - $25 one-time fee)
- Build AAB instead: `eas build --platform android --profile production`
- Upload to Google Play Console

### For macOS Application

**Option 1: Direct Distribution** (Current approach)
- Share the .app bundle (compress as .zip)
- Users must right-click → Open on first launch
- Users must grant Accessibility permissions

**Option 2: Notarization** (requires Apple Developer account - $99/year)
- Sign the app with your Developer ID
- Notarize with Apple
- No security warnings for users

---

## 🔧 Troubleshooting

### Android Build Issues

**"eas: command not found"**
```bash
npm install -g eas-cli
```

**"Not logged in"**
```bash
eas login
```

**Build fails**
- Check your internet connection
- Ensure app.json is valid JSON
- Check Expo build logs for specific errors

### macOS Build Issues

**"py2app not found"**
```bash
pip install py2app
```

**"Permission denied"**
```bash
chmod +x build_app.sh
```

**App won't open**
- Right-click → Open (don't double-click)
- Check System Settings → Privacy & Security
- Grant Accessibility permissions

**"Python not found" in built app**
- Ensure you built with the virtual environment activated
- Rebuild with: `python setup.py py2app`

---

## 📝 Notes

- **Android APK**: Built APKs are suitable for testing and distribution. For production, consider building AAB files for Play Store.
- **macOS App**: The unsigned app will show security warnings. For professional distribution, consider code signing.
- **Updates**: Increment version numbers in `app.json` (mobile) and `setup.py` (macOS) for each release.

---

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review build logs for specific error messages
3. Ensure all prerequisites are installed
4. Try rebuilding from scratch (delete `build/` and `dist/` folders)
