import { create } from 'zustand';
import { UserState, UserTier } from '../types';
import { getJSON, setJSON } from '../utils/storage';
import { normalizeStoredUser, toggleDailyOpState } from '../utils/dailyOpsLogic';

const STORAGE_KEY = 'sc_user_v1';

interface UserStore extends UserState {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  syncCalendarDay: () => void;
  setTier: (tier: UserTier) => void;
  verifyEliteAge: () => void;
  addXP: (amount: number) => void;
  completeSkill: (skillId: string) => void;
  toggleDailyOp: (opId: string) => void;
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
  dailyOpsDate: undefined,
  dailyOpsCompleted: [],
  streakCarry: 0,
  streakCarryFromDate: undefined,
};

function snapshot(state: UserState): UserState {
  return {
    tier: state.tier,
    level: state.level,
    xp: state.xp,
    streak: state.streak,
    skillsCompleted: state.skillsCompleted,
    lastDailyOpDate: state.lastDailyOpDate,
    ageVerifiedElite: state.ageVerifiedElite,
    dailyOpsDate: state.dailyOpsDate,
    dailyOpsCompleted: state.dailyOpsCompleted,
    streakCarry: state.streakCarry,
    streakCarryFromDate: state.streakCarryFromDate,
  };
}

export const useUser = create<UserStore>((set, get) => {
  let hydratePromise: Promise<void> | null = null;

  const commit = (next: UserState) => {
    const prev = snapshot(get());
    if (JSON.stringify(prev) === JSON.stringify(next)) return;
    set(next);
    void setJSON(STORAGE_KEY, next);
  };

  return {
    ...defaultState,
    hydrated: false,

    hydrate: () => {
      if (get().hydrated) return Promise.resolve();
      if (!hydratePromise) {
        hydratePromise = (async () => {
          try {
            const saved = await getJSON<Partial<UserState>>(STORAGE_KEY);
            if (get().hydrated) return;
            const next = normalizeStoredUser(saved ?? null);
            set({ ...next, hydrated: true });
            if (JSON.stringify(saved) !== JSON.stringify(next)) {
              await setJSON(STORAGE_KEY, next);
            }
          } finally {
            hydratePromise = null;
          }
        })();
      }
      return hydratePromise;
    },

    syncCalendarDay: () => {
      if (!get().hydrated) return;
      commit(normalizeStoredUser(snapshot(get())));
    },

    setTier: (tier) => {
      commit(normalizeStoredUser({ ...snapshot(get()), tier }));
    },

    verifyEliteAge: () => {
      commit(normalizeStoredUser({ ...snapshot(get()), ageVerifiedElite: true }));
    },

    addXP: (amount) => {
      const state = snapshot(get());
      const xp = state.xp + amount;
      const level = Math.floor(xp / 1000) + 1;
      commit(normalizeStoredUser({ ...state, xp, level }));
    },

    completeSkill: (skillId) => {
      const state = snapshot(get());
      if (state.skillsCompleted.includes(skillId)) return;
      commit(normalizeStoredUser({
        ...state,
        skillsCompleted: [...state.skillsCompleted, skillId],
      }));
    },

    toggleDailyOp: (opId) => {
      commit(toggleDailyOpState(snapshot(get()), opId));
    },

    reset: async () => {
      const next = normalizeStoredUser(defaultState);
      set({ ...next, hydrated: true });
      await setJSON(STORAGE_KEY, next);
    },
  };
});
