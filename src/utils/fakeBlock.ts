import type { BlockInfo, Miner } from '../types/pow';
import { randomSha256Like } from './randomHash';

let heightCounter = 0;

export function generateFakeBlock(miner: Miner, difficulty: number, blockTimeSeconds: number): BlockInfo {
  heightCounter += 1;

  return {
    height: heightCounter,
    minerId: miner.id,
    minerName: miner.name,
    nonce: Math.floor(Math.random() * 10_000_000),
    hash: randomSha256Like(),
    timestamp: new Date().toISOString(),
    difficulty,
    blockTimeSeconds,
  };
}


