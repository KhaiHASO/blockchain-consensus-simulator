import { motion } from 'framer-motion';
import type { ForkBlock, ForkBranch } from '../../types/fork';

type Props = {
  branches: ForkBranch[];
  blocks: ForkBlock[];
};

type PositionedBlock = ForkBlock & { x: number; y: number };

export function ForkTree({ branches, blocks }: Props) {
  const canonical = blocks.filter((b) => b.isCanonical);
  const nonCanonical = blocks.filter((b) => !b.isCanonical && !b.isOrphan);
  const orphans = blocks.filter((b) => b.isOrphan);

  const heightMax = Math.max(5, ...blocks.map((b) => b.height));
  const width = 1000;
  const height = 260;
  const xStep = width / Math.max(6, heightMax + 1);

  const branchIndex = (id: string) =>
    branches.findIndex((b) => b.id === id) >= 0 ? branches.findIndex((b) => b.id === id) : 0;

  const layout = (block: ForkBlock): PositionedBlock => {
    const x = 40 + block.height * xStep;
    const idx = branchIndex(block.branchId);
    const offset = (idx - 1) * 52;
    const y = height / 2 + offset;
    return { ...block, x, y };
  };

  const positioned: PositionedBlock[] = [...canonical, ...nonCanonical, ...orphans].map(layout);

  const byHash = new Map(positioned.map((b) => [b.hash, b]));

  return (
    <div className="glass-panel relative h-72 overflow-hidden rounded-3xl border border-pink-500/60 p-4">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-100">
        <p className="font-semibold">Cây fork & chuỗi canonical</p>
        <p className="text-xs text-slate-400">
          Đường sáng: chuỗi dài nhất • Block đỏ: orphan
        </p>
      </div>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="canonicalBlock" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="forkBlock" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="orphanBlock" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {positioned.map((b) => {
          if (!b.prevHash) return null;
          const parent = byHash.get(b.prevHash);
          if (!parent) return null;

          const isCanonical = b.isCanonical && parent.isCanonical;
          const stroke = isCanonical ? '#22c55e' : 'rgba(148,163,184,0.5)';
          const strokeWidth = isCanonical ? 3 : 1.5;

          return (
            <motion.line
              key={`${b.hash}-edge`}
              x1={parent.x + 16}
              y1={parent.y}
              x2={b.x - 16}
              y2={b.y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
          );
        })}

        {positioned.map((b) => {
          const fill = b.isOrphan
            ? 'url(#orphanBlock)'
            : b.isCanonical
              ? 'url(#canonicalBlock)'
              : 'url(#forkBlock)';
          const opacity = b.isOrphan ? 0.5 : 0.95;

          return (
            <motion.g
              key={b.hash}
              initial={{ opacity: 0, scale: 0.8, translateY: 12 }}
              animate={{ opacity, scale: 1, translateY: 0 }}
              transition={{ duration: 0.4 }}
            >
              <rect
                x={b.x - 16}
                y={b.y - 10}
                rx={4}
                ry={4}
                width={32}
                height={20}
                fill={fill}
                stroke={b.isOrphan ? '#f97316' : 'rgba(15,23,42,0.9)'}
                strokeWidth={1.3}
              />
              <text
                x={b.x}
                y={b.y + 3}
                textAnchor="middle"
                fontSize={9}
                fill="#0f172a"
                fontFamily="system-ui, sans-serif"
              >
                {b.height}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}


