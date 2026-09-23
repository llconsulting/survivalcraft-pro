import type { ActiveRun, FieldNote, Grade, UserTier } from '../game/types';

export type { ActiveRun, FieldNote, Grade, UserTier };

export interface SkillPrinciple {
  id: string;
  text: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  tier: UserTier;
  icon: string;
  color: string;
  description: string;
  content: string;
  principles: SkillPrinciple[];
  legId?: string;
  advanced?: string;
  restricted?: boolean;
}

export interface IntelItem {
  time: string;
  type: 'alert' | 'info' | 'update' | 'intel';
  text: string;
  level: 'high' | 'medium' | 'low';
  source?: string;
}

export interface UserState {
  tier: UserTier;
  level: number;
  xp: number;
  streak: number;
  lastTrainingDate?: string;
  ageVerifiedElite: boolean;
  reviewed: Record<string, string[]>;
  bestGrades: Record<string, Grade>;
  legsCleared: string[];
  runsCompleted: number;
  turnbacks: number;
  bestSound: number;
  settledRunIds: string[];
  fieldNotes: FieldNote[];
  activeRun: ActiveRun | null;
}
