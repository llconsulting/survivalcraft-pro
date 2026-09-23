import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserTier } from '../../types';
import { Colors } from '../../theme/colors';
import { sans, serif } from '../../theme/type';
import { haptic } from '../../utils/haptics';
import { GlassCard } from '../ui/GlassCard';
import { TierBadge } from '../ui/TierBadge';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (tier: UserTier) => void;
}

const plans: { tier: UserTier; name: string; desc: string }[] = [
  {
    tier: 'free',
    name: 'Free',
    desc: 'The Dry Mile, basic field cards, and notes. The care decision is in the mile. The medical lesson is not.',
  },
  {
    tier: 'pro',
    name: 'Pro',
    desc: 'Opens the Pro field cards and the medical inventory check. Still a preview. Still not a certification.',
  },
  {
    tier: 'elite',
    name: 'Elite',
    desc: 'Educational modules behind an age check. No synthesis, no tactics course, no certificate.',
  },
];

export const SubscriptionModal: React.FC<Props> = ({ visible, onClose, onSelect }) => (
    <Modal visible={visible} transparent animationType={Platform.OS === 'web' ? 'none' : 'slide'} onRequestClose={onClose}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.kicker}>Demo flags</Text>
        <Text style={styles.title}>Preview a tier</Text>
        <Text style={styles.lede}>
          These flags only change what this device can open. There is no purchase, no receipt, and no StoreKit.
        </Text>
        {plans.map((plan) => (
          <GlassCard key={plan.tier} style={styles.plan} accent={plan.tier === 'elite' ? Colors.yellow : undefined}>
            <View style={styles.planRow}>
              <View style={styles.planText}>
                <View style={styles.planTitle}>
                  <TierBadge tier={plan.tier} />
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </View>
              <TouchableOpacity
                testID={`tier-${plan.tier}`}
                style={styles.cta}
                onPress={() => {
                  haptic.select();
                  onSelect(plan.tier);
                }}
              >
                <Text style={styles.ctaText}>Use</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
        <TouchableOpacity testID="close-tiers" style={styles.closeBtn} onPress={() => { haptic.tap(); onClose(); }}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,10,8,0.78)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    zIndex: 2,
  },
  handle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  kicker: { fontFamily: sans, color: Colors.orange, fontSize: 11, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
  title: { fontFamily: serif, color: Colors.text, fontSize: 28, fontWeight: '700', marginTop: 4 },
  lede: { fontFamily: sans, color: Colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 14 },
  plan: { padding: 14, marginBottom: 10 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planText: { flex: 1 },
  planTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  planName: { color: Colors.text, fontFamily: serif, fontSize: 18, fontWeight: '700' },
  planDesc: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18 },
  cta: { backgroundColor: Colors.green, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  ctaText: { color: Colors.bg, fontFamily: sans, fontWeight: '800' },
  closeBtn: { marginTop: 4, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.bg },
  closeText: { color: Colors.text, fontFamily: sans, fontSize: 15, fontWeight: '700' },
});
