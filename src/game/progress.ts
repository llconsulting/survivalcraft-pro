import { scoreRun } from './engine';
import {
  ActiveRun,
  DailyOpDef,
  FieldNote,
  Grade,
  UserTier,
} from './types';

export interface SkillRef {
  id: string;
  tier: UserTier;
  principleCount: number;
  legId?: string;
}

export interface ProgressState {
  xp: number;
  level: number;
  streak: number;
  lastTrainingDate?: string;
  reviewed: Record<string, string[]>;
  bestGrades: Record<string, Grade>;
  legsCleared: string[];
  runsCompleted: number;
  turnbacks: number;
  bestSound: number;
  settledRunIds: string[];
}

export interface ReadinessInput {
  tier: UserTier;
  eliteUnlocked: boolean;
  streak: number;
  legsCleared: string[];
  reviewed: Record<string, string[]>;
  bestGrades: Record<string, Grade>;
  skills: SkillRef[];
  ops: DailyOpDef[];
  legCount: number;
}

export function localDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function previousDateISO(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() - 1);
  return localDateISO(dt);
}

export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / 400) + 1;
}

export function nextStreak(
  streak: number,
  last: string | undefined,
  today: string,
): { streak: number; lastTrainingDate: string } {
  if (last === today) return { streak: Math.max(0, streak), lastTrainingDate: today };
  if (last && last === previousDateISO(today)) {
    return { streak: Math.max(0, streak) + 1, lastTrainingDate: today };
  }
  return { streak: 1, lastTrainingDate: today };
}

const GRADE_RANK: Record<Grade, number> = { risky: 1, costly: 2, sound: 3 };

export function betterGrade(current: Grade | undefined, next: Grade): Grade {
  if (!current || GRADE_RANK[next] > GRADE_RANK[current]) return next;
  return current;
}

export function tierAllows(userTier: UserTier, required: UserTier, eliteUnlocked: boolean): boolean {
  if (required === 'free') return true;
  if (required === 'pro') return userTier === 'pro' || userTier === 'elite';
  return userTier === 'elite' && eliteUnlocked;
}

/** Reading tops out at 70. A sound scenario drill is what fills the bar. */
export function progressForSkill(principleCount: number, reviewedCount: number, best?: Grade): number {
  const cappedReview = Math.max(0, Math.min(reviewedCount, Math.max(principleCount, 0)));
  const reading = principleCount <= 0 ? 0 : Math.round((cappedReview / principleCount) * 70);
  const played = best === 'sound' ? 100 : best === 'costly' ? 55 : best === 'risky' ? 30 : 0;
  return Math.min(100, Math.max(reading, played));
}

export function skillStatusLabel(progress: number, hasLeg: boolean): string {
  if (progress >= 100) return 'Drilled';
  if (!hasLeg && progress >= 70) return 'Read';
  if (progress <= 0) return 'Not started';
  return 'In progress';
}

export function toggleReviewed(
  reviewed: Record<string, string[]>,
  skillId: string,
  principleId: string,
  allowedIds: string[],
): Record<string, string[]> {
  if (!allowedIds.includes(principleId)) return reviewed;
  const current = reviewed[skillId] ?? [];
  const next = current.includes(principleId)
    ? current.filter((id) => id !== principleId)
    : [...current, principleId];
  return { ...reviewed, [skillId]: next };
}

export function skillProgressValue(skill: SkillRef, input: Pick<ReadinessInput, 'reviewed' | 'bestGrades'>): number {
  const reviewedCount = input.reviewed[skill.id]?.length ?? 0;
  const grade = skill.legId ? input.bestGrades[skill.legId] : undefined;
  return progressForSkill(skill.principleCount, reviewedCount, grade);
}

export type OpStatus = 'cleared' | 'open' | 'locked';

export function opStatus(op: DailyOpDef, legsCleared: string[], tier: UserTier): OpStatus {
  const allowed = op.tier === 'free' || tier === 'pro' || tier === 'elite';
  if (!allowed) return 'locked';
  return legsCleared.includes(op.legId) ? 'cleared' : 'open';
}

export function computeReadiness(input: ReadinessInput): number {
  const legCount = Math.max(1, input.legCount);
  const cleared = Math.min(new Set(input.legsCleared).size, legCount);
  const legPoints = (cleared / legCount) * 36;

  const unlockedOps = input.ops.filter((op) => op.tier === 'free' || input.tier !== 'free');
  const doneOps = unlockedOps.filter((op) => input.legsCleared.includes(op.legId));
  const opPoints = unlockedOps.length === 0 ? 0 : (doneOps.length / unlockedOps.length) * 24;

  const trainable = input.skills.filter(
    (skill) => !!skill.legId && tierAllows(input.tier, skill.tier, input.eliteUnlocked),
  );
  const trainedAvg = trainable.length
    ? trainable.reduce((sum, skill) => sum + skillProgressValue(skill, input), 0) / trainable.length
    : 0;
  const trainedPoints = (trainedAvg / 100) * 22;

  const reading = input.skills.filter(
    (skill) => !skill.legId && tierAllows(input.tier, skill.tier, input.eliteUnlocked),
  );
  const readingSum = reading.reduce((sum, skill) => sum + skillProgressValue(skill, input), 0);
  const readingPoints = Math.min(8, (readingSum / 140) * 8);

  const streakPoints = (Math.min(10, Math.max(0, input.streak)) / 10) * 10;
  const total = legPoints + opPoints + trainedPoints + readingPoints + streakPoints;
  return Math.max(0, Math.min(100, Math.round(total)));
}

export function emptyProgress(): ProgressState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    reviewed: {},
    bestGrades: {},
    legsCleared: [],
    runsCompleted: 0,
    turnbacks: 0,
    bestSound: 0,
    settledRunIds: [],
  };
}

export function applySettlement(state: ProgressState, run: ActiveRun, today: string): ProgressState {
  if (run.settled || run.status === 'active') return state;
  if (state.settledRunIds.includes(run.id)) return state;

  const score = scoreRun(run);
  const bestGrades = { ...state.bestGrades };
  const cleared = new Set(state.legsCleared);
  for (const entry of run.log) {
    bestGrades[entry.legId] = betterGrade(bestGrades[entry.legId], entry.grade);
    cleared.add(entry.legId);
  }
  const xp = state.xp + score.xp;
  const streak = nextStreak(state.streak, state.lastTrainingDate, today);
  return {
    ...state,
    xp,
    level: levelForXp(xp),
    streak: streak.streak,
    lastTrainingDate: streak.lastTrainingDate,
    bestGrades,
    legsCleared: [...cleared],
    runsCompleted: state.runsCompleted + (run.status === 'complete' ? 1 : 0),
    turnbacks: state.turnbacks + (run.status === 'turned-back' ? 1 : 0),
    bestSound: Math.max(state.bestSound, score.sound),
    settledRunIds: [...state.settledRunIds, run.id].slice(-30),
  };
}

export function appendNote(notes: FieldNote[], note: FieldNote): FieldNote[] {
  const text = note.text.trim().slice(0, 280);
  if (!text) return notes;
  return [{ ...note, text }, ...notes].slice(0, 12);
}
