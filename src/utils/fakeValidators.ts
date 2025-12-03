import type { Validator } from '../types/pos';

const NAMES = [
  'Validator Alpha',
  'Validator Sigma',
  'StakeMaster 01',
  'Node 23',
  'Node 42',
  'Cypher Guardian',
  'Neon Validator',
  'Aurora Node',
  'Quantum Stake',
  'Grid Validator',
] as const;

const AVATARS = ['🟣', '🔵', '🟢', '🟡', '🟠', '🟤', '⚡', '💠', '🛰️', '🧿'];

export function generateFakeValidators(count = 8): Validator[] {
  const n = Math.min(count, NAMES.length);
  const validators: Validator[] = [];

  for (let i = 0; i < n; i += 1) {
    const name = NAMES[i];
    const baseStake = 10 + Math.random() * 290; // 10–300
    const effectiveStake = baseStake * (0.95 + Math.random() * 0.1); // ±5%

    validators.push({
      id: `val-${i + 1}`,
      name,
      avatar: AVATARS[i % AVATARS.length],
      stake: Number(baseStake.toFixed(2)),
      effectiveStake: Number(effectiveStake.toFixed(2)),
      status: 'active',
      rewards: 0,
      probability: 0, // will be normalized later
    });
  }

  const total = validators.reduce((acc, v) => acc + v.effectiveStake, 0);
  return validators.map((v) => ({
    ...v,
    probability: total > 0 ? v.effectiveStake / total : 0,
  }));
}


