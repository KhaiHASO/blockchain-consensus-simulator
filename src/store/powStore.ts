import { create } from 'zustand';
import type { BlockInfo, Miner, ScenarioKey } from '../types/pow';
import { generateFakeMiners } from '../utils/fakeMiner';
import { generateFakeBlock } from '../utils/fakeBlock';

type PowState = {
  miners: Miner[];
  isRunning: boolean;
  difficulty: number;
  targetBlockTime: number;
  attemptsPerSecond: number;
  attemptsTotal: number;
  currentScenario: ScenarioKey | null;
  latestBlock: BlockInfo | null;
  blockHistory: BlockInfo[];
  hashrateHistory: { height: number; hashrate: number }[];
};

type PowActions = {
  reset: () => void;
  toggleMinerActive: (id: string) => void;
  setScenario: (scenario: ScenarioKey | null) => void;
  setDifficulty: (value: number) => void;
  setTargetBlockTime: (value: number) => void;
  setRunning: (running: boolean) => void;
  tickSimulation: (deltaSeconds: number) => void;
};

const initialMiners = () => generateFakeMiners(8);

export const usePowStore = create<PowState & PowActions>((set, get) => ({
  miners: initialMiners(),
  isRunning: false,
  difficulty: 1,
  targetBlockTime: 10,
  attemptsPerSecond: 0,
  attemptsTotal: 0,
  currentScenario: null,
  latestBlock: null,
  blockHistory: [],
  hashrateHistory: [],

  reset: () =>
    set(() => ({
      miners: initialMiners(),
      isRunning: false,
      difficulty: 1,
      targetBlockTime: 10,
      attemptsPerSecond: 0,
      attemptsTotal: 0,
      currentScenario: null,
      latestBlock: null,
      blockHistory: [],
      hashrateHistory: [],
    })),

  toggleMinerActive: (id) =>
    set((state) => ({
      miners: state.miners.map((m) =>
        m.id === id
          ? {
              ...m,
              active: !m.active,
              status: !m.active ? 'idle' : m.status,
            }
          : m,
      ),
    })),

  setScenario: (scenario) => set({ currentScenario: scenario }),

  setDifficulty: (value) => set({ difficulty: value }),

  setTargetBlockTime: (value) => set({ targetBlockTime: value }),

  setRunning: (running) =>
    set((state) => ({
      isRunning: running,
      miners: state.miners.map((m) => ({
        ...m,
        status: running && m.active ? 'mining' : 'idle',
      })),
    })),

  tickSimulation: (deltaSeconds) => {
    const state = get();
    if (!state.isRunning) return;

    const activeMiners = state.miners.filter((m) => m.active);
    if (!activeMiners.length) return;

    const baseHashrate = activeMiners.reduce((acc, m) => acc + m.hashrate, 0);
    const attemptsPerSecond = baseHashrate * 1_000; // scale up for visual effect
    const deltaAttempts = attemptsPerSecond * deltaSeconds;
    const attemptsTotal = state.attemptsTotal + deltaAttempts;

    const threshold = 8_000_000 * state.difficulty; // abstract "target"
    const probability = Math.min(0.9, (attemptsPerSecond / threshold) * deltaSeconds);
    const blockFound = Math.random() < probability;

    if (!blockFound) {
      set({
        attemptsPerSecond,
        attemptsTotal,
      });
      return;
    }

    let chosen: Miner;

    switch (state.currentScenario) {
      case 'fastest-wins': {
        chosen = [...activeMiners].sort((a, b) => b.hashrate - a.hashrate)[0];
        break;
      }
      case 'slow-miner-luck': {
        const sorted = [...activeMiners].sort((a, b) => a.hashrate - b.hashrate);
        const pool = [
          ...sorted.slice(0, 2),
          sorted[sorted.length - 1],
          state.miners[Math.floor(Math.random() * state.miners.length)],
        ];
        chosen = pool[Math.floor(Math.random() * pool.length)];
        break;
      }
      case 'difficulty-low':
      case 'difficulty-high':
      default: {
        const totalWeight = activeMiners.reduce((acc, m) => acc + m.speed, 0);
        let r = Math.random() * totalWeight;
        let winner = activeMiners[0];
        for (const miner of activeMiners) {
          r -= miner.speed;
          if (r <= 0) {
            winner = miner;
            break;
          }
        }
        chosen = winner;
      }
    }

    const blockTimeSeconds =
      state.currentScenario === 'difficulty-low'
        ? 3 + Math.random() * 4
        : state.currentScenario === 'difficulty-high'
          ? 14 + Math.random() * 8
          : 5 + Math.random() * 10;

    const block = generateFakeBlock(chosen, state.difficulty, blockTimeSeconds);

    const nextDifficulty = (() => {
      const target = state.targetBlockTime;
      const ratio = blockTimeSeconds / target;
      const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
      const factor = clamp(ratio, 0.5, 1.5);
      return clamp(state.difficulty * factor, 0.2, 5);
    })();

    set({
      attemptsPerSecond,
      attemptsTotal: 0,
      latestBlock: block,
      blockHistory: [...state.blockHistory.slice(-24), block],
      hashrateHistory: [
        ...state.hashrateHistory.slice(-24),
        { height: block.height, hashrate: baseHashrate },
      ],
      difficulty: nextDifficulty,
      miners: state.miners.map((m) => ({
        ...m,
        status: m.id === chosen.id ? 'winner' : m.active ? 'mining' : m.status,
        sharesMined: m.id === chosen.id ? m.sharesMined + 1 : m.sharesMined,
      })),
    });
  },
}));


