import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { TierBadge } from './TierBadge';
import { Skill } from '../../types';
import { Colors } from '../../theme/colors';

interface Props {
  skill: Skill;
  locked: boolean;
}

const emojiFor = (icon: string) => {
  switch (icon) {
    case 'tint': return '💧';
    case 'fire': return '🔥';
    case 'campground': return '⛺';
    case 'leaf': return '🌿';
    case 'rope': return '🪢';
    case 'paw': return '🐾';
    case 'heart-pulse': return '🏥';
    case 'tower-broadcast': return '📡';
    case 'shield-halved': return '🛡️';
    case 'flask': return '🧪';
    case 'users-gear': return '👥';
    case 'bolt': return '⚡';
    case 'utensils': return '🍽️';
    case 'lock': return '🔒';
    default: return '⚙️';
  }
};

export const SkillCard: React.FC<Props> = ({ skill, locked }) => {
  return (
    <GlassCard style={styles.card}>
      {locked ? <View style={styles.locked} /> : null}
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: `${skill.color}20` }]}>
          <Text style={[styles.emoji, { color: skill.color }]}>{emojiFor(skill.icon)}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={[styles.name, locked && { color: Colors.muted }]} numberOfLines={1}>
              {skill.name}
            </Text>
            <TierBadge tier={skill.tier} />
          </View>
          <Text style={styles.desc} numberOfLines={2}>{skill.description}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${skill.progress}%`, backgroundColor: skill.color }]} />
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12, position: 'relative' },
  locked: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    zIndex: 5,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  emoji: { fontSize: 28 },
  body: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  name: { color: Colors.text, fontSize: 17, fontWeight: '800', flexShrink: 1 },
  desc: { color: Colors.muted, fontSize: 13, marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: Colors.surface, borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
});
