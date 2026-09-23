export type UserTier = 'free' | 'pro' | 'elite';

export interface UserState {
  tier: UserTier;
  level: number;
  xp: number;
  streak: number;
  skillsCompleted: string[];
  /** Last local calendar day (YYYY-MM-DD) that counted toward the streak. */
  lastDailyOpDate?: string;
  ageVerifiedElite?: boolean;
  /** Local calendar day the checklist below belongs to. */
  dailyOpsDate?: string;
  /** Op ids checked on dailyOpsDate. */
  dailyOpsCompleted?: string[];
  /** Streak to restore if today stops counting. */
  streakCarry?: number;
  /** lastDailyOpDate to restore if today stops counting. */
  streakCarryFromDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  tier: UserTier;
  progress: number;
  icon: string;
  color: string;
  description: string;
  content: string;
  advanced?: string;
  restricted?: boolean;
}

export interface DailyOp {
  id: string;
  title: string;
  desc: string;
  proOnly: boolean;
}

export interface IntelItem {
  time: string;
  type: 'alert' | 'info' | 'update' | 'intel';
  text: string;
  level: 'high' | 'medium' | 'low';
  source?: string;
}
