import { create } from 'zustand';
import type { ForkBlock, ForkBranch, ForkEvent, ForkNode } from '../types/fork';
import { createForkBlock, createGenesisBlock, createInitialBranches } from '../utils/fakeChain';

export type SimulationSpeed = 'slow' | 'normal' | 'fast';

type ForkState = {
  nodes: ForkNode[];
  branches: ForkBranch[];
  blocks: ForkBlock[];
  canonicalChain: ForkBlock[];
  orphans: ForkBlock[];
  events: ForkEvent[];
  isRunning: boolean;
  simulationSpeed: SimulationSpeed;
};

type ForkActions = {
  reset: () => void;
  start: () => void;
  pause: () => void;
  setSpeed: (speed: SimulationSpeed) => void;
  toggleNodeOnline: (id: string) => void;
  updateLatency: (id: string, latencyMs: number) => void;
  updateMiningSpeed: (id: string, speed: number) => void;
  randomizeLatencies: () => void;
  produceBlock: (nodeId: string) => void;
  triggerFork: () => void;
  runTick: () => void;
  resolveLongestChain: () => void;
  reorgIfNeeded: () => void;
};

const initialNodes = (): ForkNode[] => [
  {
    id: 'node-1',
    name: 'Node 1 – Core',
    latencyMs: 40,
    miningSpeed: 1.0,
    isOnline: true,
    currentHeight: 0,
    branchId: 'A',
  },
  {
    id: 'node-2',
    name: 'Node 2 – West',
    latencyMs: 80,
    miningSpeed: 0.9,
    isOnline: true,
    currentHeight: 0,
    branchId: 'A',
  },
  {
    id: 'node-3',
    name: 'Node 3 – East',
    latencyMs: 120,
    miningSpeed: 0.8,
    isOnline: true,
    currentHeight: 0,
    branchId: 'A',
  },
  {
    id: 'node-4',
    name: 'Node 4 – Laggy',
    latencyMs: 300,
    miningSpeed: 0.6,
    isOnline: true,
    currentHeight: 0,
    branchId: 'C',
  },
];

const withEvent = (state: ForkState, patch: Partial<ForkState>, event?: Omit<ForkEvent, 'id' | 'timestamp'>): ForkState => {
  if (!event) {
    return { ...state, ...patch };
  }
  const fullEvent: ForkEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };
  return {
    ...state,
    ...patch,
    events: [...state.events.slice(-63), fullEvent],
  };
};

const buildInitialState = (): ForkState => {
  const branches = createInitialBranches();
  const genesis = createGenesisBlock('A');
  const updatedBranches = branches.map((b) =>
    b.id === 'A' ? { ...b, headHash: genesis.hash, length: 1 } : b,
  );
  return {
    nodes: initialNodes(),
    branches: updatedBranches,
    blocks: [genesis],
    canonicalChain: [genesis],
    orphans: [],
    events: [],
    isRunning: false,
    simulationSpeed: 'normal',
  };
};

