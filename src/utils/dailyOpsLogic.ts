import { dailyOps, isOpUnlocked, unlockedOpIds } from '../data/dailyOps';
import { UserState, UserTier } from '../types';

/** Today's open ops, streak, and finished skills. Capped at 100. */
export const READINESS_OPS_WEIGHT = 50;
export const READINESS_STREAK_WEIGHT = 30;
export const READINESS_STREAK_PER_DAY = 3;
export const READINESS_SKILLS_WEIGHT = 20;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const KNOWN_OPS = new Set(dailyOps.map((op) => op.id));
const TIERS = new Set<UserTier>(['free', 'pro', 'elite']);

/**
 * Day rules (local calendar, not UTC):
 * - Checks belong to dailyOpsDate. A different day clears them.
 * - A day counts when at least one unlocked op is checked.
 * - Counting today after yesterday counted adds 1 to the streak.
 * - Counting today after a gap, or for the first time, sets the streak to 1.
 * - Clearing every unlocked op the same day puts the streak back.
 * - If the last counted day is older than yesterday, the streak is 0.
 */
export function todayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_KEY.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayKey(dt);
}

export function msUntilNextLocalMidnight(now = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(1000, next.getTime() - now.getTime());
}

export function sanitizeCompleted(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const out: string[] = [];
  for (const id of ids) {
    if (typeof id === 'string' && KNOWN_OPS.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

export type DailyOpsFields = {
  streak: number;
  lastDailyOpDate?: string;
  dailyOpsDate: string;
  dailyOpsCompleted: string[];
  streakCarry: number;
  streakCarryFromDate?: string;
};

function cleanStreak(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}

function countsToday(completed: string[], unlockedIds: string[]): boolean {
  const open = new Set(unlockedIds);
  return completed.some((id) => open.has(id));
}

export function reconcileDailyOps(
  state: Partial<UserState>,
  today: string,
  unlockedIds: string[],
): DailyOpsFields {
  const yesterday = shiftDateKey(today, -1);
  let streak = cleanStreak(state.streak);
  let last = isDateKey(state.lastDailyOpDate) ? state.lastDailyOpDate : undefined;
  let streakCarry = cleanStreak(state.streakCarry);
  let streakCarryFromDate = isDateKey(state.streakCarryFromDate) ? state.streakCarryFromDate : undefined;
  let dailyOpsCompleted = sanitizeCompleted(state.dailyOpsCompleted);

  if (state.dailyOpsDate !== today) {
    dailyOpsCompleted = [];
  }

  if (countsToday(dailyOpsCompleted, unlockedIds)) {
    if (last !== today) {
      if (last === yesterday) {
        streakCarry = streak;
        streakCarryFromDate = yesterday;
        streak += 1;
      } else {
        streakCarry = 0;
        streakCarryFromDate = undefined;
        streak = 1;
      }
      last = today;
    }
  } else if (last === today) {
    streak = streakCarry;
    last = streakCarryFromDate;
  } else if (last === yesterday) {
    streakCarry = streak;
    streakCarryFromDate = yesterday;
  } else {
    // Missed yesterday (or never counted). The streak is over.
    streak = 0;
    last = undefined;
    streakCarry = 0;
    streakCarryFromDate = undefined;
  }

  return {
    streak,
    lastDailyOpDate: last,
    dailyOpsDate: today,
    dailyOpsCompleted,
    streakCarry,
    streakCarryFromDate,
  };
}

export function toggleDailyOpState(state: UserState, opId: string, today = todayKey()): UserState {
  const current = normalizeStoredUser(state, today);
  if (!isOpUnlocked(opId, current.tier)) return current;
  const done = current.dailyOpsCompleted ?? [];
  const completed = done.includes(opId) ? done.filter((id) => id !== opId) : [...done, opId];
  return {
    ...current,
    ...withDailyOpCompletions(current, completed, today, unlockedOpIds(current.tier)),
  };
}

export function withDailyOpCompletions(
  state: Partial<UserState>,
  completed: string[],
  today: string,
  unlockedIds: string[],
): DailyOpsFields {
  return reconcileDailyOps(
    {
      ...state,
      dailyOpsDate: today,
      dailyOpsCompleted: completed,
    },
    today,
    unlockedIds,
  );
}

export function computeReadiness(input: {
  completedUnlocked: number;
  unlockedCount: number;
  streak: number;
  skillsCompleted: number;
  skillsTotal: number;
}): { score: number; opsPoints: number; streakPoints: number; skillsPoints: number } {
  const opsRatio = input.unlockedCount > 0
    ? Math.min(1, Math.max(0, input.completedUnlocked) / input.unlockedCount)
    : 0;
  const skillsRatio = input.skillsTotal > 0
    ? Math.min(1, Math.max(0, input.skillsCompleted) / input.skillsTotal)
    : 0;
  const opsPoints = Math.round(opsRatio * READINESS_OPS_WEIGHT);
  const streakPoints = Math.min(
    READINESS_STREAK_WEIGHT,
    cleanStreak(input.streak) * READINESS_STREAK_PER_DAY,
  );
  const skillsPoints = Math.round(skillsRatio * READINESS_SKILLS_WEIGHT);
  const score = Math.min(100, opsPoints + streakPoints + skillsPoints);
  return { score, opsPoints, streakPoints, skillsPoints };
}

const DEFAULT_SKILLS = ['water'];

export function normalizeStoredUser(
  saved: Partial<UserState> | null | undefined,
  today = todayKey(),
): UserState {
  const tier = saved && TIERS.has(saved.tier as UserTier) ? (saved.tier as UserTier) : 'free';
  const skillsCompleted = Array.isArray(saved?.skillsCompleted)
    ? saved.skillsCompleted.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [...DEFAULT_SKILLS];
  const base: UserState = {
    tier,
    level: typeof saved?.level === 'number' && Number.isFinite(saved.level) && saved.level >= 1
      ? Math.floor(saved.level)
      : 1,
    xp: typeof saved?.xp === 'number' && Number.isFinite(saved.xp) && saved.xp >= 0
      ? Math.floor(saved.xp)
      : 0,
    streak: cleanStreak(saved?.streak),
    skillsCompleted,
    lastDailyOpDate: isDateKey(saved?.lastDailyOpDate) ? saved.lastDailyOpDate : undefined,
    ageVerifiedElite: !!saved?.ageVerifiedElite,
    dailyOpsDate: isDateKey(saved?.dailyOpsDate) ? saved.dailyOpsDate : undefined,
    dailyOpsCompleted: sanitizeCompleted(saved?.dailyOpsCompleted),
    streakCarry: cleanStreak(saved?.streakCarry),
    streakCarryFromDate: isDateKey(saved?.streakCarryFromDate) ? saved.streakCarryFromDate : undefined,
  };
  return { ...base, ...reconcileDailyOps(base, today, unlockedOpIds(tier)) };
}
