"""
SteerByPhone Mac Receiver - py2app Setup Script
This script packages the Python server into a standalone macOS application.
"""

from setuptools import setup

APP = ['server_mac.py']
DATA_FILES = []
OPTIONS = {
    'argv_emulation': False,
    'packages': ['asyncio', 'websockets', 'json', 'pynput'],
    'excludes': ['setuptools._vendor'],  # Exclude vendored packages to avoid conflicts
    'plist': {
        'CFBundleName': 'SteerByPhone Receiver',
        'CFBundleDisplayName': 'SteerByPhone Receiver',
        'CFBundleIdentifier': 'com.steerbyphone.receiver',
        'CFBundleVersion': '1.0.0',
        'CFBundleShortVersionString': '1.0.0',
        'NSHumanReadableCopyright': 'Copyright © 2026 SteerByPhone',
        'LSMinimumSystemVersion': '10.13',
        'LSUIElement': False,  # Show in Dock
        'NSAppleEventsUsageDescription': 'SteerByPhone needs to control keyboard and mouse for steering.',
        'NSAccessibilityUsageDescription': 'SteerByPhone needs accessibility permissions to simulate keyboard input for steering controls.',
    },
    'iconfile': None,  # Add icon.icns if you create one
}

setup(
    name='SteerByPhone Receiver',
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
