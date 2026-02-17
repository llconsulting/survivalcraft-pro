import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/ui/GlassCard';
import { TierBadge } from '../components/ui/TierBadge';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { AgeGateModal } from '../components/modals/AgeGateModal';

import { useUser } from '../hooks/useUser';
import { Colors } from '../theme/colors';
import { haptic } from '../utils/haptics';

export default function ProfileScreen() {
  const { tier, level, xp, streak, hydrated, hydrate, setTier, ageVerifiedElite, verifyEliteAge, reset } = useUser();
  const [showPlans, setShowPlans] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);

  useEffect(() => { if (!hydrated) hydrate(); }, [hydrated, hydrate]);

  const onSelectTier = (t: any) => {
    if (t === 'elite' && !ageVerifiedElite) {
      setShowPlans(false);
      setShowAgeGate(true);
      return;
    }
    setTier(t);
    setShowPlans(false);
  };

  const onVerified = () => {
    verifyEliteAge();
    setTier('elite');
    setShowAgeGate(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>OPERATOR PROFILE</Text>
          <Text style={styles.headerTitle}>Status</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Tier</Text>
            <TierBadge tier={tier} />
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptic.tap(); setShowPlans(true); }}>
            <Text style={styles.primaryBtnText}>Manage Subscription</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={async () => { haptic.warn(); await reset(); }}>
            <Text style={styles.secondaryBtnText}>Reset Demo Data</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Purchases are stubbed. Wire to StoreKit 2 when ready.
          </Text>
        </GlassCard>

        <GlassCard style={styles.legal}>
          <Text style={styles.legalTitle}>Legal + Safety</Text>
          <Text style={styles.legalText}>
            Educational app. No step-by-step instructions for harm, wrongdoing, or illegal activity.
            Always follow local laws and official guidance.
          </Text>
        </GlassCard>
      </View>

      <SubscriptionModal
        visible={showPlans}
        onClose={() => setShowPlans(false)}
        onSelect={onSelectTier}
      />

      <AgeGateModal
        visible={showAgeGate}
        onClose={() => setShowAgeGate(false)}
        onVerified={onVerified}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  wrap: { flex: 1, padding: 16 },

  header: { marginTop: 8, marginBottom: 16 },
  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },

  card: { padding: 16, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  label: { color: Colors.muted, fontSize: 13, fontWeight: '900' },

  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  statLabel: { color: Colors.muted, fontSize: 12, marginTop: 4 },

  primaryBtn: { backgroundColor: Colors.green, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },

  secondaryBtn: { backgroundColor: Colors.surface2, paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: Colors.text, fontSize: 14, fontWeight: '900' },

  note: { color: Colors.muted, fontSize: 11, marginTop: 12, lineHeight: 15 },

  legal: { padding: 16 },
  legalTitle: { color: Colors.text, fontSize: 15, fontWeight: '900', marginBottom: 8 },
  legalText: { color: Colors.muted, fontSize: 13, lineHeight: 18 },
});
