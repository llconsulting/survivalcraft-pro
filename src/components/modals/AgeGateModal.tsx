import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { sans, serif } from '../../theme/type';
import { haptic } from '../../utils/haptics';
import { GlassCard } from '../ui/GlassCard';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const AgeGateModal: React.FC<Props> = ({ visible, onClose, onVerified }) => {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const verify = () => {
    const n = parseInt(age, 10);
    if (!Number.isFinite(n) || n < 18) {
      haptic.warn();
      setError('Elite preview stays locked. This check is 18 or older.');
      return;
    }
    setError('');
    haptic.confirm();
    onVerified();
  };

  return (
    <Modal visible={visible} transparent animationType={Platform.OS === 'web' ? 'none' : 'slide'} onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.kicker}>Demo flag</Text>
          <Text style={styles.title}>Age check</Text>
          <GlassCard style={styles.card}>
            <Text style={styles.text}>
              Elite is an educational preview on this device. Confirm you are 18 or older. This does not create an account or a certification.
            </Text>
            <Text style={styles.label}>Age</Text>
            <TextInput
              testID="age-input"
              value={age}
              onChangeText={(value) => { setAge(value); setError(''); }}
              keyboardType="number-pad"
              placeholder="18"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              maxLength={3}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity testID="age-verify" style={styles.primary} onPress={verify}>
              <Text style={styles.primaryText}>Confirm</Text>
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,10,8,0.78)' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, zIndex: 2 },
  handle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  kicker: { fontFamily: sans, color: Colors.orange, fontSize: 11, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
  title: { fontFamily: serif, color: Colors.text, fontSize: 28, fontWeight: '700', marginBottom: 12 },
  card: { padding: 16 },
  text: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  label: { color: Colors.text, fontFamily: sans, fontSize: 12, fontWeight: '700', marginTop: 8, marginBottom: 6 },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: sans,
    fontSize: 16,
  },
  error: { color: Colors.red, fontFamily: sans, fontSize: 13, marginTop: 8, lineHeight: 18 },
  primary: { backgroundColor: Colors.yellow, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  primaryText: { color: Colors.bg, fontFamily: sans, fontWeight: '800', fontSize: 15 },
  secondary: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  secondaryText: { color: Colors.text, fontFamily: sans, fontWeight: '700', fontSize: 15 },
});
