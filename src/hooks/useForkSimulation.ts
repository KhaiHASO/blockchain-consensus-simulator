import { useEffect } from 'react';
import { useForkStore } from '../store/forkStore';

const SPEED_TO_INTERVAL: Record<'slow' | 'normal' | 'fast', number> = {
  slow: 1600,
  normal: 900,
  fast: 450,
};

export function useForkSimulation() {
  const {
    nodes,
    branches,
    blocks,
    canonicalChain,
    orphans,
    events,
    isRunning,
    simulationSpeed,
    reset,
    start,
    pause,
    setSpeed,
    toggleNodeOnline,
    updateLatency,
    updateMiningSpeed,
    randomizeLatencies,
    produceBlock,
    triggerFork,
    runTick,
  } = useForkStore();

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalMs = SPEED_TO_INTERVAL[simulationSpeed];
    const id = window.setInterval(() => {
      runTick();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [isRunning, simulationSpeed, runTick]);

  return {
    nodes,
    branches,
    blocks,
    canonicalChain,
    orphans,
    events,
    isRunning,
    simulationSpeed,
    reset,
    start,
    pause,
    setSpeed,
    toggleNodeOnline,
    updateLatency,
    updateMiningSpeed,
    randomizeLatencies,
    produceBlock,
    triggerFork,
  };
}


