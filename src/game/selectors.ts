import { skillsData } from '../data/skills';
import { UserState } from '../types';
import { CAMPAIGN_LEGS, DAILY_OPS } from './campaign';
import { computeReadiness, skillProgressValue, type SkillRef } from './progress';

export function skillRefs(): SkillRef[] {
  return skillsData.map((skill) => ({
    id: skill.id,
    tier: skill.tier,
    principleCount: skill.principles.length,
    legId: skill.legId,
  }));
}

export function readinessFor(
  state: Pick<UserState, 'tier' | 'ageVerifiedElite' | 'streak' | 'legsCleared' | 'reviewed' | 'bestGrades'>,
): number {
  return computeReadiness({
    tier: state.tier,
    eliteUnlocked: !!state.ageVerifiedElite,
    streak: state.streak,
    legsCleared: state.legsCleared,
    reviewed: state.reviewed,
    bestGrades: state.bestGrades,
    skills: skillRefs(),
    ops: DAILY_OPS,
    legCount: CAMPAIGN_LEGS.length,
  });
}

export function progressFor(skillId: string, state: Pick<UserState, 'reviewed' | 'bestGrades'>): number {
  const skill = skillRefs().find((item) => item.id === skillId);
  if (!skill) return 0;
  return skillProgressValue(skill, state);
}
