import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CAMPAIGN_LEGS } from './campaign';
import { skillsData } from '../data/skills';

test('every module has a short field card and no fake credential', () => {
  const legIds = new Set(CAMPAIGN_LEGS.map((leg) => leg.id));
  const seen = new Set<string>();
  for (const skill of skillsData) {
    assert.equal(seen.has(skill.id), false);
    seen.add(skill.id);
    assert.ok(skill.principles.length >= 3, skill.id);
    assert.ok(skill.content.length > 40, skill.id);
    const principleIds = new Set(skill.principles.map((item) => item.id));
    assert.equal(principleIds.size, skill.principles.length);
    if (skill.legId) assert.ok(legIds.has(skill.legId), skill.id);
    const blob = `${skill.content} ${skill.advanced ?? ''} ${skill.principles.map((item) => item.text).join(' ')}`.toLowerCase();
    assert.equal(blob.includes('you are certified'), false, skill.id);
    assert.equal(blob.includes('guaranteed to survive'), false, skill.id);
  }
  for (const id of ['water', 'fire', 'shelter', 'loadout']) {
    assert.ok(skillsData.some((skill) => skill.id === id && skill.tier === 'free'));
  }
  assert.equal(skillsData.find((skill) => skill.id === 'medical')?.tier, 'pro');
  assert.equal(skillsData.find((skill) => skill.id === 'chemistry')?.restricted, true);
});
