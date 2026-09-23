import {
  ActiveRun,
  Choice,
  Grade,
  Leg,
  Loadout,
  Phase,
  ResourceKey,
  Resources,
  RunStatus,
} from './types';

export const RESOURCE_KEYS: ResourceKey[] = ['water', 'warmth', 'energy', 'kit'];

export const RESOURCE_LABEL: Record<ResourceKey, string> = {
  water: 'water',
  warmth: 'warmth',
  energy: 'energy',
  kit: 'kit',
};

const GRADE_XP: Record<Grade, number> = {
  sound: 120,
  costly: 60,
  risky: 30,
};

const COMPLETE_BONUS = 80;
const TURNBACK_BONUS = 40;

export function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function clampResources(resources: Resources): Resources {
  return {
    water: clamp(resources.water),
    warmth: clamp(resources.warmth),
    energy: clamp(resources.energy),
    kit: clamp(resources.kit),
  };
}

export function applyDeltas(resources: Resources, deltas: Partial<Resources>): Resources {
  return {
    water: resources.water + (deltas.water ?? 0),
    warmth: resources.warmth + (deltas.warmth ?? 0),
    energy: resources.energy + (deltas.energy ?? 0),
    kit: resources.kit + (deltas.kit ?? 0),
  };
}

/** Kit can hit zero without ending the day. Water, warmth, and energy cannot. */
export function criticalResource(resources: Resources): ResourceKey | null {
  if (resources.water <= 0) return 'water';
  if (resources.warmth <= 0) return 'warmth';
  if (resources.energy <= 0) return 'energy';
  return null;
}

export function findLoadout(loadouts: Loadout[], id: string): Loadout {
  return loadouts.find((item) => item.id === id) ?? loadouts[0];
}

export function startRun(loadouts: Loadout[], loadoutId: string, today: string, id: string): ActiveRun {
  const loadout = findLoadout(loadouts, loadoutId);
  return {
    id,
    loadoutId: loadout.id,
    legIndex: 0,
    resources: { ...loadout.resources },
    log: [],
    status: 'active',
    startedOn: today,
  };
}

export function resolveChoice(run: ActiveRun, choiceId: string, legs: Leg[]): ActiveRun {
  if (run.status !== 'active' || run.pending) return run;
  const leg = legs[run.legIndex];
  if (!leg) return run;
  const choice = leg.choices.find((item) => item.id === choiceId);
  if (!choice) return run;

  const before = { ...run.resources };
  const after = clampResources(applyDeltas(before, choice.deltas));
  return {
    ...run,
    resources: after,
    log: [
      ...run.log,
      {
        legId: leg.id,
        choiceId: choice.id,
        grade: choice.grade,
        lesson: choice.lesson,
        skillIds: leg.skillIds,
      },
    ],
    pending: {
      choiceId: choice.id,
      grade: choice.grade,
      lesson: choice.lesson,
      before,
      after,
      critical: criticalResource(after),
    },
  };
}

export function continueRun(run: ActiveRun, legCount: number): ActiveRun {
  if (run.status !== 'active' || !run.pending) return run;
  const critical = run.pending.critical;
  const cleared: ActiveRun = { ...run, pending: undefined };
  if (critical) {
    return { ...cleared, status: 'turned-back', endedBy: critical };
  }
  const nextIndex = run.legIndex + 1;
  if (nextIndex >= legCount) {
    return { ...cleared, status: 'complete', legIndex: nextIndex };
  }
  return { ...cleared, status: 'active', legIndex: nextIndex };
}

export function phaseOf(run: ActiveRun | null, legCount: number): Phase {
  if (!run) return 'setup';
  if (run.status !== 'active') return 'debrief';
  if (run.pending) return 'outcome';
  if (run.legIndex < 0 || run.legIndex >= legCount) return 'debrief';
  return 'play';
}

export function currentChoice(run: ActiveRun, legs: Leg[]): Choice | null {
  if (!run.pending) return null;
  const leg = legs.find((item) => item.id === run.log[run.log.length - 1]?.legId) ?? legs[run.legIndex];
  return leg?.choices.find((item) => item.id === run.pending?.choiceId) ?? null;
}

export interface RunScore {
  sound: number;
  costly: number;
  risky: number;
  xp: number;
  headline: string;
}

export function scoreRun(run: Pick<ActiveRun, 'log' | 'status'>): RunScore {
  const counts = { sound: 0, costly: 0, risky: 0 };
  for (const entry of run.log) counts[entry.grade] += 1;
  let xp = counts.sound * GRADE_XP.sound + counts.costly * GRADE_XP.costly + counts.risky * GRADE_XP.risky;
  if (run.status === 'complete') xp += COMPLETE_BONUS;
  if (run.status === 'turned-back') xp += TURNBACK_BONUS;
  return { ...counts, xp, headline: headlineFor(run.status, counts.sound, run.log.length) };
}

export function headlineFor(status: RunStatus, sound: number, decided: number): string {
  if (status === 'turned-back') return 'Turned back while you still could.';
  if (status !== 'complete') return 'Still on the mile.';
  if (decided > 0 && sound === decided) return 'Home with margin.';
  if (sound >= decided - 1) return 'Home. One call spent margin.';
  if (sound >= 2) return 'Home. Review the costly calls.';
  return 'You finished. The misses are the lesson.';
}

export function continueLabel(run: ActiveRun, legCount: number): string {
  if (!run.pending) return 'Continue';
  if (run.pending.critical || run.legIndex + 1 >= legCount) return 'Take the debrief';
  return 'Next leg';
}

export function gradeLabel(grade: Grade): string {
  if (grade === 'sound') return 'Sound call';
  if (grade === 'costly') return 'Costly call';
  return 'Risky call';
}

export interface CampaignIssue {
  legId?: string;
  message: string;
}

/** Content guard so a leg can't ship without a real decision. */
export function inspectLegs(legs: Leg[]): CampaignIssue[] {
  const issues: CampaignIssue[] = [];
  const ids = new Set<string>();
  if (legs.length < 2) issues.push({ message: 'Campaign needs more than one leg.' });
  for (const leg of legs) {
    if (ids.has(leg.id)) issues.push({ legId: leg.id, message: 'Duplicate leg id.' });
    ids.add(leg.id);
    if (leg.choices.length < 3) issues.push({ legId: leg.id, message: 'Leg needs three choices.' });
    const sound = leg.choices.filter((choice) => choice.grade === 'sound');
    if (sound.length !== 1) issues.push({ legId: leg.id, message: 'Leg needs exactly one sound choice.' });
    if (!leg.skillIds.length) issues.push({ legId: leg.id, message: 'Leg trains nothing.' });
    for (const choice of leg.choices) {
      if (choice.lesson.trim().length < 80) {
        issues.push({ legId: leg.id, message: `Lesson too thin: ${choice.id}` });
      }
      if (!choice.stake.trim() || !choice.title.trim()) {
        issues.push({ legId: leg.id, message: `Choice missing copy: ${choice.id}` });
      }
    }
  }
  return issues;
}
