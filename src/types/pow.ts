export type MinerStatus = 'idle' | 'mining' | 'winner';

export type Miner = {
  id: string;
  name: string;
  hashrate: number; // MH/s
  speed: number; // relative probability weight
  avatarColor: string;
  active: boolean;
  status: MinerStatus;
  sharesMined: number;
};

export type BlockInfo = {
  height: number;
  minerId: string;
  minerName: string;
  nonce: number;
  hash: string;
  timestamp: string;
  difficulty: number;
  blockTimeSeconds: number;
};

export type ScenarioKey = 'fastest-wins' | 'slow-miner-luck' | 'difficulty-low' | 'difficulty-high';


