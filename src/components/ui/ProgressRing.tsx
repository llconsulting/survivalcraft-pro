import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props {
  value: number; // 0-100
  size?: number;
  label?: string;
}

export const ProgressRing: React.FC<Props> = ({ value, size = 56, label }) => {
  // Lightweight ring: fake with border + overlay (no svg dependency)
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.value}>{Math.round(clamped)}%</Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 3,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  value: { color: Colors.text, fontWeight: '900', fontSize: 13 },
  label: { color: Colors.muted, fontSize: 10, marginTop: 2 },
});
