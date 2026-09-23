import assert from 'node:assert/strict';
import test from 'node:test';
import { trainingStart } from './training';

test('a free field card with a leg starts that leg of the mile', () => {
  assert.deepEqual(
    trainingStart({ legId: 'water', tier: 'free' }, 'free', false),
    { kind: 'mile', legId: 'water' },
  );
});

test('a free card with no leg is a reading drill', () => {
  assert.deepEqual(trainingStart({ tier: 'free' }, 'free', false), { kind: 'read' });
});

test('medical stays locked for free and still names the care leg', () => {
  assert.deepEqual(
    trainingStart({ legId: 'cut', tier: 'pro' }, 'free', false),
    { kind: 'locked', tier: 'pro', legId: 'cut' },
  );
});

test('a pro preview opens the medical leg', () => {
  assert.deepEqual(
    trainingStart({ legId: 'cut', tier: 'pro' }, 'pro', false),
    { kind: 'mile', legId: 'cut' },
  );
});

test('elite without the age check stays locked', () => {
  assert.deepEqual(
    trainingStart({ tier: 'elite' }, 'elite', false),
    { kind: 'locked', tier: 'elite' },
  );
});

test('elite with the age check can read the card', () => {
  assert.deepEqual(
    trainingStart({ tier: 'elite' }, 'elite', true),
    { kind: 'read' },
  );
});
