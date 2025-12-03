import { randomSha256Like } from './randomHash';
import type { ForkBlock, ForkBranch, ForkNode } from '../types/fork';

export function createGenesisBlock(branchId: string): ForkBlock {
  return {
    id: 'genesis',
    height: 0,
    hash: randomSha256Like(),
    prevHash: null,
    producerNodeId: 'genesis',
    branchId,
    timestamp: new Date().toISOString(),
    difficulty: 1,
    isCanonical: true,
    isOrphan: false,
  };
}

export function createInitialBranches(): ForkBranch[] {
  return [
    { id: 'A', name: 'Nhánh A (mặc định)', color: '#22d3ee', headHash: null, length: 0 },
    { id: 'B', name: 'Nhánh B', color: '#a855f7', headHash: null, length: 0 },
    { id: 'C', name: 'Nhánh C (trễ mạng)', color: '#f97316', headHash: null, length: 0 },
  ];
}

export function createForkBlock(
  node: ForkNode,
  parent: ForkBlock | null,
  branchId: string,
): ForkBlock {
  const height = parent ? parent.height + 1 : 1;
  const difficulty = 1 + Math.random() * 0.5;
  return {
    id: `${branchId}-${height}-${randomSha256Like().slice(0, 6)}`,
    height,
    hash: randomSha256Like(),
    prevHash: parent ? parent.hash : null,
    producerNodeId: node.id,
    branchId,
    timestamp: new Date().toISOString(),
    difficulty,
    isCanonical: false,
    isOrphan: false,
  };
}


