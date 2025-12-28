#!/usr/bin/env python3
"""
MapLibre Offline Map Manager Skill - Feature Generator

Generates map screens and location services following Purrsuit patterns.
"""

import os
import sys
import argparse

def generate_map_screen(name: str):
    """Generate a MapLibre screen."""
    return f'''import React, {{ useState, useRef, useCallback }} from 'react'
import {{ View, StyleSheet, TouchableOpacity }} from 'react-native'
import {{ MapView, Camera, PointAnnotation }} from "@maplibre/maplibre-react-native"
import {{ MAP_STYLES }} from "@/services/offlineMapManager"
import {{ Text }} from "@/components/Text"
import {{ Screen }} from "@/components/Screen"

export const {name}Screen = () => {{
  const mapRef = useRef(null)
  const cameraRef = useRef(null)
  const [mapStyle, setMapStyle] = useState("liberty")

  return (
    <Screen preset="fixed" safeAreaEdges={[]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        mapStyle={MAP_STYLES[mapStyle].url}
      >
        <Camera
          ref={cameraRef}
          longitude={{-122.4324}}
          latitude={{37.78825}}
          zoom={{12}}
        />
        
        {/* Markers go here */}
      </MapView>
      
      <View style={styles.controls}>
        {/* Style selector or zoom controls */}
      </View>
    </Screen>
  )
}}

const styles = StyleSheet.create({{
  controls: {{
    position: 'absolute',
    right: 16,
    bottom: 30,
    gap: 12,
  }}
}})
'''

def main():
    parser = argparse.ArgumentParser(description="Generate map features")
    parser.add_argument("name", help="Name of the map screen")
    
    args = parser.parse_args()
    
    print(generate_map_screen(args.name))

if __name__ == "__main__":
    main()
