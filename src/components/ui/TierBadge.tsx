import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserTier } from '../../types';

interface Props { tier: UserTier }

export const TierBadge: React.FC<Props> = ({ tier }) => {
  const config = {
    free: { bg: '#30d158', text: '#000', label: 'FREE' },
    pro: { bg: '#0a84ff', text: '#fff', label: 'PRO' },
    elite: { bg: '#ffd60a', text: '#000', label: 'ELITE' },
  } as const;

  const { bg, text, label } = config[tier];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  text: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
