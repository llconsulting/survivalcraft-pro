import React, { useMemo, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillsData } from '../data/skills';
import { skillStatusLabel, tierAllows } from '../game/progress';
import { progressFor, skillRefs } from '../game/selectors';
import { trainingStart } from '../game/training';
import { Skill, UserTier } from '../types';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { useTierPreview } from '../hooks/useTierPreview';
import { haptic } from '../utils/haptics';
import { SkillCard } from '../components/ui/SkillCard';
import { TierBadge } from '../components/ui/TierBadge';
import { MarkIcon } from '../components/ui/MarkIcon';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { AgeGateModal } from '../components/modals/AgeGateModal';

type Nav = { navigate: (name: string, params?: object) => void };

const filters: { key: UserTier | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'pro', label: 'Pro' },
  { key: 'elite', label: 'Elite' },
];

export default function SkillsScreen({ navigation }: { navigation: Nav }) {
  const [filter, setFilter] = useState<UserTier | 'all'>('all');
  const [selected, setSelected] = useState<Skill | null>(null);
  const [drill, setDrill] = useState<{ id: string; step: number } | null>(null);
  const tier = useUser((state) => state.tier);
  const reviewed = useUser((state) => state.reviewed);
  const bestGrades = useUser((state) => state.bestGrades);
  const ageVerifiedElite = useUser((state) => state.ageVerifiedElite);
  const togglePrinciple = useUser((state) => state.togglePrinciple);
  const tiers = useTierPreview();

  const filtered = useMemo(
    () => (filter === 'all' ? skillsData : skillsData.filter((skill) => skill.tier === filter)),
    [filter],
  );

  const open = (skill: Skill) => {
    haptic.tap();
    setDrill(null);
    setSelected(skill);
  };

  const close = () => {
    haptic.tap();
    setDrill(null);
    setSelected(null);
  };

  const allowed = (skill: Skill) => tierAllows(tier, skill.tier, !!ageVerifiedElite);
  const drillStep = selected && drill?.id === selected.id ? drill.step : null;

  const onTrainingPress = () => {
    if (!selected) return;
    const action = trainingStart(selected, tier, !!ageVerifiedElite);
    haptic.confirm();
    if (action.kind === 'mile') {
      setDrill(null);
      setSelected(null);
      navigation.navigate('Campaign', { focusLegId: action.legId });
      return;
    }
    if (action.kind === 'locked') {
      if (action.legId) {
        setDrill(null);
        setSelected(null);
        navigation.navigate('Campaign', { focusLegId: action.legId });
        return;
      }
      tiers.setShowPlans(true);
      return;
    }
    const count = selected.principles.length;
    if (drillStep === null) {
      setDrill({ id: selected.id, step: 0 });
      return;
    }
    if (drillStep >= count) {
      close();
      return;
    }
    const principle = selected.principles[drillStep];
    const marked = (reviewed[selected.id] ?? []).includes(principle.id);
    if (!marked) togglePrinciple(selected.id, principle.id);
    setDrill({ id: selected.id, step: drillStep + 1 });
  };

  const trainingLabel = () => {
    if (!selected) return 'Start training';
    const action = trainingStart(selected, tier, !!ageVerifiedElite);
    if (action.kind === 'locked' && !action.legId) return 'Preview demo tiers';
    if (action.kind !== 'read') return 'Start training';
    const count = selected.principles.length;
    if (drillStep === null) return 'Start training';
    if (drillStep >= count) return 'Close';
    if (drillStep === count - 1) return 'Log training';
    return 'Next';
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>Field cards</Text>
          <Text style={ui.h1}>Skills</Text>
          <Text style={[ui.muted, styles.lede]}>
            Reading a card stops at 70. The Dry Mile is what marks a skill drilled. Nothing here is a certification.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {filters.map((item) => {
              const on = filter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => { haptic.select(); setFilter(item.key); }}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {filtered.map((skill) => {
            const progress = progressFor(skill.id, { reviewed, bestGrades });
            const ref = skillRefs().find((item) => item.id === skill.id);
            const status = skillStatusLabel(progress, !!ref?.legId);
            return (
              <TouchableOpacity key={skill.id} activeOpacity={0.88} onPress={() => open(skill)}>
                <SkillCard skill={skill} locked={!allowed(skill)} progress={allowed(skill) ? progress : 0} status={status} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={!!selected} transparent animationType={Platform.OS === 'web' ? 'none' : 'slide'} onRequestClose={close}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {selected ? (
              <>
                <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.sheetHeader}>
                    <View style={styles.sheetTitles}>
                      <TierBadge tier={selected.tier} />
                      <Text style={styles.sheetTitle}>{selected.name}</Text>
                      <Text style={styles.sheetMeta}>{selected.category}</Text>
                    </View>
                    <TouchableOpacity onPress={close}>
                      <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                  </View>

                  {!allowed(selected) ? (
                    <View style={styles.locked}>
                      <MarkIcon name="lock" color={Colors.yellow} size={36} />
                      <Text style={styles.lockedTitle}>Preview locked</Text>
                      <Text style={styles.lockedText}>
                        {selected.tier === 'elite'
                          ? 'Elite is an age-checked demo flag. The pages stay educational and non-actionable.'
                          : 'Pro preview opens this lesson. The care decision in The Dry Mile stays free either way.'}
                      </Text>
                    </View>
                  ) : (
                    <>
                      {selected.content.split('\n\n').map((paragraph) => (
                        <Text key={paragraph.slice(0, 20)} style={styles.content}>{paragraph}</Text>
                      ))}
                      {selected.advanced ? <Text style={styles.advanced}>{selected.advanced}</Text> : null}
                      {selected.restricted ? (
                        <Text style={styles.restricted}>Educational only. No instructions for harm, synthesis, or illegal activity.</Text>
                      ) : null}
                      <Text style={styles.principlesLabel}>Mark as read</Text>
                      {selected.principles.map((principle) => {
                        const on = (reviewed[selected.id] ?? []).includes(principle.id);
                        return (
                          <TouchableOpacity
                            key={principle.id}
                            testID={`principle-${principle.id}`}
                            style={[styles.principle, on && styles.principleOn]}
                            onPress={() => { haptic.select(); togglePrinciple(selected.id, principle.id); }}
                          >
                            <Text style={styles.principleMark}>{on ? 'Read' : '—'}</Text>
                            <Text style={styles.principleText}>{principle.text}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      <Text style={styles.cap}>
                        {selected.legId
                          ? 'A sound run of the matching leg drills this card. Reading alone will not.'
                          : 'No scenario leg for this card yet. Reading stops at 70 and will not show as drilled.'}
                      </Text>
                    </>
                  )}
                </ScrollView>
                <View style={styles.footer}>
                  {drillStep !== null && drillStep < selected.principles.length ? (
                    <Text style={styles.stepLine}>
                      Step {drillStep + 1} of {selected.principles.length}. {selected.principles[drillStep].text}
                    </Text>
                  ) : null}
                  {drillStep !== null && drillStep >= selected.principles.length ? (
                    <Text style={styles.stepLine}>Logged on this device. Reading stops at 70. This card has no mile leg.</Text>
                  ) : null}
                  <TouchableOpacity testID="start-training" style={ui.primary} onPress={onTrainingPress}>
                    <Text style={ui.primaryText}>{trainingLabel()}</Text>
                  </TouchableOpacity>
                  {!allowed(selected) && selected.legId ? (
                    <TouchableOpacity style={[ui.ghost, styles.gap]} onPress={() => { haptic.tap(); tiers.setShowPlans(true); }}>
                      <Text style={ui.ghostText}>Preview demo tiers</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
      <SubscriptionModal visible={tiers.showPlans} onClose={() => tiers.setShowPlans(false)} onSelect={tiers.onSelect} />
      <AgeGateModal visible={tiers.showAge} onClose={() => tiers.setShowAge(false)} onVerified={tiers.onVerified} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  lede: { marginTop: 8, marginBottom: 14 },
  filters: { gap: 8, paddingBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  chipOn: { backgroundColor: Colors.text, borderColor: Colors.text },
  chipText: { color: Colors.muted, fontFamily: sans, fontWeight: '800', fontSize: 13 },
  chipTextOn: { color: Colors.bg },
  modal: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,10,8,0.78)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    zIndex: 2,
  },
  sheetScroll: { flexGrow: 0, maxHeight: 420 },
  footer: { paddingTop: 12 },
  stepLine: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  handle: { width: 36, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sheetTitles: { flex: 1, paddingRight: 12 },
  sheetTitle: { color: Colors.text, fontFamily: serif, fontSize: 28, fontWeight: '700', marginTop: 8 },
  sheetMeta: { color: Colors.muted, fontFamily: sans, marginTop: 2 },
  close: { color: Colors.muted, fontFamily: sans, fontWeight: '700' },
  content: { color: Colors.text, fontFamily: sans, fontSize: 15, lineHeight: 22, marginBottom: 10 },
  advanced: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  restricted: { color: Colors.red, fontFamily: sans, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  principlesLabel: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 6, marginBottom: 8 },
  principle: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 8, backgroundColor: Colors.bg },
  principleOn: { borderColor: Colors.green },
  principleMark: { color: Colors.green, fontFamily: sans, fontSize: 12, fontWeight: '800', width: 36 },
  principleText: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20, flex: 1 },
  cap: { color: Colors.muted, fontFamily: sans, fontSize: 13, lineHeight: 18, marginTop: 4 },
  gap: { marginTop: 10 },
  locked: { alignItems: 'flex-start', paddingVertical: 12, gap: 8 },
  lockedTitle: { color: Colors.yellow, fontFamily: serif, fontSize: 24, fontWeight: '700' },
  lockedText: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginBottom: 8 },
});
