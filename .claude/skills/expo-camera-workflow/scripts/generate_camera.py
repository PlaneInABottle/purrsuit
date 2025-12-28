#!/usr/bin/env python3
"""
Expo Camera Workflow Generator (Updated for expo-camera v17)

Generates camera-related components and services following Purrsuit patterns.
"""

import os
import sys
from pathlib import Path
import argparse

def generate_camera_service():
    """Generate camera service with permission handling."""
    return '''import { Camera } from 'expo-camera'
import type { CameraType, FlashMode } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

export interface CameraPermissionStatus {
  granted: boolean
  canAskAgain: boolean
}

/**
 * Request camera permissions
 */
export async function requestCameraPermissions(): Promise<CameraPermissionStatus> {
  try {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync()
    return {
      granted: status === "granted",
      canAskAgain,
    }
  } catch (error) {
    console.error("Failed to request camera permissions:", error)
    return { granted: false, canAskAgain: false }
  }
}

/**
 * Toggle camera type (front/back)
 */
export function toggleCameraType(current: CameraType): CameraType {
  return current === "back" ? "front" : "back"
}

/**
 * Cycle through flash modes
 */
export function cycleFlashMode(current: FlashMode): FlashMode {
  const modes: FlashMode[] = ["off", "on", "auto"]
  const currentIndex = modes.indexOf(current)
  const nextIndex = (currentIndex + 1) % modes.length
  return modes[nextIndex]
}
'''

def generate_camera_component():
    """Generate camera component with controls."""
    return '''import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { CameraView } from 'expo-camera'
import type { CameraType, FlashMode } from 'expo-camera'
import { RefreshCw, Zap, ZapOff, CircleSlash, PawPrint } from 'lucide-react-native'
import { requestCameraPermissions } from '@/services/camera'

export const CaptureView = () => {
  const cameraRef = useRef<CameraView>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraType, setCameraType] = useState<CameraType>("back")
  const [flashMode, setFlashMode] = useState<FlashMode>("off")
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    const { granted } = await requestCameraPermissions()
    setHasPermission(granted)
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return

    setIsCapturing(true)
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0,
      })
      // Handle photo capture
    } catch (error) {
      console.error('Photo capture failed:', error)
      Alert.alert('Error', 'Failed to capture photo')
    } finally {
      setIsCapturing(false)
    }
  }

  if (hasPermission === null) return <View />

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
      >
        <View style={styles.controls}>
          {/* Add controls here */}
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: { flex: 1, justifyContent: 'space-between', padding: 24 }
})
'''

def main():
    parser = argparse.ArgumentParser(description="Generate Expo camera components")
    parser.add_argument("type", choices=["service", "component"],
                       help="Type of component to generate")

    args = parser.parse_args()

    if args.type == "service":
        code = generate_camera_service()
    elif args.type == "component":
        code = generate_camera_component()

    print(code)

if __name__ == "__main__":
    main()
