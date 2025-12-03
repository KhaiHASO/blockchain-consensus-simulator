import { useEffect, useRef } from 'react';
import { usePosStore } from '../store/posStore';

const SLOT_DURATION_MS = 1500;

export function usePosSimulation() {
  const {
    validators,
    isRunning,
    isEpochRunning,
    currentEpoch,
    currentSlot,
    slotsPerEpoch,
    baseReward,
    selectedValidator,
    latestSelection,
    selectionHistory,
    rewardHistory,
    slashingEvents,
    resetSimulation,
    recalcProbabilities,
    proposeBlock,
    startEpoch,
    pauseEpoch,
    advanceSlot,
    slashValidator,
    addValidator,
    updateStake,
  } = usePosStore();

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    recalcProbabilities();
  }, [recalcProbabilities]);

  useEffect(() => {
    if (!isEpochRunning) {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    if (timerRef.current == null) {
      timerRef.current = window.setInterval(() => {
        advanceSlot();
      }, SLOT_DURATION_MS);
    }

    return () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isEpochRunning, advanceSlot]);

  return {
    validators,
    isRunning,
    isEpochRunning,
    currentEpoch,
    currentSlot,
    slotsPerEpoch,
    baseReward,
    selectedValidator,
    latestSelection,
    selectionHistory,
    rewardHistory,
    slashingEvents,
    resetSimulation,
    recalcProbabilities,
    proposeBlock,
    startEpoch,
    pauseEpoch,
    advanceSlot,
    slashValidator,
    addValidator,
    updateStake,
  };
}


