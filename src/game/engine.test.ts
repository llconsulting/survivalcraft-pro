import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CAMPAIGN_LEGS, LOADOUTS } from './campaign';
import {
  continueLabel,
  continueRun,
  criticalResource,
  inspectLegs,
  phaseOf,
  resolveChoice,
  scoreRun,
  startRun,
} from './engine';
import { Leg } from './types';

const legs = CAMPAIGN_LEGS;

function play(loadoutId: string, choiceIds: string[]) {
  let run = startRun(LOADOUTS, loadoutId, '2026-04-02', 'run-test');
  for (const choiceId of choiceIds) {
    run = resolveChoice(run, choiceId, legs);
    run = continueRun(run, legs.length);
    if (run.status !== 'active') break;
  }
  return run;
}

test('campaign legs each force one sound call and a real lesson', () => {
  assert.deepEqual(inspectLegs(legs), []);
});

test('a sound mile on the balanced loadout finishes with margin', () => {
  const run = play('balanced', ['tap', 'car', 'priority', 'pressure']);
  assert.equal(run.status, 'complete');
  assert.equal(run.log.length, 4);
  assert.ok(run.resources.water > 0);
  assert.ok(run.resources.warmth > 0);
  assert.ok(run.resources.energy > 0);
  const score = scoreRun(run);
  assert.equal(score.sound, 4);
  assert.equal(score.xp, 560);
  assert.equal(score.headline, 'Home with margin.');
});

test('one risky call does not end a balanced run', () => {
  let run = startRun(LOADOUTS, 'balanced', '2026-04-02', 'run-one');
  run = resolveChoice(run, 'store', legs);
  assert.equal(run.pending?.critical, null);
  assert.equal(run.status, 'active');
  run = continueRun(run, legs.length);
  assert.equal(run.status, 'active');
  assert.equal(run.legIndex, 1);
});

test('stacked bad calls on a heavy pack turn the party back', () => {
  const run = play('heavy', ['store', 'leanto', 'tote']);
  assert.equal(run.status, 'turned-back');
  assert.equal(run.endedBy, 'energy');
  assert.equal(run.log.length, 3);
  const score = scoreRun(run);
  assert.equal(score.xp, 30 + 60 + 60 + 40);
  assert.equal(score.headline, 'Turned back while you still could.');
});

test('resolve waits on the lesson until continue', () => {
  let run = startRun(LOADOUTS, 'light', '2026-04-02', 'run-wait');
  run = resolveChoice(run, 'tap', legs);
  assert.equal(phaseOf(run, legs.length), 'outcome');
  assert.equal(continueLabel(run, legs.length), 'Next leg');
  assert.equal(run.legIndex, 0);
  const stuck = resolveChoice(run, 'ditch', legs);
  assert.equal(stuck, run);
  run = continueRun(run, legs.length);
  assert.equal(phaseOf(run, legs.length), 'play');
  assert.equal(run.legIndex, 1);
});

test('unknown choices and empty continues do not move the run', () => {
  const run = startRun(LOADOUTS, 'missing-loadout', '2026-04-02', 'run-x');
  assert.equal(run.loadoutId, 'light');
  const ignored = resolveChoice(run, 'nope', legs);
  assert.equal(ignored, run);
  assert.equal(continueRun(run, legs.length), run);
});

test('kit can hit zero without ending the mile', () => {
  const custom: Leg[] = [
    {
      id: 'only',
      day: 1,
      short: 'Kit',
      title: 'Kit',
      kicker: 'Test',
      skillIds: ['loadout'],
      briefing: 'Test leg for the kit rule. It is long enough to be a briefing.',
      choices: [
        {
          id: 'drop',
          title: 'Drop the kit',
          stake: 'Spend every spare.',
          grade: 'costly',
          deltas: { kit: -100 },
          lesson: 'A'.repeat(80),
        },
      ],
    },
  ];
  let run = startRun(LOADOUTS, 'balanced', '2026-04-02', 'kit');
  run = resolveChoice(run, 'drop', custom);
  assert.equal(run.resources.kit, 0);
  assert.equal(criticalResource(run.resources), null);
  run = continueRun(run, 1);
  assert.equal(run.status, 'complete');
});

test('water at zero is the critical resource, ahead of the others', () => {
  assert.equal(criticalResource({ water: 0, warmth: 0, energy: 10, kit: 10 }), 'water');
  assert.equal(criticalResource({ water: 5, warmth: 0, energy: 0, kit: 0 }), 'warmth');
});
