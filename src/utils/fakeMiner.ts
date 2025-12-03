import type { Miner } from '../types/pow';

const MINERS = [
  'Rig-Alpha',
  'Rig-Beta',
  'Rig-Gamma',
  'Rig-Delta',
  'Rig-Omega',
  'NeonHash-01',
  'NeonHash-02',
  'VoidMiner',
  'PhotonCore',
  'GridNode-7',
] as const;

const COLORS = [
  '#22d3ee',
  '#a855f7',
  '#f97316',
  '#facc15',
  '#4ade80',
  '#38bdf8',
  '#ec4899',
];

export function generateFakeMiners(count = 8): Miner[] {
  const n = Math.min(count, MINERS.length);

  return Array.from({ length: n }).map((_, idx) => {
    const name = MINERS[idx];
    const hashrate = 5 + Math.random() * 195; // 5–200 MH/s
    const speed = hashrate / 200; // normalize ~0-1

    return {
      id: `miner-${idx + 1}`,
      name,
      hashrate,
      speed,
      avatarColor: COLORS[idx % COLORS.length],
      active: true,
      status: 'idle',
      sharesMined: 0,
    };
  });
}


