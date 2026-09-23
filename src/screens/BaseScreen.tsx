import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CAMPAIGN_LEGS, CAMPAIGN_TITLE, DAILY_OPS } from '../game/campaign';
import { phaseOf } from '../game/engine';
import { opStatus } from '../game/progress';
import { readinessFor } from '../game/selectors';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { useTierPreview } from '../hooks/useTierPreview';
import { haptic } from '../utils/haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { TrailMark } from '../components/game/TrailMark';
import { ResourceMeters } from '../components/game/ResourceMeters';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { AgeGateModal } from '../components/modals/AgeGateModal';

type Nav = { navigate: (name: string, params?: object) => void };

const links = [
  { route: 'Skills', title: 'Field cards', meta: 'Lessons that feed the mile' },
  { route: 'Intel', title: 'Wire', meta: 'Static demo, not live' },
  { route: 'Scan', title: 'Notes', meta: 'No camera identification' },
  { route: 'Profile', title: 'Log', meta: 'Tier flag and streak' },
  { route: 'Offline', title: 'Maps', meta: 'Not in this build' },
];

export default function BaseScreen({ navigation }: { navigation: Nav }) {
  const user = useUser();
  const tiers = useTierPreview();
  const readiness = readinessFor(user);
  const phase = phaseOf(user.activeRun, CAMPAIGN_LEGS.length);

  const cta = phase === 'setup'
    ? 'Start the mile'
    : phase === 'debrief'
      ? 'Read the debrief'
      : phase === 'outcome'
        ? 'See the lesson'
        : `Continue · ${CAMPAIGN_LEGS[user.activeRun?.legIndex ?? 0]?.short ?? 'mile'}`;

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>Trailhead</Text>
          <View style={styles.headerRow}>
            <Text style={ui.h1}>{CAMPAIGN_TITLE}</Text>
            <View style={styles.level}>
              <Text style={styles.levelText}>{user.level}</Text>
            </View>
          </View>
          <Text style={[ui.muted, styles.lede]}>
            Four legs. A closed road. Decisions you can defend. Readiness moves when you train, not when you tap a box.
          </Text>

          <TrailMark />

          <GlassCard style={styles.play} accent={Colors.green}>
            <Text style={styles.playKicker}>{phase === 'setup' ? 'Not started' : phase === 'debrief' ? 'Debrief ready' : 'In progress'}</Text>
            <Text style={styles.playTitle}>{cta}</Text>
            {user.activeRun && phase !== 'setup' ? (
              <View style={styles.meters}>
                <ResourceMeters resources={user.activeRun.resources} thin />
              </View>
            ) : (
              <Text style={styles.playBody}>Pick a loadout, then walk water, night, pack, and a care decision.</Text>
            )}
            <TouchableOpacity
              testID="open-campaign"
              style={[ui.primary, styles.cta]}
              onPress={() => { haptic.tap(); navigation.navigate('Campaign', { focusLegId: null }); }}
            >
              <Text style={ui.primaryText}>{phase === 'setup' ? 'Play' : 'Open'}</Text>
            </TouchableOpacity>
          </GlassCard>

          <GlassCard style={styles.readiness}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Readiness</Text>
              <Text style={styles.score}>{readiness}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${readiness}%` }]} />
            </View>
            <Text style={styles.hint}>
              Streak {user.streak} · {user.runsCompleted} mile{user.runsCompleted === 1 ? '' : 's'} finished
              {user.turnbacks ? ` · ${user.turnbacks} turned back` : ''}
            </Text>
          </GlassCard>

          <View style={styles.sectionRow}>
            <Text style={styles.section}>Daily drills</Text>
            <Text style={styles.sectionMeta}>From the mile</Text>
          </View>
          <Text style={styles.drillNote}>These clear when you walk the matching leg. They do not skip you ahead.</Text>
          {DAILY_OPS.map((op) => {
            const status = opStatus(op, user.legsCleared, user.tier);
            return (
              <TouchableOpacity
                key={op.id}
                testID={`op-${op.id}`}
                activeOpacity={0.85}
                onPress={() => {
                  haptic.tap();
                  if (status === 'locked') {
                    tiers.setShowPlans(true);
                    return;
                  }
                  navigation.navigate('Campaign', { focusLegId: op.legId });
                }}
              >
                <GlassCard style={styles.op}>
                  <View style={styles.row}>
                    <View style={styles.opBody}>
                      <Text style={styles.opTitle}>{op.title}</Text>
                      <Text style={styles.opDesc}>{op.desc}</Text>
                    </View>
                    <Text style={[styles.opState, status === 'cleared' && styles.opCleared, status === 'locked' && styles.opLocked]}>
                      {status === 'cleared' ? 'Cleared' : status === 'locked' ? 'Pro preview' : 'In the mile'}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
          {user.tier === 'free' ? (
            <TouchableOpacity testID="open-tiers" onPress={() => { haptic.tap(); tiers.setShowPlans(true); }}>
              <Text style={styles.tierLink}>Medical inventory is a Pro preview. No purchase. The care decision in the mile stays free.</Text>
            </TouchableOpacity>
          ) : null}

          <GlassCard style={styles.demo}>
            <Text style={styles.demoKicker}>Global Threat Index · static demo</Text>
            <Text style={styles.demoTitle}>Sample label: Elevated</Text>
            <Text style={styles.opDesc}>Not measured. Not live. Nothing here is watching a grid, a storm, or a market.</Text>
          </GlassCard>

          <View style={styles.links}>
            {links.map((link) => (
              <TouchableOpacity
                key={link.route}
                style={styles.linkWrap}
                activeOpacity={0.85}
                onPress={() => { haptic.tap(); navigation.navigate(link.route); }}
              >
                <GlassCard style={styles.link}>
                  <Text style={styles.linkTitle}>{link.title}</Text>
                  <Text style={styles.opDesc}>{link.meta}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <SubscriptionModal visible={tiers.showPlans} onClose={() => tiers.setShowPlans(false)} onSelect={tiers.onSelect} />
      <AgeGateModal visible={tiers.showAge} onClose={() => tiers.setShowAge(false)} onVerified={tiers.onVerified} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 },
  level: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  levelText: { color: Colors.text, fontFamily: serif, fontSize: 18, fontWeight: '700' },
  lede: { marginTop: 8, marginBottom: 16 },
  play: { padding: 16, marginBottom: 14 },
  playKicker: { color: Colors.orange, fontFamily: sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  playTitle: { color: Colors.text, fontFamily: serif, fontSize: 26, fontWeight: '700', marginTop: 4 },
  playBody: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 8 },
  meters: { marginTop: 12 },
  cta: { marginTop: 14 },
  readiness: { padding: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  cardTitle: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700' },
  score: { color: Colors.green, fontFamily: serif, fontSize: 28, fontWeight: '700' },
  track: { height: 8, borderRadius: 99, backgroundColor: Colors.bg, marginTop: 12, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.green, borderRadius: 99 },
  hint: { color: Colors.muted, fontFamily: sans, fontSize: 13, marginTop: 10 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 },
  section: { color: Colors.text, fontFamily: serif, fontSize: 22, fontWeight: '700' },
  sectionMeta: { color: Colors.green, fontFamily: sans, fontSize: 12, fontWeight: '700' },
  drillNote: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: 10 },
  op: { padding: 14, marginBottom: 10 },
  opBody: { flex: 1, paddingRight: 8 },
  opTitle: { color: Colors.text, fontFamily: sans, fontSize: 16, fontWeight: '800' },
  opDesc: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginTop: 3 },
  opState: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '800' },
  opCleared: { color: Colors.green },
  opLocked: { color: Colors.yellow },
  tierLink: { color: Colors.yellow, fontFamily: sans, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  demo: { padding: 14, marginTop: 8, marginBottom: 16 },
  demoKicker: { color: Colors.red, fontFamily: sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  demoTitle: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 4, marginBottom: 4 },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  linkWrap: { width: '48%', marginBottom: 12 },
  link: { padding: 14, minHeight: 92 },
  linkTitle: { color: Colors.text, fontFamily: serif, fontSize: 18, fontWeight: '700', marginBottom: 4 },
});
