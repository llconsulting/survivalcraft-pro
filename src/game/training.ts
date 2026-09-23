import { tierAllows } from './progress';
import { UserTier } from './types';

export type TrainingStart =
  | { kind: 'mile'; legId: string }
  | { kind: 'read' }
  | { kind: 'locked'; tier: UserTier; legId?: string };

/**
 * What Start training is allowed to do.
 * A locked card with a scenario leg still opens that leg — the decision is the
 * training. A locked card with no leg does not pretend to start.
 */
export function trainingStart(
  skill: { legId?: string; tier: UserTier },
  userTier: UserTier,
  eliteUnlocked: boolean,
): TrainingStart {
  if (!tierAllows(userTier, skill.tier, eliteUnlocked)) {
    return skill.legId
      ? { kind: 'locked', tier: skill.tier, legId: skill.legId }
      : { kind: 'locked', tier: skill.tier };
  }
  if (skill.legId) return { kind: 'mile', legId: skill.legId };
  return { kind: 'read' };
}
