import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ResourceKey, Resources } from '../../game/types';
import { Colors } from '../../theme/colors';
import { sans } from '../../theme/type';

const ROWS: { key: ResourceKey; label: string; color: string }[] = [
  { key: 'water', label: 'Water', color: Colors.blue },
  { key: 'warmth', label: 'Warmth', color: Colors.orange },
  { key: 'energy', label: 'Energy', color: Colors.yellow },
  { key: 'kit', label: 'Kit', color: Colors.purple },
];

function Meter({ value, color }: { value: number; color: string }) {
  const anim = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 360, useNativeDriver: false }).start();
  }, [anim, value]);
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

export const ResourceMeters: React.FC<{ resources: Resources; thin?: boolean }> = ({ resources, thin }) => (
  <View style={[styles.grid, thin && styles.gridThin]}>
    {ROWS.map((row) => {
      const value = Math.round(resources[row.key]);
      return (
        <View key={row.key} style={styles.row}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={[styles.value, value <= 20 && { color: Colors.red }]}>{value}</Text>
          </View>
          <Meter value={value} color={row.color} />
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  grid: { gap: 10 },
  gridThin: { gap: 6 },
  row: { gap: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  value: { color: Colors.text, fontFamily: sans, fontSize: 12, fontWeight: '800' },
  track: { height: 8, borderRadius: 99, backgroundColor: Colors.bg, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});
