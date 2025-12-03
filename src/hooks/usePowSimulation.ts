import { useEffect, useRef } from 'react';
import { usePowStore } from '../store/powStore';

export function usePowSimulation() {
  const {
    isRunning,
    miners,
    difficulty,
    targetBlockTime,
    attemptsPerSecond,
    attemptsTotal,
    latestBlock,
    blockHistory,
    hashrateHistory,
    reset,
    toggleMinerActive,
    setScenario,
    setDifficulty,
    setTargetBlockTime,
    setRunning,
    tickSimulation,
  } = usePowStore();

  const lastTs = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      lastTs.current = null;
      return undefined;
    }

    const loop = (ts: number) => {
      if (!isRunning) return;
      if (lastTs.current == null) {
        lastTs.current = ts;
      }
      const deltaMs = ts - lastTs.current;
      lastTs.current = ts;
      const deltaSeconds = deltaMs / 1000;
      tickSimulation(deltaSeconds);
      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(id);
  }, [isRunning, tickSimulation]);

  return {
    isRunning,
    miners,
    difficulty,
    targetBlockTime,
    attemptsPerSecond,
    attemptsTotal,
    latestBlock,
    blockHistory,
    hashrateHistory,
    reset,
    toggleMinerActive,
    setScenario,
    setDifficulty,
    setTargetBlockTime,
    setRunning,
  };
}


