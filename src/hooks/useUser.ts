import { create } from 'zustand';
import { CAMPAIGN_LEGS, LOADOUTS } from '../game/campaign';
import { continueRun as continueRunEngine, resolveChoice as resolveChoiceEngine, startRun as startRunEngine } from '../game/engine';
import {
  appendNote,
  applySettlement,
  emptyProgress,
  localDateISO,
  toggleReviewed,
  type ProgressState,
} from '../game/progress';
import { skillsData } from '../data/skills';
import { ActiveRun, UserState, UserTier } from '../types';
import { getJSON, setJSON } from '../utils/storage';

const STORAGE_KEY = 'sc_user_v2';

interface UserStore extends UserState {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTier: (tier: UserTier) => void;
  verifyEliteAge: () => void;
  reset: () => Promise<void>;
  startRun: (loadoutId: string) => void;
  resolveChoice: (choiceId: string) => void;
  continueRun: () => void;
  dismissRun: () => void;
  leaveRun: () => void;
  togglePrinciple: (skillId: string, principleId: string) => void;
  addFieldNote: (text: string) => void;
}

const defaultState: UserState = {
  tier: 'free',
  ...emptyProgress(),
  ageVerifiedElite: false,
  fieldNotes: [],
  activeRun: null,
};

function progressOf(state: UserState): ProgressState {
  return {
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    lastTrainingDate: state.lastTrainingDate,
    reviewed: state.reviewed,
    bestGrades: state.bestGrades,
    legsCleared: state.legsCleared,
    runsCompleted: state.runsCompleted,
    turnbacks: state.turnbacks,
    bestSound: state.bestSound,
    settledRunIds: state.settledRunIds,
  };
}

function persistable(state: UserState): UserState {
  return {
    tier: state.tier,
    level: state.level,
    xp: state.xp,
    streak: state.streak,
    lastTrainingDate: state.lastTrainingDate,
    ageVerifiedElite: state.ageVerifiedElite,
    reviewed: state.reviewed,
    bestGrades: state.bestGrades,
    legsCleared: state.legsCleared,
    runsCompleted: state.runsCompleted,
    turnbacks: state.turnbacks,
    bestSound: state.bestSound,
    settledRunIds: state.settledRunIds,
    fieldNotes: state.fieldNotes,
    activeRun: state.activeRun,
  };
}

function settleIfNeeded(state: UserState, today: string): UserState {
  const run = state.activeRun;
  if (!run || run.status === 'active' || run.settled) return state;
  const nextProgress = applySettlement(progressOf(state), run, today);
  return {
    ...state,
    ...nextProgress,
    activeRun: { ...run, settled: true },
  };
}

function sanitizeRun(run: ActiveRun | null | undefined): ActiveRun | null {
  if (!run || typeof run !== 'object') return null;
  if (run.status !== 'active' && run.status !== 'complete' && run.status !== 'turned-back') return null;
  if (!run.resources || typeof run.resources.water !== 'number') return null;
  if (!Array.isArray(run.log) || typeof run.legIndex !== 'number' || !run.id) return null;
  return run;
}

function normalize(saved: Partial<UserState> | null): UserState {
  if (!saved) return { ...defaultState };
  const legacyDate = (saved as { lastDailyOpDate?: string }).lastDailyOpDate;
  const base: UserState = {
    ...defaultState,
    tier: saved.tier ?? 'free',
    level: saved.level ?? 1,
    xp: saved.xp ?? 0,
    streak: saved.streak ?? 0,
    lastTrainingDate: saved.lastTrainingDate ?? legacyDate,
    ageVerifiedElite: !!saved.ageVerifiedElite,
    reviewed: saved.reviewed ?? {},
    bestGrades: saved.bestGrades ?? {},
    legsCleared: saved.legsCleared ?? [],
    runsCompleted: saved.runsCompleted ?? 0,
    turnbacks: saved.turnbacks ?? 0,
    bestSound: saved.bestSound ?? 0,
    settledRunIds: saved.settledRunIds ?? [],
    fieldNotes: Array.isArray(saved.fieldNotes) ? saved.fieldNotes : [],
    activeRun: sanitizeRun(saved.activeRun),
  };
  return settleIfNeeded(base, localDateISO(new Date()));
}

let hydrating = false;

function write(partial: Partial<UserState>) {
  return (set: (partial: Partial<UserStore>) => void, get: () => UserStore) => {
    const next = persistable({ ...get(), ...partial });
    set(next);
    void setJSON(STORAGE_KEY, next);
  };
}

export const useUser = create<UserStore>((set, get) => ({
  ...defaultState,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated || hydrating) return;
    hydrating = true;
    try {
      const saved = await getJSON<Partial<UserState>>(STORAGE_KEY);
      const next = normalize(saved);
      set({ ...next, hydrated: true });
      if (saved) void setJSON(STORAGE_KEY, next);
    } catch {
      if (!get().hydrated) set({ ...defaultState, hydrated: true });
    } finally {
      hydrating = false;
    }
  },

  setTier: (tier) => {
    write({ tier })(set, get);
  },

  verifyEliteAge: () => {
    write({ ageVerifiedElite: true })(set, get);
  },

  reset: async () => {
    set({ ...defaultState, hydrated: true });
    await setJSON(STORAGE_KEY, defaultState);
  },

  startRun: (loadoutId) => {
    const state = get();
    if (state.activeRun?.status === 'active') return;
    const today = localDateISO(new Date());
    const run = startRunEngine(LOADOUTS, loadoutId, today, `run-${Date.now()}`);
    write({ activeRun: run })(set, get);
  },

  resolveChoice: (choiceId) => {
    const run = get().activeRun;
    if (!run) return;
    write({ activeRun: resolveChoiceEngine(run, choiceId, CAMPAIGN_LEGS) })(set, get);
  },

  continueRun: () => {
    const state = get();
    const run = state.activeRun;
    if (!run) return;
    const next = continueRunEngine(run, CAMPAIGN_LEGS.length);
    if (next === run) return;
    if (next.status === 'active') {
      write({ activeRun: next })(set, get);
      return;
    }
    const today = localDateISO(new Date());
    const settled = applySettlement(progressOf(state), next, today);
    write({
      ...settled,
      activeRun: { ...next, settled: true },
    })(set, get);
  },

  dismissRun: () => {
    const run = get().activeRun;
    if (!run || run.status === 'active') return;
    write({ activeRun: null })(set, get);
  },

  leaveRun: () => {
    const run = get().activeRun;
    if (!run || run.status !== 'active') return;
    write({ activeRun: null })(set, get);
  },

  togglePrinciple: (skillId, principleId) => {
    const skill = skillsData.find((item) => item.id === skillId);
    if (!skill) return;
    const reviewed = toggleReviewed(
      get().reviewed,
      skillId,
      principleId,
      skill.principles.map((item) => item.id),
    );
    write({ reviewed })(set, get);
  },

  addFieldNote: (text) => {
    const notes = appendNote(get().fieldNotes, {
      id: `note-${Date.now()}`,
      text,
      createdOn: localDateISO(new Date()),
    });
    if (notes === get().fieldNotes) return;
    write({ fieldNotes: notes })(set, get);
  },
}));
