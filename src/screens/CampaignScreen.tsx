import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CAMPAIGN_LEGS, CAMPAIGN_SUMMARY, CAMPAIGN_TITLE, LOADOUTS } from '../game/campaign';
import { continueLabel, gradeLabel, phaseOf, RESOURCE_KEYS, RESOURCE_LABEL, scoreRun } from '../game/engine';
import { gradeColor, Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { haptic } from '../utils/haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { ResourceMeters } from '../components/game/ResourceMeters';
import { RouteTrack } from '../components/game/RouteTrack';
import { TrailMark } from '../components/game/TrailMark';
import { skillsData } from '../data/skills';

type Nav = { navigate: (name: string, params?: object) => void };
type Route = { params?: { focusLegId?: string | null } };

export default function CampaignScreen({ navigation, route }: { navigation: Nav; route: Route }) {
  const hydrated = useUser((state) => state.hydrated);
  const run = useUser((state) => state.activeRun);
  const tier = useUser((state) => state.tier);
  const xp = useUser((state) => state.xp);
  const level = useUser((state) => state.level);
  const streak = useUser((state) => state.streak);
  const startRun = useUser((state) => state.startRun);
  const resolveChoice = useUser((state) => state.resolveChoice);
  const continueRun = useUser((state) => state.continueRun);
  const dismissRun = useUser((state) => state.dismissRun);
  const leaveRun = useUser((state) => state.leaveRun);
  const [loadoutId, setLoadoutId] = useState('balanced');

  if (!hydrated) {
    return (
      <SafeAreaView style={ui.screen}>
        <Text style={[ui.muted, { padding: 24 }]}>Opening the log…</Text>
      </SafeAreaView>
    );
  }

  const phase = phaseOf(run, CAMPAIGN_LEGS.length);
  const leg = run ? CAMPAIGN_LEGS[run.legIndex] : undefined;
  const score = run ? scoreRun(run) : null;
  const focusLeg = CAMPAIGN_LEGS.find((item) => item.id === route.params?.focusLegId) ?? null;

  const close = () => {
    haptic.tap();
    navigation.navigate('Base');
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView style={styles.scroller} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <View style={styles.top}>
            <TouchableOpacity onPress={close} testID="close-mile">
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
            <Text style={ui.kicker}>Scenario</Text>
          </View>

          {phase === 'setup' ? (
            <>
              <TrailMark />
              <Text style={ui.h1}>{CAMPAIGN_TITLE}</Text>
              <Text style={[ui.body, styles.gap]}>{CAMPAIGN_SUMMARY}</Text>
              <View style={styles.steps}>
                <Text style={styles.step}>1. Pick what you are willing to carry.</Text>
                <Text style={styles.step}>2. Read the leg. Choose. The cost shows after.</Text>
                <Text style={styles.step}>3. A bad call spends margin and still teaches. You can run it again.</Text>
              </View>
              <Text style={styles.section}>Loadout</Text>
              {focusLeg ? (
                <Text style={styles.focus}>{focusLine(focusLeg)}</Text>
              ) : (
                <Text style={styles.focus}>Pick what you will carry, then press Start training. The button stays on screen.</Text>
              )}
              {LOADOUTS.map((loadout) => {
                const selected = loadout.id === loadoutId;
                return (
                  <TouchableOpacity
                    key={loadout.id}
                    testID={`loadout-${loadout.id}`}
                    activeOpacity={0.85}
                    onPress={() => { haptic.select(); setLoadoutId(loadout.id); }}
                  >
                    <GlassCard style={styles.loadout} accent={selected ? Colors.green : undefined}>
                      <View style={styles.loadoutHead}>
                        <Text style={styles.loadoutName}>{loadout.name}</Text>
                        <Text style={[styles.selected, selected && styles.selectedOn]}>{selected ? 'Selected' : 'Choose'}</Text>
                      </View>
                      <Text style={styles.loadoutSummary}>{loadout.summary}</Text>
                      <Text style={styles.loadoutMeta}>
                        Water {loadout.resources.water} · Warmth {loadout.resources.warmth} · Energy {loadout.resources.energy} · Kit {loadout.resources.kit}
                      </Text>
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : null}

          {run && phase !== 'setup' ? (
            <>
              <Text style={ui.h2}>{CAMPAIGN_TITLE}</Text>
              {focusLeg ? <Text style={styles.focus}>{focusLine(focusLeg)}</Text> : null}
              <RouteTrack legIndex={run.legIndex} status={run.status} />
              <GlassCard style={styles.meters}>
                <ResourceMeters resources={run.resources} />
              </GlassCard>
            </>
          ) : null}

          {phase === 'play' && run && leg ? (
            <>
              <Text style={[ui.kicker, styles.gap]}>{leg.kicker}</Text>
              <Text style={ui.h2}>{leg.title}</Text>
              {leg.briefing.split('\n\n').map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} style={[ui.body, styles.paragraph]}>{paragraph}</Text>
              ))}
              {thin(run.resources) ? <Text style={styles.thin}>Margin is thin. The next call matters.</Text> : null}
              <Text style={styles.section}>Choose</Text>
              {leg.choices.map((choice, index) => (
                <TouchableOpacity
                  key={choice.id}
                  testID={`choice-${choice.id}`}
                  activeOpacity={0.85}
                  onPress={() => { haptic.tap(); resolveChoice(choice.id); }}
                >
                  <GlassCard style={styles.choice}>
                    <Text style={styles.choiceIndex}>0{index + 1}</Text>
                    <Text style={styles.choiceTitle}>{choice.title}</Text>
                    <Text style={styles.choiceStake}>{choice.stake}</Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
              <TouchableOpacity testID="leave-run" onPress={() => { haptic.warn(); leaveRun(); }}>
                <Text style={styles.leave}>Abandon this run. No credit.</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {phase === 'outcome' && run?.pending ? (
            <>
              <View style={[styles.stamp, { borderColor: gradeColor[run.pending.grade] }]}>
                <Text style={[styles.stampText, { color: gradeColor[run.pending.grade] }]}>{gradeLabel(run.pending.grade)}</Text>
              </View>
              <Text style={[ui.h2, styles.gap]}>What it cost</Text>
              <Text style={ui.body}>{run.pending.lesson}</Text>
              <View style={styles.deltas}>
                {RESOURCE_KEYS.map((key) => {
                  const delta = run.pending!.after[key] - run.pending!.before[key];
                  if (delta === 0) return null;
                  return (
                    <Text key={key} style={[styles.delta, { color: delta > 0 ? Colors.green : Colors.red }]}>
                      {RESOURCE_LABEL[key]} {delta > 0 ? '+' : ''}{delta}
                    </Text>
                  );
                })}
              </View>
              {run.pending.critical ? (
                <Text style={styles.thin}>
                  {RESOURCE_LABEL[run.pending.critical]} ran out. Turning back still keeps the lesson.
                </Text>
              ) : null}
            </>
          ) : null}

          {phase === 'debrief' && run && score ? (
            <>
              <Text style={[ui.kicker, styles.gap]}>{run.status === 'complete' ? 'Debrief' : 'Turned back'}</Text>
              <Text style={ui.h1}>{score.headline}</Text>
              {run.endedBy ? (
                <Text style={[ui.body, styles.gap]}>
                  You stopped because {RESOURCE_LABEL[run.endedBy]} ran out. That is a valid end. The legs you did not walk are the ones to reread.
                </Text>
              ) : (
                <Text style={[ui.body, styles.gap]}>
                  Four decisions, then the kitchen. The point is the habit, not a badge.
                </Text>
              )}
              <GlassCard style={styles.scoreCard}>
                <Text style={styles.scoreLine}>{score.sound} sound · {score.costly} costly · {score.risky} risky</Text>
                <Text style={styles.scoreXp}>+{score.xp} XP</Text>
                <Text style={styles.scoreMeta}>Level {level} · {xp} XP · streak {streak}</Text>
              </GlassCard>
              <Text style={styles.section}>Lessons kept</Text>
              {run.log.map((entry) => (
                <GlassCard key={`${entry.legId}-${entry.choiceId}`} style={styles.lesson} accent={gradeColor[entry.grade]}>
                  <Text style={[styles.lessonGrade, { color: gradeColor[entry.grade] }]}>{gradeLabel(entry.grade)}</Text>
                  <Text style={styles.lessonBody}>{entry.lesson}</Text>
                </GlassCard>
              ))}
              <Text style={styles.section}>Trained</Text>
              <Text style={ui.body}>{trainedLine(run.log.flatMap((entry) => entry.skillIds), tier)}</Text>
              <TouchableOpacity testID="dismiss-run" style={[ui.primary, styles.gapLarge]} onPress={() => { haptic.tap(); dismissRun(); }}>
                <Text style={ui.primaryText}>Choose another loadout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ui.ghost} onPress={close}>
                <Text style={ui.ghostText}>Back to the trailhead</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
      {phase === 'setup' ? (
        <View style={styles.dock}>
          <TouchableOpacity
            testID="start-training"
            style={[ui.primary, styles.dockButton]}
            onPress={() => { haptic.confirm(); startRun(loadoutId); }}
          >
            <Text style={ui.primaryText}>Start training</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {phase === 'outcome' && run ? (
        <View style={styles.dock}>
          <TouchableOpacity
            testID="continue-leg"
            style={[ui.primary, styles.dockButton]}
            onPress={() => { haptic.confirm(); continueRun(); }}
          >
            <Text style={ui.primaryText}>{continueLabel(run, CAMPAIGN_LEGS.length)}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function focusLine(leg: (typeof CAMPAIGN_LEGS)[number]): string {
  const names = leg.skillIds
    .map((id) => skillsData.find((skill) => skill.id === id)?.name)
    .filter((name): name is string => !!name);
  const what = names.length ? names.join(' and ') : leg.short;
  return `${what} clears on the ${leg.short} leg. Press Start training, then walk the legs in order. This does not skip ahead.`;
}

function thin(resources: { water: number; warmth: number; energy: number }): boolean {
  return [resources.water, resources.warmth, resources.energy].some((value) => value > 0 && value <= 25);
}

function trainedLine(ids: string[], tier: string): string {
  const unique = [...new Set(ids)];
  return unique.map((id) => {
    const skill = skillsData.find((item) => item.id === id);
    if (!skill) return id;
    if (skill.tier !== 'free' && tier === 'free') return `${skill.name} (decision only — the lesson page stays locked)`;
    return skill.name;
  }).join(' · ');
}

const styles = StyleSheet.create({
  scroller: { flex: 1 },
  scroll: { paddingTop: 8, paddingBottom: 96 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  close: { color: Colors.muted, fontFamily: sans, fontSize: 14, fontWeight: '700' },
  gap: { marginTop: 12 },
  gapLarge: { marginTop: 18, marginBottom: 10 },
  steps: { marginTop: 16, gap: 6 },
  step: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20 },
  section: {
    marginTop: 20,
    marginBottom: 10,
    color: Colors.muted,
    fontFamily: sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  focus: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  loadout: { padding: 14, marginBottom: 10 },
  loadoutHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  loadoutName: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700', flexShrink: 1 },
  selected: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '800' },
  selectedOn: { color: Colors.green },
  loadoutSummary: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 4 },
  loadoutMeta: { color: Colors.text, fontFamily: sans, fontSize: 12, marginTop: 8 },
  meters: { padding: 14, marginBottom: 16 },
  paragraph: { marginTop: 10 },
  thin: { color: Colors.orange, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 12 },
  choice: { padding: 14, marginBottom: 10 },
  choiceIndex: { color: Colors.orange, fontFamily: sans, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  choiceTitle: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700', marginTop: 4 },
  choiceStake: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 6 },
  leave: { color: Colors.muted, fontFamily: sans, fontSize: 13, textAlign: 'center', marginTop: 8, marginBottom: 12 },
  stamp: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    transform: [{ rotate: '-6deg' }],
    marginTop: 8,
  },
  stampText: { fontFamily: sans, fontSize: 13, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  deltas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  delta: { fontFamily: sans, fontSize: 13, fontWeight: '800' },
  scoreCard: { padding: 16, marginTop: 16 },
  scoreLine: { color: Colors.text, fontFamily: sans, fontSize: 15, fontWeight: '700' },
  scoreXp: { color: Colors.green, fontFamily: serif, fontSize: 32, fontWeight: '700', marginTop: 6 },
  scoreMeta: { color: Colors.muted, fontFamily: sans, fontSize: 13, marginTop: 4 },
  lesson: { padding: 14, marginBottom: 10 },
  lessonGrade: { fontFamily: sans, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  lessonBody: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 21, marginTop: 6 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  dockButton: { width: '100%', maxWidth: 728 },
});
