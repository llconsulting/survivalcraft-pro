import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookOpen, faCompass, faLayerGroup, faSatelliteDish, faUser } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../theme/colors';

const iconMap = {
  compass: faCompass,
  'layer-group': faLayerGroup,
  book: faBookOpen,
  'satellite-dish': faSatelliteDish,
  user: faUser,
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
          <FontAwesomeIcon icon={iconMap[icon]} size={20} color={Colors.bg} />
        </View>
      </View>
    );
  }
  return <FontAwesomeIcon icon={iconMap[icon]} size={20} color={color} />;
};

const styles = StyleSheet.create({
  centerContainer: { marginTop: -18 },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.bg,
  },
});
