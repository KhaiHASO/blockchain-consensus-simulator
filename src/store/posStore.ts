import { create } from 'zustand';
import type { PosSlotSelection, SlashingEvent, Validator } from '../types/pos';
import { generateFakeValidators } from '../utils/fakeValidators';

type PosState = {
  validators: Validator[];
  isRunning: boolean;
  isEpochRunning: boolean;
  currentEpoch: number;
  currentSlot: number;
  slotsPerEpoch: number;
  baseReward: number;
  selectedValidator: Validator | null;
  latestSelection: PosSlotSelection | null;
  selectionHistory: PosSlotSelection[];
  rewardHistory: { epoch: number; slot: number; validatorId: string; rewards: number }[];
  slashingEvents: SlashingEvent[];
};

type PosActions = {
  resetSimulation: () => void;
  recalcProbabilities: () => void;
  proposeBlock: () => void;
  startEpoch: () => void;
  pauseEpoch: () => void;
  advanceSlot: () => void;
  slashValidator: (id: string) => void;
  addValidator: (partial: Pick<Validator, 'name' | 'avatar' | 'stake'>) => void;
  updateStake: (id: string, stake: number) => void;
};

const initialValidators = () => generateFakeValidators(8);

export const usePosStore = create<PosState & PosActions>((set, get) => ({
  validators: initialValidators(),
  isRunning: false,
  isEpochRunning: false,
  currentEpoch: 1,
  currentSlot: 0,
  slotsPerEpoch: 32,
  baseReward: 2,
  selectedValidator: null,
  latestSelection: null,
  selectionHistory: [],
  rewardHistory: [],
  slashingEvents: [],

  resetSimulation: () =>
    set(() => ({
      validators: initialValidators(),
      isRunning: false,
      isEpochRunning: false,
      currentEpoch: 1,
      currentSlot: 0,
      selectedValidator: null,
      latestSelection: null,
      selectionHistory: [],
      rewardHistory: [],
      slashingEvents: [],
    })),

  recalcProbabilities: () =>
    set((state) => {
      const activeValidators = state.validators.filter((v) => v.status === 'active' && v.stake > 0);
      const total = activeValidators.reduce((acc, v) => acc + v.effectiveStake, 0);
      if (total <= 0) {
        return {
          validators: state.validators.map((v) => ({ ...v, probability: 0 })),
        };
      }
      return {
        validators: state.validators.map((v) => ({
          ...v,
          probability:
            v.status === 'active' && v.stake > 0 ? v.effectiveStake / total : 0,
        })),
      };
    }),

  proposeBlock: () => {
    const state = get();
    const activeValidators = state.validators.filter(
      (v) => v.status === 'active' && v.stake > 0 && v.probability > 0,
    );
    if (!activeValidators.length) return;

    const totalWeight = activeValidators.reduce(
      (acc, v) => acc + v.probability * v.effectiveStake,
      0,
    );
    let r = Math.random() * totalWeight;
    let chosen = activeValidators[0];
    for (const v of activeValidators) {
      const weight = v.probability * v.effectiveStake;
      r -= weight;
      if (r <= 0) {
        chosen = v;
        break;
      }
    }

    const totalStake = activeValidators.reduce((acc, v) => acc + v.stake, 0);
    const stakeWeight = totalStake > 0 ? chosen.stake / totalStake : 0;
    const reward = Number((state.baseReward * (0.5 + stakeWeight)).toFixed(4));

    const epoch = state.currentEpoch;
    const slot = state.currentSlot || 1;
    const now = new Date().toISOString();

    const selection: PosSlotSelection = {
      epoch,
      slot,
      validatorId: chosen.id,
      validatorName: chosen.name,
      reward,
      timestamp: now,
    };

    set({
      selectedValidator: chosen,
      latestSelection: selection,
      selectionHistory: [...state.selectionHistory.slice(-127), selection],
      rewardHistory: [
        ...state.rewardHistory.slice(-255),
        { epoch, slot, validatorId: chosen.id, rewards: reward },
      ],
      validators: state.validators.map((v) =>
        v.id === chosen.id ? { ...v, rewards: v.rewards + reward } : v,
      ),
    });
  },

  startEpoch: () => set({ isEpochRunning: true, isRunning: true }),

  pauseEpoch: () => set({ isEpochRunning: false, isRunning: false }),

  advanceSlot: () => {
    const state = get();
    const nextSlot = state.currentSlot + 1;
    if (nextSlot > state.slotsPerEpoch) {
      const nextEpoch = state.currentEpoch + 1;
      set({
        currentEpoch: nextEpoch,
        currentSlot: 0,
      });
      return;
    }
    set({ currentSlot: nextSlot });
    get().proposeBlock();
  },

  slashValidator: (id) => {
    const state = get();
    const victim = state.validators.find((v) => v.id === id);
    if (!victim || victim.status === 'slashed') return;

    const burned = victim.stake * 0.3;
    const remaining = victim.stake - burned;

    const event: SlashingEvent = {
      id: `slash-${Date.now()}`,
      validatorId: victim.id,
      validatorName: victim.name,
      epoch: state.currentEpoch,
      slot: state.currentSlot,
      burnedAmount: Number(burned.toFixed(4)),
      remainingStake: Number(remaining.toFixed(4)),
      timestamp: new Date().toISOString(),
    };

    set({
      validators: state.validators.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'slashed',
              stake: remaining,
              effectiveStake: remaining * 0.9,
              probability: 0,
            }
          : v,
      ),
      slashingEvents: [...state.slashingEvents.slice(-31), event],
    });

    get().recalcProbabilities();
  },

  addValidator: (partial) => {
    const state = get();
    const id = `val-${state.validators.length + 1}`;
    const stake = partial.stake;
    const effectiveStake = stake * (0.95 + Math.random() * 0.1);
    const v: Validator = {
      id,
      name: partial.name,
      avatar: partial.avatar,
      stake,
      effectiveStake: Number(effectiveStake.toFixed(2)),
      status: 'active',
      rewards: 0,
      probability: 0,
    };

    set({
      validators: [...state.validators, v],
    });
    get().recalcProbabilities();
  },

  updateStake: (id, stake) => {
    const state = get();
    set({
      validators: state.validators.map((v) =>
        v.id === id
          ? {
              ...v,
              stake,
              effectiveStake: Number((stake * (0.95 + Math.random() * 0.1)).toFixed(2)),
            }
          : v,
      ),
    });
    get().recalcProbabilities();
  },
}));


