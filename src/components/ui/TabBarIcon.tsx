import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCompass,
  faLayerGroup,
  faCamera,
  faSatelliteDish,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  compass: faCompass,
  'layer-group': faLayerGroup,
  camera: faCamera,
  'satellite-dish': faSatelliteDish,
  'user-shield': faUserShield,
};

interface Props {
  icon: keyof typeof iconMap;
  color: string;
  isCenter?: boolean;
}

export const TabBarIcon: React.FC<Props> = ({ icon, color, isCenter }) => {
  if (isCenter) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.centerButton}>
          <FontAwesomeIcon icon={iconMap[icon]} size={24} color="#000" />
        </View>
      </View>
    );
  }
  return <FontAwesomeIcon icon={iconMap[icon]} size={24} color={color} />;
};

const styles = StyleSheet.create({
  centerContainer: { marginTop: -20 },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#30d158',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#30d158',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
