import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Skill } from '../../types';
import { Colors } from '../../theme/colors';
import { sans, serif } from '../../theme/type';
import { GlassCard } from './GlassCard';
import { MarkIcon } from './MarkIcon';
import { TierBadge } from './TierBadge';

interface Props {
  skill: Skill;
  locked: boolean;
  progress: number;
  status: string;
}

export const SkillCard: React.FC<Props> = ({ skill, locked, progress, status }) => (
  <GlassCard style={styles.card} accent={locked ? Colors.border : skill.color}>
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: `${skill.color}22` }]}>
        <MarkIcon name={skill.icon} color={skill.color} size={26} />
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{skill.name}</Text>
          <TierBadge tier={skill.tier} />
        </View>
        <Text style={styles.desc} numberOfLines={2}>{skill.description}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: skill.color }]} />
        </View>
        <Text style={styles.status}>{locked ? 'Preview locked' : status}</Text>
      </View>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  name: { color: Colors.text, fontFamily: serif, fontSize: 18, fontWeight: '700', flexShrink: 1 },
  desc: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  track: { height: 5, borderRadius: 99, backgroundColor: Colors.bg, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  status: { color: Colors.muted, fontFamily: sans, fontSize: 11, fontWeight: '700', marginTop: 6, letterSpacing: 0.4 },
});
