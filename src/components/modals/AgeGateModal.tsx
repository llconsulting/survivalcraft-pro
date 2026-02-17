import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Colors } from '../../theme/colors';
import { haptic } from '../../utils/haptics';
import { GlassCard } from '../ui/GlassCard';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const AgeGateModal: React.FC<Props> = ({ visible, onClose, onVerified }) => {
  const [age, setAge] = useState('');

  const verify = () => {
    const n = parseInt(age, 10);
    if (!Number.isFinite(n) || n < 18) {
      haptic.warn();
      return;
    }
    haptic.confirm();
    onVerified();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Age Verification</Text>

          <GlassCard style={styles.card}>
            <Text style={styles.text}>
              Elite includes restricted educational modules. No step-by-step harmful content is provided.
            </Text>
            <Text style={styles.text}>
              Confirm you are at least 18 to unlock Elite.
            </Text>

            <Text style={styles.label}>Your age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="18"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              maxLength={3}
            />

            <TouchableOpacity style={styles.primary} onPress={verify}>
              <Text style={styles.primaryText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondary} onPress={() => { haptic.tap(); onClose(); }}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.82)' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  handle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  title: { color: Colors.text, fontSize: 20, fontWeight: '900', marginBottom: 12 },

  card: { padding: 16 },
  text: { color: Colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  label: { color: Colors.text, fontSize: 12, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#000', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: Colors.text, borderWidth: 1, borderColor: Colors.border },

  primary: { backgroundColor: Colors.yellow, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  primaryText: { color: '#000', fontWeight: '900', fontSize: 15 },

  secondary: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  secondaryText: { color: Colors.text, fontWeight: '900', fontSize: 15 },
});
