import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export const TrailMark: React.FC = () => (
  <View style={styles.wrap}>
    <Svg width="100%" height="132" viewBox="0 0 360 132">
      <Path d="M0 78 C 50 70, 80 40, 130 48 C 180 56, 200 28, 250 34 C 300 40, 320 62, 360 50 L 360 132 L 0 132 Z" fill={Colors.surface2} />
      <Path d="M0 92 C 40 84, 90 100, 140 86 C 190 72, 230 96, 280 82 C 320 72, 340 78, 360 70" stroke={Colors.border} strokeWidth="2" fill="none" />
      <Path
        d="M28 96 C 70 90, 110 78, 150 80 C 200 82, 230 64, 278 68 C 310 71, 330 60, 348 58"
        stroke={Colors.orange}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <Circle cx="28" cy="96" r="5" fill={Colors.bg} stroke={Colors.orange} strokeWidth="2" />
      <Circle cx="150" cy="80" r="4" fill={Colors.orange} />
      <Circle cx="278" cy="68" r="4" fill={Colors.muted} />
      <Circle cx="348" cy="58" r="6" fill={Colors.green} />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1c1812',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
});
