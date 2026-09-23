import { UserTier } from '../types';

export interface DailyOpDef {
  id: string;
  title: string;
  desc: string;
  /** Free tier can see the row, but cannot check it off. */
  proOnly: boolean;
}

export const dailyOps: DailyOpDef[] = [
  { id: 'water', title: 'Water Audit', desc: 'Check purification + storage', proOnly: false },
  { id: 'fire', title: 'Fire Kit Check', desc: 'Ignition + tinder ready', proOnly: false },
  { id: 'shelter', title: 'Shelter Bag', desc: 'Tarp + cordage present', proOnly: false },
  { id: 'medical', title: 'Medical Inventory', desc: 'Confirm kit is current', proOnly: true },
];

const opsById = new Map(dailyOps.map((op) => [op.id, op]));

export function isOpUnlocked(opId: string, tier: UserTier): boolean {
  const op = opsById.get(opId);
  if (!op) return false;
  if (!op.proOnly) return true;
  return tier === 'pro' || tier === 'elite';
}

export function unlockedOpIds(tier: UserTier): string[] {
  return dailyOps.filter((op) => isOpUnlocked(op.id, tier)).map((op) => op.id);
}
