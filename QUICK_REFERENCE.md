# 🚗 SteerByPhone - Quick Reference

## 📥 Download Apps

Visit our website: **[SteerByPhone Website](https://your-website-url.com)** (or run locally from `website/`)

Or download directly from [GitHub Releases](https://github.com/mahendra189/drivingvibes/releases/latest):
- **Mac Receiver**: Download the `.zip` file
- **Windows Receiver**: Download the `.exe` file  
- **Android Client**: Download the `.apk` file

---

## 📱 Building Android APK

```bash
cd mobile-client
./build-apk.sh
```

**What it does:**
- Installs EAS CLI
- Logs into Expo
- Builds APK (takes 5-10 minutes)
- Provides download link

**Requirements:**
- Node.js and npm
- Expo account (free)

---

## 🖥️ Building macOS App

```bash
cd mac-receiver
./build_app.sh
```

**What it does:**
- Creates virtual environment
- Installs dependencies
- Builds application bundle
- Places app in `dist/server_mac.app`

**Requirements:**
- macOS 10.13+
- Python 3.7+
- Xcode Command Line Tools

---

## 💻 Building Windows App

```bash
cd pc-receiver
pip install -r requirements.txt
pip install pyinstaller
pyinstaller --onefile --name SteerByPhone server.py
```

**Output**: `dist/SteerByPhone.exe`

**Requirements:**
- Windows 10+
- Python 3.7+
- vJoy driver (for running the app)

---

## 🌐 Running the Website

```bash
cd website
pnpm install
pnpm dev
```

Visit http://localhost:3000

---

## 🚀 Creating a Release

See [RELEASE.md](RELEASE.md) for detailed instructions.

**Quick version:**
```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# GitHub Actions will automatically build and create the release
```

---

## 📦 What Was Created

### Mobile Client (`mobile-client/`)
- ✅ `app.json` - Updated with Android build config
- ✅ `eas.json` - EAS Build configuration
- ✅ `build-apk.sh` - Automated build script
- ✅ `assets/icon.png` - App icon (1024x1024)
- ✅ `assets/adaptive-icon.png` - Android adaptive icon
- ✅ `assets/splash.png` - Splash screen

### Mac Receiver (`mac-receiver/`)
- ✅ `setup.py` - py2app configuration
- ✅ `build_app.sh` - Automated build script

### Windows Receiver (`pc-receiver/`)
- ✅ `requirements.txt` - Python dependencies
- ✅ Build instructions in README

### Website (`website/`)
- ✅ Next.js 14 with shadcn/ui
- ✅ Responsive design
- ✅ Working download links to GitHub releases
- ✅ SEO optimized

### GitHub Actions (`.github/workflows/`)
- ✅ `release.yml` - Automated release workflow

### Documentation
- ✅ `BUILD_GUIDE.md` - Comprehensive build instructions
- ✅ `RELEASE.md` - Release creation guide
- ✅ `README.md` - Updated with quick start guide

---

## 💡 Tips

- **First time building?** The scripts will guide you through setup
- **Build failed?** Check `BUILD_GUIDE.md` troubleshooting section
- **Want to customize?** Edit `app.json` (mobile) or `setup.py` (macOS)
- **Creating a release?** See `RELEASE.md` for step-by-step instructions
- **Need help?** Check the documentation or open an issue on GitHub
