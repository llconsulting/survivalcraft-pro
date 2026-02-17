import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { skillsData } from '../data/skills';
import { Skill, UserTier } from '../types';
import { useUser } from '../hooks/useUser';
import { Colors } from '../theme/colors';
import { haptic } from '../utils/haptics';
import { SkillCard } from '../components/ui/SkillCard';
import { TierBadge } from '../components/ui/TierBadge';

export default function SkillsScreen() {
  const [filter, setFilter] = useState<UserTier | 'all'>('all');
  const [selected, setSelected] = useState<Skill | null>(null);
  const { tier, ageVerifiedElite, completeSkill, addXP } = useUser();

  const filtered = useMemo(() => {
    return filter === 'all' ? skillsData : skillsData.filter(s => s.tier === filter);
  }, [filter]);

  const hasAccess = (skill: Skill) => {
    if (skill.tier === 'free') return true;
    if (skill.tier === 'pro') return tier !== 'free';
    // elite:
    return tier === 'elite' && !!ageVerifiedElite;
  };

  const open = (skill: Skill) => {
    haptic.tap();
    setSelected(skill);
  };

  const startTraining = (skill: Skill) => {
    if (!hasAccess(skill)) return;
    haptic.confirm();
    completeSkill(skill.id);
    addXP(150);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>TRAINING MODULES</Text>
          <Text style={styles.headerTitle}>Skill Tree</Text>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {[
            { key: 'all', label: 'All', color: Colors.text },
            { key: 'free', label: 'Basic', color: Colors.green },
            { key: 'pro', label: 'Pro', color: Colors.blue },
            { key: 'elite', label: 'Elite', color: Colors.yellow },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => { haptic.select(); setFilter(f.key as any); }}
              style={[
                styles.chip,
                filter === f.key && { backgroundColor: Colors.text, borderColor: f.color },
              ]}
            >
              <Text style={[
                styles.chipText,
                filter === f.key ? { color: '#000' } : { color: Colors.muted },
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          {filtered.map((skill) => {
            const locked = !hasAccess(skill);
            return (
              <TouchableOpacity key={skill.id} activeOpacity={0.85} onPress={() => open(skill)}>
                <SkillCard skill={skill} locked={locked} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Detail modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setSelected(null)} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {selected ? (
              <>
                <View style={styles.sheetHeader}>
                  <View>
                    <TierBadge tier={selected.tier} />
                    <Text style={styles.sheetTitle}>{selected.name}</Text>
                    <Text style={styles.sheetMeta}>{selected.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => { haptic.tap(); setSelected(null); }}>
                    <View style={styles.close}>
                      <Text style={styles.closeText}>✕</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {!hasAccess(selected) ? (
                  <View style={styles.lockedBox}>
                    <FontAwesomeIcon icon={faLock} size={44} color={Colors.yellow} />
                    <Text style={styles.lockedTitle}>Locked</Text>
                    <Text style={styles.lockedText}>
                      Pro unlocks Pro modules. Elite modules require Elite + age verification.
                    </Text>
                  </View>
                ) : (
                  <>
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                      <Text style={styles.contentText}>{selected.content}</Text>

                      {selected.advanced ? (
                        <View style={styles.advanced}>
                          <Text style={[styles.advancedTitle, { color: selected.color }]}>★ Advanced Notes</Text>
                          <Text style={styles.advancedText}>{selected.advanced}</Text>
                        </View>
                      ) : null}

                      {selected.restricted ? (
                        <View style={styles.restricted}>
                          <Text style={styles.restrictedTitle}>⚠ Educational Only</Text>
                          <Text style={styles.restrictedText}>
                            This module stays non-actionable by design. No instructions for harm, wrongdoing, or illegal activity.
                          </Text>
                        </View>
                      ) : null}
                    </ScrollView>

                    <TouchableOpacity style={styles.primary} onPress={() => startTraining(selected)}>
                      <Text style={styles.primaryText}>Start Training</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, padding: 16 },

  header: { marginTop: 8, marginBottom: 16 },
  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },

  filters: { marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: '800' },

  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.82)' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  handle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },

  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sheetTitle: { color: Colors.text, fontSize: 26, fontWeight: '900', marginTop: 8 },
  sheetMeta: { color: Colors.muted, marginTop: 4 },

  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface2, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: Colors.text, fontSize: 18, fontWeight: '800' },

  lockedBox: { alignItems: 'center', paddingVertical: 40 },
  lockedTitle: { color: Colors.yellow, fontSize: 20, fontWeight: '900', marginTop: 10 },
  lockedText: { color: Colors.muted, marginTop: 8, textAlign: 'center', lineHeight: 18 },

  content: { marginTop: 8, marginBottom: 16 },
  contentText: { color: Colors.text, fontSize: 15, lineHeight: 22 },

  advanced: { marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: 'rgba(255,255,255,0.03)' },
  advancedTitle: { fontWeight: '900', marginBottom: 6 },
  advancedText: { color: Colors.text, lineHeight: 20 },

  restricted: { marginTop: 14, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,69,58,0.35)', backgroundColor: 'rgba(255,69,58,0.10)' },
  restrictedTitle: { color: Colors.red, fontWeight: '900', marginBottom: 6 },
  restrictedText: { color: Colors.muted, lineHeight: 18 },

  primary: { backgroundColor: Colors.green, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  primaryText: { color: '#000', fontSize: 16, fontWeight: '900' },
});
