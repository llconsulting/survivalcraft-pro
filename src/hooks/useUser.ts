import { create } from 'zustand';
import { UserState, UserTier } from '../types';
import { getJSON, setJSON } from '../utils/storage';

const STORAGE_KEY = 'sc_user_v1';

interface UserStore extends UserState {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTier: (tier: UserTier) => void;
  verifyEliteAge: () => void;
  addXP: (amount: number) => void;
  completeSkill: (skillId: string) => void;
  reset: () => Promise<void>;
}

const defaultState: UserState = {
  tier: 'free',
  level: 1,
  xp: 0,
  streak: 0,
  skillsCompleted: ['water'],
  lastDailyOpDate: undefined,
  ageVerifiedElite: false,
};

export const useUser = create<UserStore>((set, get) => ({
  ...defaultState,
  hydrated: false,

  hydrate: async () => {
    const saved = await getJSON<UserState>(STORAGE_KEY);
    if (saved) set({ ...saved, hydrated: true });
    else set({ hydrated: true });
  },

  setTier: (tier) => {
    const next: Partial<UserState> = { tier };
    // If they downgrade, keep age flag but access logic is elsewhere.
    set(next as any);
    setJSON(STORAGE_KEY, { ...get(), ...next });
  },

  verifyEliteAge: () => {
    const next: Partial<UserState> = { ageVerifiedElite: true };
    set(next as any);
    setJSON(STORAGE_KEY, { ...get(), ...next });
  },

  addXP: (amount) => {
    const state = get();
    const xp = state.xp + amount;
    const level = Math.floor(xp / 1000) + 1;
    const next: Partial<UserState> = { xp, level };
    set(next as any);
    setJSON(STORAGE_KEY, { ...get(), ...next });
  },

  completeSkill: (skillId) => {
    const state = get();
    if (state.skillsCompleted.includes(skillId)) return;
    const skillsCompleted = [...state.skillsCompleted, skillId];
    const next: Partial<UserState> = { skillsCompleted };
    set(next as any);
    setJSON(STORAGE_KEY, { ...get(), ...next });
  },

  reset: async () => {
    set({ ...defaultState, hydrated: true } as any);
    await setJSON(STORAGE_KEY, defaultState);
  },
}));
