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
  const [steeringAngle, setSteeringAngle] = useState(0);
  const ws = useRef(null);
  const lastSentAngle = useRef(0);

  // Animation value for visual feedback
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Request permissions or setup sensors
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    DeviceMotion.setUpdateInterval(20); // Faster updates for responsiveness

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

        // Visuals: Update always for smoothness
        setSteeringAngle(angle);

        // Update visual rotation
        Animated.timing(rotateAnim, {
          toValue: angle,
          duration: 50,
          useNativeDriver: true,
        }).start();

        // Network: Throttle updates to reduce lag
        // Round to 1 decimal place
        const roundedAngle = Math.round(angle * 10) / 10;

        // Only send if changed meaningfully (> 0.5 degrees)
        if (Math.abs(roundedAngle - lastSentAngle.current) >= 0.5) {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ type: 'steer', val: roundedAngle });
            ws.current.send(payload);
            lastSentAngle.current = roundedAngle;
          }
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
        // Alert.alert("Disconnected", "Connection closed.");
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
    // Haptic feedback on press (if val is true/pressed)
    if (val === true) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, val }));
    }
  };

  const sendReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'reset', val: true }));
    }
  };

  // Interpolate rotation for style
  const rotateStr = rotateAnim.interpolate({
    inputRange: [-90, 90],
    outputRange: ['-90deg', '90deg'],
  });

  return (
    <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.container}>
      <StatusBar hidden={true} />

      {/* --- LEFT SECTION --- */}
      <View style={styles.sidePanel}>
        {/* Brake Pedal (Big) */}
        <TouchableOpacity
          style={[styles.pedal, styles.brakePedal]}
          onPressIn={() => sendCommand('brake', true)}
          onPressOut={() => sendCommand('brake', false)}
          activeOpacity={0.7}
        >
          <Text style={styles.pedalText}>BRAKE</Text>
        </TouchableOpacity>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => sendCommand('headlight', true)}>
            <MaterialCommunityIcons name="car-light-high" size={32} color="#00e5ff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => sendCommand('autopilot', true)}>
            <MaterialCommunityIcons name="robot" size={32} color="#00e5ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CENTER DASHBOARD --- */}
      <View style={styles.centerPanel}>
        <View style={styles.headerRow}>
          <View style={[styles.statusPill, connected ? styles.connectedPill : styles.disconnectedPill]}>
            <View style={[styles.statusDot, { backgroundColor: connected ? '#00FF00' : '#FF0000' }]} />
            <Text style={styles.statusText}>{connected ? "ONLINE" : "OFFLINE"}</Text>
          </View>

          {!connected && (
            <TextInput
              style={styles.miniInput}
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="IP"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          )}

          <TouchableOpacity style={styles.miniBtn} onPress={connectToPC}>
            <MaterialCommunityIcons name={connected ? "lan-disconnect" : "lan-connect"} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.dashDisplay}>
          <Animated.View style={[styles.steeringGraphic, { transform: [{ rotate: rotateStr }] }]}>
            <MaterialCommunityIcons name="steering" size={180} color="rgba(255,255,255,0.15)" />
            <View style={styles.centerMarker} />
          </Animated.View>

          <Text style={styles.angleText}>{steeringAngle.toFixed(0)}°</Text>

          <TouchableOpacity style={styles.resetButton} onPress={sendReset}>
            <Text style={styles.resetText}>RESET CAR (R)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- RIGHT SECTION --- */}
      <View style={styles.sidePanel}>
        {/* Throttle Pedal (Big) */}
        <TouchableOpacity
          style={[styles.pedal, styles.throttlePedal]}
          onPressIn={() => sendCommand('throttle', true)}
          onPressOut={() => sendCommand('throttle', false)}
          activeOpacity={0.7}
        >
          <Text style={styles.pedalText}>GO</Text>
        </TouchableOpacity>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => sendCommand('handbrake', true)}>
            <MaterialCommunityIcons name="car-brake-parking" size={32} color="#ff3d00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => sendCommand('cruise', true)}>
            <MaterialCommunityIcons name="speedometer" size={32} color="#ff3d00" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  sidePanel: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  centerPanel: {
    flex: 2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },

  // Pedals
  pedal: {
    width: 120,
    height: 160,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  brakePedal: {
    backgroundColor: 'rgba(255, 60, 0, 0.25)', // Red tint
    borderTopWidth: 6,
    borderTopColor: 'rgba(255, 60, 0, 0.8)',
  },
  throttlePedal: {
    backgroundColor: 'rgba(0, 255, 128, 0.25)', // Green tint
    borderTopWidth: 6,
    borderTopColor: 'rgba(0, 255, 128, 0.8)',
  },
  pedalText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },

  // Icon Buttons
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Header & Status
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  connectedPill: { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
  disconnectedPill: { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
  statusDot: {
    width: 8, height: 8, borderRadius: 4, marginRight: 6,
  },
  statusText: {
    color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1,
  },
  miniInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 100,
    textAlign: 'center',
    fontSize: 12,
    marginRight: 8,
  },
  miniBtn: {
    padding: 5,
  },

  // Dashboard
  dashDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  steeringGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMarker: {
    position: 'absolute',
    top: -10,
    width: 4,
    height: 20,
    backgroundColor: '#00e5ff',
  },
  angleText: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: '100',
    color: '#fff',
    opacity: 0.8,
  },
  resetButton: {
    marginTop: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'orange',
  },
  resetText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
