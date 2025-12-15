import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, Platform } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [ipAddress, setIpAddress] = useState('10.186.110.41');
  const [connected, setConnected] = useState(false);
  const [virtualAngle, setVirtualAngle] = useState(0);
  const ws = useRef(null);
  const lastSentAngle = useRef(0);

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    DeviceMotion.setUpdateInterval(16); // ~60Hz for ultra smoothness

    const subscription = DeviceMotion.addListener(data => {
      const { rotation } = data;
      if (rotation) {
        // Physical Tilt: +/- 90 degrees
        let physicalAngle = rotation.beta * (180 / Math.PI);

        // Clamp physical
        if (physicalAngle > 90) physicalAngle = 90;
        if (physicalAngle < -90) physicalAngle = -90;

        // Map to Virtual Range (1.5 Rotations = 540 degrees total = +/- 270 degrees)
        // Multiplier: 270 / 90 = 3
        let vAngle = physicalAngle * 3;

        setVirtualAngle(vAngle);

        // Visual Animation
        Animated.timing(rotateAnim, {
          toValue: vAngle,
          duration: 16,
          useNativeDriver: true,
        }).start();

        // Network
        // Round to 1 decimal
        const rounded = Math.round(vAngle * 10) / 10;

        if (Math.abs(rounded - lastSentAngle.current) >= 0.5) {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            // Send 'steer' type
            ws.current.send(JSON.stringify({ type: 'steer', val: rounded }));
            lastSentAngle.current = rounded;
          }
        }
      }
    });

    return () => {
      subscription.remove();
      if (ws.current) ws.current.close();
    };
  }, []);

  const connect = () => {
    if (connected) {
      ws.current?.close();
      setConnected(false);
      return;
    }
    if (!ipAddress) return Alert.alert("IP Missing");

    try {
      ws.current = new WebSocket(`ws://${ipAddress}:8080`);
      ws.current.onopen = () => {
        setConnected(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      };
      ws.current.onclose = () => setConnected(false);
      ws.current.onerror = (e) => {
        setConnected(false);
        Alert.alert("Error", e.message);
      };
    } catch (e) { Alert.alert("Error", e.message); }
  };

  const rotateStr = rotateAnim.interpolate({
    inputRange: [-270, 270],
    outputRange: ['-270deg', '270deg'],
  });

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={styles.container}>
      <StatusBar hidden />

      {/* Centered Steering Wheel */}
      <View style={styles.wheelContainer}>
        <Animated.View style={{ transform: [{ rotate: rotateStr }] }}>
          {/* Using a custom drawn wheel or a nice icon */}
          <MaterialCommunityIcons name="steering" size={280} color="#00d2ff" style={{ opacity: 0.9 }} />
          {/* Center Marker */}
          <View style={styles.marker} />
        </Animated.View>
        <Text style={styles.angleText}>{virtualAngle.toFixed(0)}°</Text>
      </View>

      {/* Connection Overlay (Top Center) */}
      <View style={styles.connectionPanel}>
        <TouchableOpacity onPress={connect} style={styles.connectBtn}>
          <View style={[styles.statusDot, { backgroundColor: connected ? '#0f0' : '#f00' }]} />
          <Text style={styles.connectText}>{connected ? "CONNECTED" : "TAP TO CONNECT"}</Text>
        </TouchableOpacity>

        {!connected && (
          <TextInput
            style={styles.ipInput}
            value={ipAddress}
            onChangeText={setIpAddress}
            keyboardType="numeric"
            placeholder="Enter IP"
            placeholderTextColor="#aaa"
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 6,
    height: 30,
    backgroundColor: '#ff0055',
  },
  angleText: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  connectionPanel: {
    position: 'absolute',
    top: 40, // Moved down slightly
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
    minWidth: 200,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  connectText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  statusDot: {
    width: 12, height: 12, borderRadius: 6,
  },
  ipInput: {
    color: '#fff',
    width: 120,
    textAlign: 'center',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 2,
  }
});
