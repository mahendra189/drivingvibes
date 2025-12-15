import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, Platform } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const [ipAddress, setIpAddress] = useState('10.186.110.41');
  const [connected, setConnected] = useState(false);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const ws = useRef(null);

  // Animation value for visual feedback
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Request permissions or setup sensors
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    DeviceMotion.setUpdateInterval(50);
    // The user asked "Send JSON data ... at 60ms intervals".
    // setUpdateInterval takes ms.
    DeviceMotion.setUpdateInterval(50);

    const subscription = DeviceMotion.addListener(data => {
      const { rotation } = data;
      if (rotation) {
        // In Landscape, Gamma is usually the tilt we want (or Beta depending on lock).
        // Let's assume user holds phone like a gamepad.
        // Tilting left/right corresponds to Beta or Gamma depending on exact orientation.
        // For "Landscape Right" (Home button left), Beta is tilt.
        // Let's stick with Gamma for now or Beta. Usually Beta is -90 to 90 for landscape tilt.
        // Actually, let's try Beta. If it feels wrong, we swap.

        let angle = rotation.beta * (180 / Math.PI);
        // Clamp for visuals
        if (angle > 90) angle = 90;
        if (angle < -90) angle = -90;

        setSteeringAngle(angle);

        // Update visual rotation
        Animated.timing(rotateAnim, {
          toValue: angle,
          duration: 50,
          useNativeDriver: true,
        }).start();

        // Send to WebSocket if connected
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          // Send full object
          const payload = JSON.stringify({ type: 'steer', val: angle });
          ws.current.send(payload);
        }
      }
    });

    return () => {
      subscription.remove();
      if (ws.current) ws.current.close();
    };
  }, []);

  const connectToPC = () => {
    if (connected) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      setConnected(false);
      return;
    }

    if (!ipAddress) {
      Alert.alert("Error", "Please enter IP Address");
      return;
    }

    const url = `ws://${ipAddress}:8080`;
    console.log(`Connecting to ${url}...`);

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log("Connected");
        setConnected(true);
        Alert.alert("Connected", "Successfully connected!");
      };

      ws.current.onclose = () => {
        console.log("Disconnected");
        setConnected(false);
        Alert.alert("Disconnected", "Connection closed.");
      };

      ws.current.onerror = (e) => {
        console.log("Error", e.message);
        setConnected(false);
        Alert.alert("Error", e.message);
      };

    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.message);
    }
  };

  const sendCommand = (type, val) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, val }));
    }
  };

  // Interpolate rotation for style
  const rotateStr = rotateAnim.interpolate({
    inputRange: [-90, 90],
    outputRange: ['-90deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Left: Brake */}
      <View style={styles.sidePanel}>
        <TouchableOpacity
          style={[styles.controlButton, styles.brakeBtn]}
          onPressIn={() => sendCommand('brake', true)}
          onPressOut={() => sendCommand('brake', false)}
        >
          <Text style={styles.controlText}>BRAKE</Text>
        </TouchableOpacity>
      </View>

      {/* Center: Connect & Visual */}
      <View style={styles.centerPanel}>
        <Text style={styles.title}>SteerByPhone</Text>

        {!connected && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="IP Address"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.connectButton, connected && styles.disconnectButton]}
          onPress={connectToPC}
        >
          <Text style={styles.buttonText}>{connected ? "DISCONNECT" : "CONNECT"}</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.steeringWheel, { transform: [{ rotate: rotateStr }] }]}>
          <View style={styles.wheelRim} />
          <View style={styles.wheelSpoke} />
        </Animated.View>
        <Text style={styles.angleText}>Tilt: {steeringAngle.toFixed(1)}°</Text>
      </View>

      {/* Right: Throttle */}
      <View style={styles.sidePanel}>
        <TouchableOpacity
          style={[styles.controlButton, styles.throttleBtn]}
          onPressIn={() => sendCommand('throttle', true)}
          onPressOut={() => sendCommand('throttle', false)}
        >
          <Text style={styles.controlText}>GO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    // Landscape alignment
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  centerPanel: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  controlButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  throttleBtn: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  brakeBtn: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  controlText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  steeringWheel: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  wheelRim: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: '#00BCD4',
  },
  wheelSpoke: {
    position: 'absolute',
    width: 130,
    height: 10,
    backgroundColor: '#00BCD4',
    borderRadius: 5,
  },
  angleText: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
