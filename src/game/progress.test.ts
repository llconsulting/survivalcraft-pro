import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CAMPAIGN_LEGS, DAILY_OPS, LOADOUTS } from './campaign';
import { continueRun, resolveChoice, startRun } from './engine';
import { skillsData } from '../data/skills';
import {
  appendNote,
  applySettlement,
  betterGrade,
  computeReadiness,
  emptyProgress,
  levelForXp,
  nextStreak,
  opStatus,
  previousDateISO,
  progressForSkill,
  skillProgressValue,
  skillStatusLabel,
  toggleReviewed,
  type ReadinessInput,
  type SkillRef,
} from './progress';

const skillRefs: SkillRef[] = skillsData.map((skill) => ({
  id: skill.id,
  tier: skill.tier,
  principleCount: skill.principles.length,
  legId: skill.legId,
}));

function readiness(partial: Partial<ReadinessInput> = {}): number {
  return computeReadiness({
    tier: 'free',
    eliteUnlocked: false,
    streak: 0,
    legsCleared: [],
    reviewed: {},
    bestGrades: {},
    skills: skillRefs,
    ops: DAILY_OPS,
    legCount: CAMPAIGN_LEGS.length,
    ...partial,
  });
}

function soundRun() {
  let run = startRun(LOADOUTS, 'balanced', '2026-04-02', 'mile-1');
  for (const leg of CAMPAIGN_LEGS) {
    const choice = leg.choices.find((item) => item.grade === 'sound');
    if (!choice) throw new Error(`missing sound on ${leg.id}`);
    run = resolveChoice(run, choice.id, CAMPAIGN_LEGS);
    run = continueRun(run, CAMPAIGN_LEGS.length);
  }
  return run;
}

test('dates step across month boundaries and streaks only grow on consecutive days', () => {
  assert.equal(previousDateISO('2026-03-01'), '2026-02-28');
  assert.deepEqual(nextStreak(4, '2026-04-02', '2026-04-02'), { streak: 4, lastTrainingDate: '2026-04-02' });
  assert.deepEqual(nextStreak(4, '2026-04-02', '2026-04-03'), { streak: 5, lastTrainingDate: '2026-04-03' });
  assert.deepEqual(nextStreak(4, '2026-04-01', '2026-04-03'), { streak: 1, lastTrainingDate: '2026-04-03' });
  assert.deepEqual(nextStreak(0, undefined, '2026-04-03'), { streak: 1, lastTrainingDate: '2026-04-03' });
});

test('reading caps at 70 and a worse replay does not erase a sound drill', () => {
  assert.equal(progressForSkill(3, 3), 70);
  assert.equal(progressForSkill(3, 1), 23);
  assert.equal(progressForSkill(3, 3, 'sound'), 100);
  assert.equal(progressForSkill(3, 0, 'risky'), 30);
  assert.equal(progressForSkill(3, 0, 'costly'), 55);
  assert.equal(betterGrade('sound', 'risky'), 'sound');
  assert.equal(betterGrade('risky', 'costly'), 'costly');
  assert.equal(skillStatusLabel(0, true), 'Not started');
  assert.equal(skillStatusLabel(100, true), 'Drilled');
  assert.equal(skillStatusLabel(70, false), 'Read');
});

test('unknown principle ids are ignored', () => {
  const once = toggleReviewed({}, 'water', 'trust-tap', ['trust-tap', 'boil-limits']);
  assert.deepEqual(once.water, ['trust-tap']);
  const twice = toggleReviewed(once, 'water', 'trust-tap', ['trust-tap', 'boil-limits']);
  assert.deepEqual(twice.water, []);
  const junk = toggleReviewed(once, 'water', 'nope', ['trust-tap']);
  assert.deepEqual(junk, once);
});