export const useForkStore = create<ForkState & ForkActions>((set, get) => ({
  ...buildInitialState(),

  reset: () => set(buildInitialState()),

  start: () => set({ isRunning: true }),

  pause: () => set({ isRunning: false }),

  setSpeed: (speed) => set({ simulationSpeed: speed }),

  toggleNodeOnline: (id) =>
    set((state) =>
      withEvent(
        state,
        {
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, isOnline: !n.isOnline } : n,
          ),
        },
        {
          type: 'node',
          message: `Node ${id} ${state.nodes.find((n) => n.id === id)?.isOnline ? 'offline' : 'online'}`,
        },
      ),
    ),

  updateLatency: (id, latencyMs) =>
    set((state) =>
      withEvent(
        state,
        {
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, latencyMs } : n,
          ),
        },
        {
          type: 'latency',
          message: `Latency của ${state.nodes.find((n) => n.id === id)?.name ?? id} được đặt thành ${latencyMs.toFixed(0)}ms`,
        },
      ),
    ),

  updateMiningSpeed: (id, speed) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, miningSpeed: speed } : n,
      ),
    })),

  randomizeLatencies: () =>
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        latencyMs: 10 + Math.random() * 490,
      })),
      events: [
        ...state.events,
        {
          id: `ev-lat-${Date.now()}`,
          type: 'latency',
          message: 'Random hoá latency toàn mạng',
          timestamp: new Date().toISOString(),
        },
      ].slice(-64),
    })),

  produceBlock: (nodeId) => {
    const state = get();
    const node = state.nodes.find((n) => n.id === nodeId);
    if (!node || !node.isOnline) return;

    const branch = state.branches.find((b) => b.id === node.branchId) ?? state.branches[0];
    const parent =
      state.blocks.find((b) => b.hash === branch.headHash) ??
      state.canonicalChain[state.canonicalChain.length - 1] ??
      null;

    const block = createForkBlock(node, parent, branch.id);
    const blocks = [...state.blocks, block];

    const branches = state.branches.map((b) =>
      b.id === branch.id
        ? {
            ...b,
            headHash: block.hash,
            length: Math.max(b.length, block.height + 1),
          }
        : b,
    );

    const nodes = state.nodes.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            currentHeight: block.height,
            branchId: branch.id,
          }
        : n,
    );

    const canonicalChain = [...state.canonicalChain, block];

    set(
      withEvent(
        {
          ...state,
          nodes,
          branches,
          blocks,
          canonicalChain,
        },
        {},
        {
          type: 'block',
          message: `${node.name} tạo block mới ở height ${block.height} trên nhánh ${branch.id}`,
        },
      ),
    );
  },

  triggerFork: () => {
    const state = get();
    const [nodeA, nodeB] = state.nodes.filter((n) => n.isOnline).slice(0, 2);
    if (!nodeA || !nodeB) return;

    const baseBranch = state.branches.find((b) => b.id === 'A') ?? state.branches[0];
    const parent =
      state.blocks.find((b) => b.hash === baseBranch.headHash) ??
      state.canonicalChain[state.canonicalChain.length - 1] ??
      null;

    if (!parent) return;

    const blockA = createForkBlock(nodeA, parent, 'A');
    const blockB = createForkBlock(nodeB, parent, 'B');

    const blocks = [...state.blocks, blockA, blockB];
    const branches = state.branches.map((b) => {
      if (b.id === 'A') {
        return { ...b, headHash: blockA.hash, length: Math.max(b.length, blockA.height + 1) };
      }
      if (b.id === 'B') {
        return { ...b, headHash: blockB.hash, length: Math.max(b.length, blockB.height + 1) };
      }
      return b;
    });

    const nodes = state.nodes.map((n) => {
      if (n.id === nodeA.id) {
        return { ...n, currentHeight: blockA.height, branchId: 'A' };
      }
      if (n.id === nodeB.id) {
        return { ...n, currentHeight: blockB.height, branchId: 'B' };
      }
      return n;
    });

    set(
      withEvent(
        {
          ...state,
          nodes,
          branches,
          blocks,
        },
        {},
        {
          type: 'fork',
          message: `Fork xảy ra tại height ${parent.height}: nhánh A và B có block cạnh tranh`,
        },
      ),
    );
  },

  runTick: () => {
    const state = get();
    if (!state.isRunning) return;

    const onlineNodes = state.nodes.filter((n) => n.isOnline);
    if (!onlineNodes.length) return;

    const speedFactor =
      state.simulationSpeed === 'slow' ? 0.4 : state.simulationSpeed === 'fast' ? 1.4 : 0.8;

    const threshold = 0.6;
    const produced: ForkNode[] = [];
    for (const node of onlineNodes) {
      const prob = (node.miningSpeed / 1.5) * speedFactor;
      if (Math.random() < prob * 0.1) {
        produced.push(node);
      }
    }

    if (!produced.length) return;

    if (produced.length === 1) {
      get().produceBlock(produced[0].id);
      get().reorgIfNeeded();
      return;
    }

    const parentHeights = produced.map(
      (n) => state.nodes.find((nn) => nn.id === n.id)?.currentHeight ?? 0,
    );
    const maxHeight = Math.max(...parentHeights);
    const competing = produced.filter(
      (_n, idx) => parentHeights[idx] === maxHeight && Math.random() > threshold,
    );

    if (competing.length >= 2) {
      get().triggerFork();
    } else {
      get().produceBlock(produced[0].id);
    }

    get().reorgIfNeeded();
  },

  resolveLongestChain: () => {
    const state = get();
    const longest = state.branches.reduce((max, b) => (b.length > max.length ? b : max), state.branches[0]);
    const longestHead = state.blocks.find((b) => b.hash === longest.headHash);
    if (!longestHead) return;

    const canonicalSet = new Set<string>();
    let cursor: ForkBlock | undefined = longestHead;
    const byHash = new Map(state.blocks.map((b) => [b.hash, b]));
    while (cursor) {
      canonicalSet.add(cursor.hash);
      cursor = cursor.prevHash ? byHash.get(cursor.prevHash) : undefined;
    }

    const blocks = state.blocks.map((b) => ({
      ...b,
      isCanonical: canonicalSet.has(b.hash),
      isOrphan: !canonicalSet.has(b.hash) && b.height > 0,
    }));

    const canonicalChain = blocks
      .filter((b) => b.isCanonical)
      .sort((a, b) => a.height - b.height);
    const orphans = blocks.filter((b) => b.isOrphan);

    set(
      withEvent(
        {
          ...state,
          blocks,
          canonicalChain,
          orphans,
        },
        {},
        {
          type: 'reorg',
          message: `Re-org: nhánh ${longest.id} trở thành chuỗi dài nhất (height ${longest.length - 1})`,
        },
      ),
    );
  },

  reorgIfNeeded: () => {
    const state = get();
    const maxLen = Math.max(...state.branches.map((b) => b.length));
    const longestBranches = state.branches.filter((b) => b.length === maxLen);
    if (maxLen <= 1 || longestBranches.length !== 1) return;
    get().resolveLongestChain();
  },
}));


