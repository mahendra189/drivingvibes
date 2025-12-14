import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert, Platform } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [ipAddress, setIpAddress] = useState('192.168.1.50');
  const [connected, setConnected] = useState(false);
  const [steeringAngle, setSteeringAngle] = useState(0); // Degrees
  const ws = useRef(null);
  
  // Animation value for visual feedback
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Request permissions or setup sensors
    DeviceMotion.setUpdateInterval(60); // approx 16ms (60Hz) = 16ms, wait user asked for 60ms intervals (approx 15-20/sec). 1000/16 = 62Hz. 60ms = 1000/60 = 16Hz.
    // The user asked "Send JSON data ... at 60ms intervals".
    // setUpdateInterval takes ms.
    DeviceMotion.setUpdateInterval(60); 

    const subscription = DeviceMotion.addListener(data => {
      const { rotation } = data;
      if (rotation) {
        // rotation.gamma is usually roll (left/right tilt) in radians
        // Note: Orientation depends on device mode (portrait/landscape). 
        // Assuming Portrait for simplicity or extracting relevant axis.
        // In Portrait: Gamma is left/right tilt.
        
        // Convert radians to degrees
        const degrees = rotation.gamma * (180 / Math.PI);
        setSteeringAngle(degrees);
        
        // Update visual rotation
        Animated.timing(rotateAnim, {
          toValue: degrees,
          duration: 60,
          useNativeDriver: true,
        }).start();

        // Send to WebSocket if connected
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            // We want to send roll. 
            // -45 to +45 is the range server expects.
            // We send the raw degrees, server handles clamping/mapping.
            const payload = JSON.stringify({ roll: degrees });
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
        Alert.alert("Connected", "Successfully connected to PC!");
      };

      ws.current.onclose = (e) => {
        console.log("Disconnected", e.reason);
        setConnected(false);
        Alert.alert("Disconnected", "Connection closed.");
      };

      ws.current.onerror = (e) => {
        console.log("Error", e.message);
        setConnected(false);
        Alert.alert("Error", "Connection failed. Check IP and make sure Server is running.");
      };

    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.message);
    }
  };

  // Interpolate rotation for style
  const rotateStr = rotateAnim.interpolate({
    inputRange: [-90, 90],
    outputRange: ['-90deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Text style={styles.title}>SteerByPhone</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>PC IP Address:</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="192.168.1.X"
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, connected ? styles.buttonDisconnect : styles.buttonConnect]} 
        onPress={connectToPC}
      >
        <Text style={styles.buttonText}>{connected ? "DISCONNECT" : "CONNECT"}</Text>
      </TouchableOpacity>

      <View style={styles.visualContainer}>
        <Text style={styles.angleText}>{steeringAngle.toFixed(1)}°</Text>
        <Animated.View style={[styles.steeringWheel, { transform: [{ rotate: rotateStr }] }]}>
           {/* Simple Visual Representation of a Wheel */}
           <View style={styles.wheelRim} />
           <View style={styles.wheelSpoke} />
        </Animated.View>
        <Text style={styles.instruction}>Tilt phone left/right to steer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#bbb',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonConnect: {
    backgroundColor: '#4CAF50',
  },
  buttonDisconnect: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  angleText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  steeringWheel: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wheelRim: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 15,
    borderColor: '#00BCD4',
  },
  wheelSpoke: {
    position: 'absolute',
    width: 180,
    height: 15,
    backgroundColor: '#00BCD4',
    borderRadius: 5,
  },
  instruction: {
    color: '#888',
    marginTop: 20,
  }
});
