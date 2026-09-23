import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Colors } from '../../theme/colors';
import { sans } from '../../theme/type';
import { haptic } from '../../utils/haptics';

export function Viewfinder() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [open, setOpen] = useState(false);

  const enable = async () => {
    haptic.tap();
    const result = permission?.granted ? permission : await requestPermission();
    if (result?.granted) setOpen(true);
  };

  if (!open) {
    return (
      <TouchableOpacity style={styles.ask} onPress={enable}>
        <Text style={styles.askTitle}>Open the viewfinder</Text>
        <Text style={styles.askBody}>It will not name what it sees. You can skip it and write a note.</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.frame}>
      <Camera style={StyleSheet.absoluteFill} type={CameraType.back} />
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Viewfinder only. No identification.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ask: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    backgroundColor: Colors.surface,
  },
  askTitle: { color: Colors.text, fontFamily: sans, fontWeight: '800', fontSize: 15 },
  askBody: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginTop: 4 },
  frame: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#000',
  },
  banner: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(16,20,15,0.88)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bannerText: { color: Colors.text, fontFamily: sans, fontSize: 12, fontWeight: '700' },
});
