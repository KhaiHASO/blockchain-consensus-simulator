// Placeholder API layer for future backend integration.
// Endpoints to support later:
// - GET /miners
// - GET /latest-block
// - POST /mine
// - POST /difficulty/update

export type PowMinerDto = {
  id: string;
  name: string;
  hashrate: number;
  speed: number;
  active: boolean;
};

export type PowBlockDto = {
  height: number;
  minerId: string;
  hash: string;
  nonce: number;
  timestamp: string;
  difficulty: number;
};

const BASE_URL = '/api/pow';

export async function fetchMiners(): Promise<PowMinerDto[]> {
  // Placeholder only – implementation will call `${BASE_URL}/miners`
  void BASE_URL;
  return Promise.resolve([]);
}

export async function fetchLatestBlock(): Promise<PowBlockDto | null> {
  // Placeholder only – implementation will call `${BASE_URL}/latest-block`
  void BASE_URL;
  return Promise.resolve(null);
}

export async function postMine(): Promise<PowBlockDto | null> {
  // Placeholder only – implementation will call `${BASE_URL}/mine`
  void BASE_URL;
  return Promise.resolve(null);
}

export async function updateDifficulty(_difficulty: number): Promise<void> {
  // Placeholder only – implementation will call `${BASE_URL}/difficulty/update`
  void BASE_URL;
}


