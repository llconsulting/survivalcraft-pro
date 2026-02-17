import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraType } from 'expo-camera';

import { Colors } from '../theme/colors';
import { GlassCard } from '../components/ui/GlassCard';
import { haptic } from '../utils/haptics';

type ScanResult = { name: string; confidence: number; notes: string };

export default function ARScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission && !permission.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!scanning) {
      scanAnim.stopAnimation();
      scanAnim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, scanAnim]);

  const canUseCamera = permission?.granted;

  const startScan = async () => {
    haptic.tap();
    if (!canUseCamera) return;

    setScanning(true);

    // Placeholder: integrate a vetted plant ID model/API later
    setTimeout(() => {
      setScanning(false);
      setResult({
        name: 'Unknown Plant',
        confidence: 0.62,
        notes: 'Placeholder result. Integrate a vetted plant ID model/API to enable real identification.',
      });
      haptic.confirm();
    }, 1300);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Requesting camera permission…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!canUseCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>Camera Required</Text>
          <Text style={styles.muted}>Enable camera access to use the scan experience.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => requestPermission()}>
            <Text style={styles.primaryBtnText}>Enable Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const translateY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 260] });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.cameraWrap}>
        <Camera ref={(r) => (cameraRef.current = r)} style={StyleSheet.absoluteFill} type={CameraType.back} />

        <View style={styles.overlay}>
          <Text style={styles.headerLabel}>AR SCAN</Text>

          <View style={styles.frame}>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          </View>

          <GlassCard style={styles.hintCard}>
            <Text style={styles.hintTitle}>Aim at leaf + stem</Text>
            <Text style={styles.hintBody}>
              This is UI-only right now. Add a plant ID model/API next.
            </Text>
          </GlassCard>

          <TouchableOpacity style={[styles.scanBtn, scanning && { opacity: 0.65 }]} onPress={startScan} disabled={scanning}>
            <Text style={styles.scanBtnText}>{scanning ? 'Scanning…' : 'Initiate Scan'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={!!result} transparent animationType="slide" onRequestClose={() => setResult(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setResult(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{result?.name}</Text>
            <Text style={styles.modalMeta}>Confidence: {Math.round((result?.confidence ?? 0) * 100)}%</Text>
            <Text style={styles.modalText}>{result?.notes}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setResult(null)}>
              <Text style={styles.primaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  cameraWrap: { flex: 1 },
  overlay: { flex: 1, padding: 16, justifyContent: 'space-between' },

  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 8 },

  frame: {
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(48,209,88,0.85)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  scanLine: { height: 3, backgroundColor: 'rgba(48,209,88,0.8)', width: '100%' },

  hintCard: { padding: 14 },
  hintTitle: { color: Colors.text, fontSize: 16, fontWeight: '900', marginBottom: 6 },
  hintBody: { color: Colors.muted, fontSize: 13, lineHeight: 18 },

  scanBtn: { backgroundColor: Colors.green, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  scanBtnText: { color: '#000', fontSize: 17, fontWeight: '900' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '900', marginBottom: 8 },
  muted: { color: Colors.muted, marginTop: 8, textAlign: 'center' },

  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.82)' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHandle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { color: Colors.text, fontSize: 24, fontWeight: '900', marginBottom: 6 },
  modalMeta: { color: Colors.green, fontWeight: '900', marginBottom: 12 },
  modalText: { color: Colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 16 },

  primaryBtn: { backgroundColor: Colors.surface2, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { color: Colors.text, fontSize: 16, fontWeight: '900' },
});
