export type UserTier = 'free' | 'pro' | 'elite';

export interface UserState {
  tier: UserTier;
  level: number;
  xp: number;
  streak: number;
  skillsCompleted: string[];
  lastDailyOpDate?: string; // YYYY-MM-DD for streak logic
  ageVerifiedElite?: boolean;
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
  id: number;
  title: string;
  desc: string;
  completed: boolean;
  icon: string;
  color: string;
  locked?: boolean;
}

export interface IntelItem {
  time: string;
  type: 'alert' | 'info' | 'update' | 'intel';
  text: string;
  level: 'high' | 'medium' | 'low';
  source?: string;
}
