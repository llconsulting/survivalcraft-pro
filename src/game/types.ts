export type Grade = 'sound' | 'costly' | 'risky';

export type ResourceKey = 'water' | 'warmth' | 'energy' | 'kit';

export type Resources = Record<ResourceKey, number>;

export interface Choice {
  id: string;
  title: string;
  /** What the player is trading, written before they commit. Not a grade spoiler. */
  stake: string;
  grade: Grade;
  deltas: Partial<Resources>;
  lesson: string;
}

export interface Leg {
  id: string;
  day: number;
  short: string;
  title: string;
  kicker: string;
  briefing: string;
  skillIds: string[];
  choices: Choice[];
}

export interface Loadout {
  id: string;
  name: string;
  summary: string;
  resources: Resources;
}

export interface PendingOutcome {
  choiceId: string;
  grade: Grade;
  lesson: string;
  before: Resources;
  after: Resources;
  critical: ResourceKey | null;
}

export interface RunLogEntry {
  legId: string;
  choiceId: string;
  grade: Grade;
  lesson: string;
  skillIds: string[];
}

export type RunStatus = 'active' | 'complete' | 'turned-back';

export interface ActiveRun {
  id: string;
  loadoutId: string;
  legIndex: number;
  resources: Resources;
  log: RunLogEntry[];
  pending?: PendingOutcome;
  status: RunStatus;
  endedBy?: ResourceKey;
  startedOn: string;
  settled?: boolean;
}

export interface FieldNote {
  id: string;
  text: string;
  createdOn: string;
}

export type UserTier = 'free' | 'pro' | 'elite';

export interface DailyOpDef {
  id: string;
  title: string;
  desc: string;
  legId: string;
  /** Free ops clear for every tier. Pro ops clear only on a Pro or Elite preview. */
  tier: 'free' | 'pro';
}

export type Phase = 'setup' | 'play' | 'outcome' | 'debrief';
