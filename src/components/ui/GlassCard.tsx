import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: string;
}

export const GlassCard: React.FC<Props> = ({ children, style, accent }) => (
  <View style={[styles.container, accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
