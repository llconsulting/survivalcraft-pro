import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserTier } from '../../types';
import { Colors } from '../../theme/colors';
import { sans } from '../../theme/type';

const config = {
  free: { bg: Colors.green, text: Colors.bg, label: 'FREE' },
  pro: { bg: Colors.blue, text: Colors.bg, label: 'PRO' },
  elite: { bg: Colors.yellow, text: Colors.bg, label: 'ELITE' },
} as const;

export const TierBadge: React.FC<{ tier: UserTier }> = ({ tier }) => {
  const { bg, text, label } = config[tier];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 },
  text: { fontFamily: sans, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
});
