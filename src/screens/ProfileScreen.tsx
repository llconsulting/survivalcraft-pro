import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readinessFor } from '../game/selectors';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { useTierPreview } from '../hooks/useTierPreview';
import { haptic } from '../utils/haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { TierBadge } from '../components/ui/TierBadge';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { AgeGateModal } from '../components/modals/AgeGateModal';

export default function ProfileScreen() {
  const user = useUser();
  const tiers = useTierPreview();
  const readiness = readinessFor(user);

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>Log</Text>
          <Text style={ui.h1}>Profile</Text>
          <GlassCard style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Demo tier</Text>
              <TierBadge tier={user.tier} />
            </View>
            <View style={styles.stats}>
              <Stat value={String(user.level)} label="Level" />
              <Stat value={String(user.xp)} label="XP" />
              <Stat value={String(user.streak)} label="Streak" />
              <Stat value={`${readiness}%`} label="Ready" />
            </View>
            <Text style={styles.meta}>
              {user.runsCompleted} mile{user.runsCompleted === 1 ? '' : 's'} finished · {user.turnbacks} turned back · best sound calls {user.bestSound}
            </Text>
            <TouchableOpacity testID="open-tiers" style={[ui.primary, styles.gap]} onPress={() => { haptic.tap(); tiers.setShowPlans(true); }}>
              <Text style={ui.primaryText}>Preview demo tiers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="reset-demo"
              style={[ui.ghost, styles.gap]}
              onPress={async () => { haptic.warn(); await user.reset(); }}
            >
              <Text style={ui.ghostText}>Reset this device</Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              Tiers are local flags. Changing one does not buy anything and does not write a receipt.
              {user.ageVerifiedElite ? ' Elite age check is stored on this device only.' : ''}
            </Text>
          </GlassCard>
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>What this is not</Text>
            <Text style={styles.note}>
              Not medical advice, not a first-aid certification, not live intel, and not a scanner. If someone is hurt and you are unsure, contact emergency services.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
      <SubscriptionModal visible={tiers.showPlans} onClose={() => tiers.setShowPlans(false)} onSelect={tiers.onSelect} />
      <AgeGateModal visible={tiers.showAge} onClose={() => tiers.setShowAge(false)} onVerified={tiers.onVerified} />
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  card: { padding: 16, marginTop: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: Colors.muted, fontFamily: sans, fontSize: 13, fontWeight: '800' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: Colors.text, fontFamily: serif, fontSize: 22, fontWeight: '700' },
  statLabel: { color: Colors.muted, fontFamily: sans, fontSize: 12, marginTop: 4 },
  meta: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginTop: 14 },
  gap: { marginTop: 12 },
  note: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 19, marginTop: 12 },
  cardTitle: { color: Colors.text, fontFamily: serif, fontSize: 22, fontWeight: '700' },
});
