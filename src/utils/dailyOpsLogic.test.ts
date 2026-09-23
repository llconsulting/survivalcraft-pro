import { unlockedOpIds } from '../data/dailyOps';
import { skillsData } from '../data/skills';
import { UserState } from '../types';
import {
  computeReadiness,
  msUntilNextLocalMidnight,
  normalizeStoredUser,
  shiftDateKey,
  toggleDailyOpState,
} from './dailyOpsLogic';

const TODAY = '2026-09-23';
const YESTERDAY = '2026-09-22';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${message}\n  actual: ${a}\n  expected: ${b}`);
}

/** Kill and relaunch: the only thing that survives is what was written to storage. */
function relaunch(state: UserState, today: string): UserState {
  const stored = JSON.parse(JSON.stringify(state)) as UserState;
  return normalizeStoredUser(stored, today);
}

function fresh(today = TODAY): UserState {
  return normalizeStoredUser(null, today);
}

const open = unlockedOpIds('free');
const proOpen = unlockedOpIds('pro');

// Existing installs have no checklist fields. They do not inherit the old on-screen checks.
const legacy = normalizeStoredUser({
  tier: 'free',
  level: 2,
  xp: 40,
  streak: 6,
  skillsCompleted: ['water'],
  ageVerifiedElite: false,
}, TODAY);
equal(legacy.dailyOpsCompleted, [], 'legacy checklist starts empty');
equal(legacy.streak, 0, 'a streak with no counted day does not carry');
equal(legacy.level, 2, 'level is kept');
equal(legacy.xp, 40, 'xp is kept');
equal(legacy.skillsCompleted, ['water'], 'finished skills are kept');

// Same-day persistence.
let day = toggleDailyOpState(fresh(), 'water', TODAY);
equal(day.dailyOpsCompleted, ['water'], 'water stays checked');
equal(day.streak, 1, 'first counted day starts the streak at 1');
equal(day.lastDailyOpDate, TODAY, 'today is the counted day');

day = toggleDailyOpState(day, 'fire', TODAY);
equal(day.dailyOpsCompleted, ['water', 'fire'], 'second op is kept');
equal(day.streak, 1, 'a second op the same day does not add another streak day');

const afterKill = relaunch(day, TODAY);
equal(afterKill.dailyOpsCompleted, ['water', 'fire'], 'checks survive a relaunch on the same day');
equal(afterKill.streak, 1, 'streak survives a relaunch on the same day');
equal(relaunch(afterKill, TODAY), afterKill, 'a second relaunch is stable');

// Unchecking the last open op puts today back.
const oneLeft = toggleDailyOpState(day, 'water', TODAY);
equal(oneLeft.streak, 1, 'streak holds while one open op is still checked');
const cleared = toggleDailyOpState(oneLeft, 'fire', TODAY);
equal(cleared.dailyOpsCompleted, [], 'clearing the list removes the checks');
equal(cleared.streak, 0, 'clearing every open op removes today from the streak');
equal(cleared.lastDailyOpDate, undefined, 'today is no longer a counted day');

// The next calendar day starts the list over and keeps a live streak.
const lived = toggleDailyOpState(fresh(YESTERDAY), 'shelter', YESTERDAY);
equal(lived.streak, 1, 'yesterday counted');
const rolled = relaunch(lived, TODAY);
equal(rolled.dailyOpsCompleted, [], 'a new day clears yesterday’s checks');
equal(rolled.streak, 1, 'the streak stays alive on the next day');
equal(rolled.lastDailyOpDate, YESTERDAY, 'yesterday is still the last counted day');

const continued = toggleDailyOpState(rolled, 'water', TODAY);
equal(continued.streak, 2, 'checking an op the next day extends the streak');
equal(continued.dailyOpsCompleted, ['water'], 'only today’s check is stored');

const undone = toggleDailyOpState(continued, 'water', TODAY);
equal(undone.streak, 1, 'clearing today restores yesterday’s streak');
equal(undone.lastDailyOpDate, YESTERDAY, 'the counted day reverts to yesterday');

// Missing a day ends the streak. Yesterday’s checks do not come back.
const missed = relaunch(lived, '2026-09-24');
equal(missed.streak, 0, 'skipping a day resets the streak to 0');
equal(missed.dailyOpsCompleted, [], 'the missed day does not keep old checks');
equal(missed.lastDailyOpDate, undefined, 'the counted-day stamp clears with the streak');
const restart = toggleDailyOpState(missed, 'fire', '2026-09-24');
equal(restart.streak, 1, 'the next counted day starts again at 1');

// Locked medical work does not count on the free tier, and it does not get toggled.
const blocked = toggleDailyOpState(fresh(), 'medical', TODAY);
equal(blocked.dailyOpsCompleted, [], 'free tier cannot check medical');
equal(blocked.streak, 0, 'a locked op does not count');

let pro = normalizeStoredUser({ tier: 'pro', skillsCompleted: [] }, TODAY);
pro = toggleDailyOpState(pro, 'medical', TODAY);
equal(pro.dailyOpsCompleted, ['medical'], 'pro can check medical');
equal(pro.streak, 1, 'medical counts once it is unlocked');

const downgraded = normalizeStoredUser({ ...pro, tier: 'free' }, TODAY);
equal(downgraded.streak, 0, 'today stops counting if the only check becomes locked');
equal(downgraded.dailyOpsCompleted, ['medical'], 'the saved check is kept for a later upgrade');
const reupgraded = normalizeStoredUser({ ...downgraded, tier: 'pro' }, TODAY);
equal(reupgraded.streak, 1, 'unlocking the same day counts the saved check');

// Junk from older or damaged storage is ignored.
const dirty = normalizeStoredUser({
  tier: 'nope' as UserState['tier'],
  streak: -4,
  skillsCompleted: ['water', '', 3 as unknown as string],
  dailyOpsDate: '2026-02-31',
  dailyOpsCompleted: ['water', 'nuke', 'water'],
  lastDailyOpDate: 'yesterday',
}, TODAY);
equal(dirty.tier, 'free', 'unknown tier falls back to free');
equal(dirty.skillsCompleted, ['water'], 'skill ids stay strings');
equal(dirty.dailyOpsCompleted, [], 'a bad checklist date does not keep checks');
equal(dirty.streak, 0, 'a bad counted day does not keep a streak');

equal(shiftDateKey('2026-03-01', -1), '2026-02-28', 'date math crosses month boundaries');
equal(shiftDateKey('2026-01-01', -1), '2025-12-31', 'date math crosses year boundaries');

const untilMidnight = msUntilNextLocalMidnight(new Date(2026, 8, 23, 23, 0, 0));
assert(untilMidnight === 60 * 60 * 1000, 'midnight timer uses the local calendar');

const skillsTotal = skillsData.length;
equal(
  computeReadiness({ completedUnlocked: 0, unlockedCount: open.length, streak: 0, skillsCompleted: 1, skillsTotal }),
  { score: 2, opsPoints: 0, streakPoints: 0, skillsPoints: 2 },
  'fresh profile is only the seeded water skill',
);
equal(
  computeReadiness({ completedUnlocked: 1, unlockedCount: open.length, streak: 1, skillsCompleted: 1, skillsTotal }),
  { score: 22, opsPoints: 17, streakPoints: 3, skillsPoints: 2 },
  'one open op and a one-day streak move the score',
);
equal(
  computeReadiness({ completedUnlocked: 3, unlockedCount: 3, streak: 1, skillsCompleted: 1, skillsTotal }),
  { score: 55, opsPoints: 50, streakPoints: 3, skillsPoints: 2 },
  'all open ops are half the score',
);
equal(
  computeReadiness({ completedUnlocked: 4, unlockedCount: proOpen.length, streak: 11, skillsCompleted: skillsTotal, skillsTotal }),
  { score: 100, opsPoints: 50, streakPoints: 30, skillsPoints: 20 },
  'the three parts cap at 100',
);

console.log('daily ops loop ok');
