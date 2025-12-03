export type ForkNode = {
  id: string;
  name: string;
  latencyMs: number;
  miningSpeed: number;
  isOnline: boolean;
  currentHeight: number;
  branchId: string;
};

export type ForkBlock = {
  id: string;
  height: number;
  hash: string;
  prevHash: string | null;
  producerNodeId: string;
  branchId: string;
  timestamp: string;
  difficulty: number;
  isCanonical: boolean;
  isOrphan: boolean;
};

export type ForkBranch = {
  id: string;
  name: string;
  color: string;
  headHash: string | null;
  length: number;
};

export type ForkEventType =
  | 'block'
  | 'fork'
  | 'reorg'
  | 'orphan'
  | 'node'
  | 'latency';

export type ForkEvent = {
  id: string;
  type: ForkEventType;
  message: string;
  timestamp: string;
};


