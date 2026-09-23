import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTint,
  faFire,
  faCampground,
  faKitMedical,
  faBookOpen,
  faBoxOpen,
  faCloudBolt,
  faTowerBroadcast,
  faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { GlassCard } from '../components/ui/GlassCard';
import { useUser } from '../hooks/useUser';
import { Colors } from '../theme/colors';
import { haptic } from '../utils/haptics';
import { dailyOps, isOpUnlocked } from '../data/dailyOps';
import { skillsData } from '../data/skills';
import { computeReadiness, normalizeStoredUser } from '../utils/dailyOpsLogic';

const opIcons: Record<string, IconDefinition> = {
  water: faTint,
  fire: faFire,
  shelter: faCampground,
  medical: faKitMedical,
};

const opColors: Record<string, string> = {
  water: Colors.blue,
  fire: Colors.orange,
  shelter: Colors.green,
  medical: Colors.red,
};

export default function BaseScreen({ navigation }: any) {
  const stored = useUser();
  const { level, hydrated, toggleDailyOp } = stored;
  const view = useMemo(
    () => normalizeStoredUser(stored),
    [
      stored.tier,
      stored.streak,
      stored.skillsCompleted,
      stored.lastDailyOpDate,
      stored.dailyOpsDate,
      stored.dailyOpsCompleted,
      stored.streakCarry,
      stored.streakCarryFromDate,
      stored.level,
      stored.xp,
      stored.ageVerifiedElite,
    ],
  );

  const rows = useMemo(() => {
    return dailyOps.map((op) => {
      const unlocked = isOpUnlocked(op.id, view.tier);
      const completed = unlocked && (view.dailyOpsCompleted ?? []).includes(op.id);
      return { ...op, unlocked, completed, icon: opIcons[op.id], color: opColors[op.id] };
    });
  }, [view.tier, view.dailyOpsCompleted]);

  const openRows = rows.filter((op) => op.unlocked);
  const completedCount = openRows.filter((op) => op.completed).length;
  const readiness = useMemo(
    () => computeReadiness({
      completedUnlocked: completedCount,
      unlockedCount: openRows.length,
      streak: view.streak,
      skillsCompleted: view.skillsCompleted.length,
      skillsTotal: skillsData.length,
    }),
    [completedCount, openRows.length, view.streak, view.skillsCompleted],
  );

  const onOpPress = (id: string, unlocked: boolean) => {
    if (!hydrated) return;
    if (!unlocked) {
      haptic.warn();
      return;
    }
    haptic.tap();
    toggleDailyOp(id);
  };

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.scroll}>
          <Text style={styles.headerLabel}>OPERATIVE DASHBOARD</Text>
          <Text style={styles.headerTitle}>Command Center</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>OPERATIVE DASHBOARD</Text>
            <Text style={styles.headerTitle}>Command Center</Text>
            <Text style={[styles.streakLine, view.streak > 0 && styles.streakLive]}>
              Streak {view.streak}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{level}</Text>
          </View>
        </View>

        {/* Threat Index */}
        <GlassCard style={styles.threatCard}>
          <View style={styles.threatHeader}>
            <View>
              <Text style={styles.threatLabel}>GLOBAL THREAT INDEX</Text>
              <Text style={styles.threatTitle}>ELEVATED</Text>
              <Text style={styles.threatSub}>Signals trending negative (demo)</Text>
            </View>
            <View style={styles.threatBadge}>
              <Text style={styles.threatNumber}>4</Text>
            </View>
          </View>
          <View style={styles.threatTags}>
            <View style={[styles.tag, { backgroundColor: 'rgba(255,69,58,0.2)' }]}>
              <Text style={[styles.tagText, { color: Colors.red }]}>Supply</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: 'rgba(255,149,0,0.2)' }]}>
              <Text style={[styles.tagText, { color: Colors.orange }]}>Weather</Text>
            </View>
          </View>
        </GlassCard>

        {/* Daily Ops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Operations</Text>
            <Text style={styles.sectionMeta}>{completedCount} of {openRows.length} today</Text>
          </View>

          {rows.map((op) => (
            <TouchableOpacity key={op.id} onPress={() => onOpPress(op.id, op.unlocked)} activeOpacity={0.7}>
              <GlassCard style={[styles.opCard, op.completed && styles.opCompleted]}>
                <View style={[styles.opIcon, { backgroundColor: `${op.color}20` }]}>
                  <FontAwesomeIcon icon={op.icon} size={20} color={op.color} />
                </View>
                <View style={styles.opContent}>
                  <Text style={[styles.opTitle, op.completed && styles.opTitleDone]}>{op.title}</Text>
                  <Text style={styles.opDesc}>{op.unlocked ? op.desc : 'Unlock with Pro'}</Text>
                </View>
                <View style={[styles.opCheck, op.completed && styles.opCheckDone]}>
                  {op.completed && <Text style={styles.opCheckmark}>✓</Text>}
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Grid */}
        <View style={styles.grid}>
          <TouchableOpacity onPress={() => { haptic.tap(); navigation.navigate('Skills'); }} activeOpacity={0.7}>
            <GlassCard style={styles.gridItem}>
              <FontAwesomeIcon icon={faBookOpen} size={28} color={Colors.orange} style={styles.gridIcon} />
              <Text style={styles.gridTitle}>Field Manual</Text>
              <Text style={styles.gridMeta}>Skills</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { haptic.tap(); navigation.navigate('Intel'); }} activeOpacity={0.7}>
            <GlassCard style={styles.gridItem}>
              <FontAwesomeIcon icon={faCloudBolt} size={28} color={Colors.blue} style={styles.gridIcon} />
              <Text style={styles.gridTitle}>Intel</Text>
              <Text style={styles.gridMeta}>Threat feed</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { haptic.tap(); navigation.navigate('Scan'); }} activeOpacity={0.7}>
            <GlassCard style={styles.gridItem}>
              <FontAwesomeIcon icon={faTowerBroadcast} size={28} color={Colors.green} style={styles.gridIcon} />
              <Text style={styles.gridTitle}>Scan</Text>
              <Text style={styles.gridMeta}>AR camera</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { haptic.tap(); navigation.navigate('Profile'); }} activeOpacity={0.7}>
            <GlassCard style={styles.gridItem}>
              <FontAwesomeIcon icon={faBoxOpen} size={28} color={Colors.purple} style={styles.gridIcon} />
              <Text style={styles.gridTitle}>Profile</Text>
              <Text style={styles.gridMeta}>Tier + stats</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { haptic.tap(); navigation.navigate('Offline'); }} activeOpacity={0.7}>
            <GlassCard style={styles.gridItem}>
              <FontAwesomeIcon icon={faMapLocationDot} size={28} color={Colors.yellow} style={styles.gridIcon} />
              <Text style={styles.gridTitle}>Offline</Text>
              <Text style={styles.gridMeta}>Maps stub</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Readiness */}
        <GlassCard style={styles.readinessCard}>
          <View style={styles.readinessHeader}>
            <Text style={styles.readinessTitle}>Readiness</Text>
            <Text style={styles.readinessScore}>{readiness.score}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${readiness.score}%` }]} />
          </View>
          <Text style={styles.readinessHint}>
            {readiness.opsPoints} from today's ops · {readiness.streakPoints} from streak · {readiness.skillsPoints} from skills finished
          </Text>
          <Text style={styles.readinessRule}>
            One open op counts for today. Clear them all and today no longer counts. Skip a calendar day and the streak returns to 0.
          </Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, padding: 16 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },
  streakLine: { color: Colors.muted, fontSize: 13, fontWeight: '800', marginTop: 4 },
  streakLive: { color: Colors.green },

  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.text, fontSize: 20, fontWeight: '800' },

  threatCard: { padding: 16, marginBottom: 24 },
  threatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  threatLabel: { color: Colors.red, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  threatTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },
  threatSub: { color: Colors.muted, fontSize: 14, marginTop: 4 },
  threatBadge: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: Colors.red, justifyContent: 'center', alignItems: 'center' },
  threatNumber: { color: Colors.red, fontSize: 24, fontWeight: '900' },
  threatTags: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  tagText: { fontSize: 12, fontWeight: '700' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  sectionMeta: { color: Colors.green, fontSize: 12, fontWeight: '800' },

  opCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 },
  opCompleted: { opacity: 0.6 },
  opIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  opContent: { flex: 1 },
  opTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  opTitleDone: { textDecorationLine: 'line-through', color: Colors.muted },
  opDesc: { color: Colors.muted, fontSize: 13 },
  opCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  opCheckDone: { backgroundColor: 'rgba(48,209,88,0.2)', borderColor: Colors.green },
  opCheckmark: { color: Colors.green, fontSize: 14, fontWeight: '900' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridItem: { width: 156, padding: 16 },
  gridIcon: { marginBottom: 12 },
  gridTitle: { color: Colors.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  gridMeta: { color: Colors.muted, fontSize: 12 },

  readinessCard: { padding: 16 },
  readinessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  readinessTitle: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  readinessScore: { color: Colors.green, fontSize: 28, fontWeight: '900' },
  progressBar: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 4 },
  readinessHint: { color: Colors.muted, fontSize: 12, marginTop: 12, lineHeight: 17 },
  readinessRule: { color: Colors.muted, fontSize: 12, marginTop: 6, lineHeight: 17 },
});
