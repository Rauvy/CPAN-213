import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Animated,
  PanResponder,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0.2)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const [isDragging, setIsDragging] = useState(false);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#8B4513', '#A0522D', '#8B4513'],
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });

        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 5,
          useNativeDriver: false,
        }).start();

        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: false,
        }).start();

        Animated.timing(shadowAnim, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const startRotation = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const startColorChange = () => {
    Animated.sequence([
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Animated.View
        style={[
          styles.broomContainer,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }, { scale: scaleAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[styles.broomHandle, { backgroundColor: backgroundColor }]} />

        <View style={styles.broomHeadContainer}>
          <View style={styles.broomBinding} />
          <View style={styles.broomBristles}>
            {[...Array(14)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.bristle,
                  {
                    height: 35 + Math.random() * 15,
                    left: i * 5,
                    transform: [{ rotate: `${-10 + i * 2}deg` }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.shadow,
          {
            opacity: shadowOpacity,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Sweep!" onPress={startRotation} color="#8B4513" />
        <View style={styles.buttonSpacer} />
        <Button title="Polish!" onPress={startColorChange} color="#A0522D" />
      </View>

      <Text style={styles.instructionText}>Drag the broom to move it around!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  broomContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 270,
    width: 110,
  },
  broomHandle: {
    height: 200,
    width: 14,
    backgroundColor: '#8B4513',
    borderRadius: 6,
  },
  broomHeadContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  broomBinding: {
    height: 18,
    width: 30,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  broomBristles: {
    position: 'relative',
    width: 75,
    height: 50,
    flexDirection: 'row',
  },
  bristle: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
    bottom: 0,
  },
  shadow: {
    position: 'absolute',
    bottom: 50,
    width: 120,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    width: '80%',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: 20,
  },
  instructionText: {
    marginTop: 30,
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});
