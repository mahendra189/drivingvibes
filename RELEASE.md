# Creating a Release

To create a new release of SteerByPhone:

## 1. Update Version Numbers

Update version numbers in:
- `mobile-client/app.json` - Update `version` field
- `mac-receiver/setup.py` - Update version in CFBundleShortVersionString
- `README.md` - Update any version references

## 2. Create and Push a Tag

```bash
# Make sure you're on main branch with latest changes
git checkout main
git pull

# Create a new tag (replace X.Y.Z with your version)
git tag -a vX.Y.Z -m "Release version X.Y.Z"

# Push the tag to GitHub
git push origin vX.Y.Z
```

## 3. GitHub Actions Will Automatically:

- Create a new GitHub Release
- Build the Mac receiver app
- Build the Windows receiver executable
- Initiate Android APK build (may require manual completion)

## 4. Manual Steps for Android APK

Since Expo builds require authentication:

```bash
cd mobile-client
./build-apk.sh
```

Then manually upload the APK to the GitHub release.

## 5. Verify the Release

1. Go to https://github.com/mahendra189/drivingvibes/releases
2. Check that all assets are uploaded:
   - `SteerByPhone-Mac-vX.Y.Z.zip`
   - `SteerByPhone-Windows-vX.Y.Z.exe`
   - `SteerByPhone-Android-vX.Y.Z.apk`

## Example: Creating v1.0.0

```bash
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial public release"
git push origin v1.0.0
```

## Notes

- Tags must start with 'v' (e.g., v1.0.0, v1.2.3)
- The workflow will automatically create the release
- For Android, you may need to manually upload the APK after building with Expo
- Make sure to test builds locally before creating a release