test('a new log is not ready, and a sound mile moves readiness without punishing free players', () => {
  assert.equal(readiness(), 0);
  const run = soundRun();
  const settled = applySettlement(emptyProgress(), run, '2026-04-02');
  assert.equal(settled.xp, 560);
  assert.equal(settled.level, levelForXp(560));
  assert.equal(settled.level, 2);
  assert.equal(settled.streak, 1);
  assert.equal(settled.runsCompleted, 1);
  assert.equal(settled.bestSound, 4);
  assert.deepEqual(settled.legsCleared.sort(), ['carry', 'cut', 'night', 'water']);

  const freeScore = readiness({
    legsCleared: settled.legsCleared,
    bestGrades: settled.bestGrades,
    streak: settled.streak,
    tier: 'free',
  });
  const withMedicalCountedAgainst = readiness({
    legsCleared: ['water', 'night', 'carry'],
    bestGrades: { water: 'sound', night: 'sound', carry: 'sound' },
    streak: 1,
    tier: 'free',
  });
  assert.ok(freeScore > withMedicalCountedAgainst);
  assert.ok(freeScore > 70 && freeScore < 100);
  assert.equal(opStatus(DAILY_OPS[3], settled.legsCleared, 'free'), 'locked');
  assert.equal(opStatus(DAILY_OPS[0], settled.legsCleared, 'free'), 'cleared');
  assert.equal(opStatus(DAILY_OPS[3], settled.legsCleared, 'pro'), 'cleared');

  const proScore = readiness({
    legsCleared: settled.legsCleared,
    bestGrades: settled.bestGrades,
    streak: settled.streak,
    tier: 'pro',
  });
  assert.ok(proScore >= freeScore);
  assert.ok(proScore <= 100);
});

test('settlement is idempotent and a later day extends the streak', () => {
  const run = soundRun();
  const once = applySettlement(emptyProgress(), run, '2026-04-02');
  const again = applySettlement(once, { ...run, settled: true }, '2026-04-02');
  assert.equal(again.xp, once.xp);
  const replay = { ...run, id: 'mile-2', settled: false };
  const nextDay = applySettlement(once, replay, '2026-04-03');
  assert.equal(nextDay.streak, 2);
  assert.equal(nextDay.xp, once.xp + 560);
  assert.equal(nextDay.runsCompleted, 2);
  const sameDay = applySettlement(once, replay, '2026-04-02');
  assert.equal(sameDay.streak, 1);
});

test('a turned-back mile still pays partial xp and does not count as finished', () => {
  let run = startRun(LOADOUTS, 'heavy', '2026-04-04', 'bail');
  run = resolveChoice(run, 'store', CAMPAIGN_LEGS);
  run = continueRun(run, CAMPAIGN_LEGS.length);
  run = resolveChoice(run, 'leanto', CAMPAIGN_LEGS);
  run = continueRun(run, CAMPAIGN_LEGS.length);
  run = resolveChoice(run, 'tote', CAMPAIGN_LEGS);
  run = continueRun(run, CAMPAIGN_LEGS.length);
  const settled = applySettlement(emptyProgress(), run, '2026-04-04');
  assert.equal(run.status, 'turned-back');
  assert.equal(settled.turnbacks, 1);
  assert.equal(settled.runsCompleted, 0);
  assert.equal(settled.xp, 190);
  assert.equal(settled.streak, 1);
  assert.ok(settled.legsCleared.includes('water'));
  assert.ok(!settled.legsCleared.includes('cut'));
});

test('field notes do not invent progress and blank notes are dropped', () => {
  const notes = appendNote([], { id: 'n1', text: '  spare wool in the trunk  ', createdOn: '2026-04-02' });
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, 'spare wool in the trunk');
  assert.equal(appendNote(notes, { id: 'n2', text: '   ', createdOn: '2026-04-02' }).length, 1);
  const many = Array.from({ length: 20 }, (_, i) => ({ id: `n${i}`, text: `note ${i}`, createdOn: '2026-04-02' }));
  const capped = many.reduce((list, note) => appendNote(list, note), notes);
  assert.equal(capped.length, 12);
  assert.equal(capped[0].id, 'n19');
  const water = skillRefs.find((skill) => skill.id === 'water');
  assert.ok(water);
  assert.equal(skillProgressValue(water, { reviewed: {}, bestGrades: {} }), 0);
});

test('medical skill progress stays dark on the free flag even after the care leg', () => {
  const run = soundRun();
  const settled = applySettlement(emptyProgress(), run, '2026-04-02');
  const medical = skillRefs.find((skill) => skill.id === 'medical');
  assert.ok(medical);
  assert.equal(skillProgressValue(medical, settled), 100);
  const free = readiness({
    tier: 'free',
    legsCleared: settled.legsCleared,
    bestGrades: settled.bestGrades,
    streak: 1,
  });
  const freeWithoutMedicalGrade = readiness({
    tier: 'free',
    legsCleared: settled.legsCleared,
    bestGrades: { ...settled.bestGrades, cut: 'risky' },
    streak: 1,
  });
  assert.equal(free, freeWithoutMedicalGrade);
});
