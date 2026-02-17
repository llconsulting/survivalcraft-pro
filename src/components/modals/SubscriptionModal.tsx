import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { TierBadge } from '../ui/TierBadge';
import { UserTier } from '../../types';
import { Colors } from '../../theme/colors';
import { haptic } from '../../utils/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (tier: UserTier) => void;
}

export const SubscriptionModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const choose = (tier: UserTier) => {
    haptic.select();
    onSelect(tier);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose Tier</Text>

          <GlassCard style={styles.plan}>
            <View style={styles.planRow}>
              <TierBadge tier="free" />
              <View style={styles.planText}>
                <Text style={styles.planName}>Free</Text>
                <Text style={styles.planDesc}>5 basic skills</Text>
              </View>
              <TouchableOpacity style={styles.cta} onPress={() => choose('free')}>
                <Text style={styles.ctaText}>Select</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <GlassCard style={styles.plan}>
            <View style={styles.planRow}>
              <TierBadge tier="pro" />
              <View style={styles.planText}>
                <Text style={styles.planName}>Pro</Text>
                <Text style={styles.planDesc}>All modules + scanner UI + offline placeholders</Text>
              </View>
              <TouchableOpacity style={styles.cta} onPress={() => choose('pro')}>
                <Text style={styles.ctaText}>Select</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>$9.99 / mo (stub)</Text>
          </GlassCard>

          <GlassCard style={[styles.plan, styles.elitePlan]}>
            <View style={styles.planRow}>
              <TierBadge tier="elite" />
              <View style={styles.planText}>
                <Text style={styles.planName}>Elite</Text>
                <Text style={styles.planDesc}>Restricted educational modules (placeholders) + age gate</Text>
              </View>
              <TouchableOpacity style={styles.cta} onPress={() => choose('elite')}>
                <Text style={styles.ctaText}>Select</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>$19.99 / mo (stub)</Text>
            <Text style={styles.disclaimer}>Educational only. No step-by-step harmful or illegal guidance.</Text>
          </GlassCard>

          <TouchableOpacity style={styles.closeBtn} onPress={() => { haptic.tap(); onClose(); }}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Purchases are not implemented in this build. Wire to StoreKit 2 or a vetted billing layer when you’re ready.
          </Text>
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

  plan: { padding: 14, marginBottom: 10 },
  elitePlan: { borderWidth: 1, borderColor: 'rgba(255,214,10,0.45)' },

  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planText: { flex: 1 },
  planName: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  planDesc: { color: Colors.muted, fontSize: 12, marginTop: 2, lineHeight: 16 },
  cta: { backgroundColor: Colors.green, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  ctaText: { color: '#000', fontWeight: '900' },

  price: { color: Colors.muted, fontSize: 12, marginTop: 8 },
  disclaimer: { color: Colors.muted, fontSize: 11, marginTop: 6, lineHeight: 15 },

  closeBtn: { marginTop: 6, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#000' },
  closeText: { color: Colors.text, fontSize: 15, fontWeight: '900' },

  footer: { color: Colors.muted, fontSize: 11, marginTop: 10, lineHeight: 15 },
});
