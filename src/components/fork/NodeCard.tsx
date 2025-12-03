import { motion } from 'framer-motion';
import type { ForkNode } from '../../types/fork';

type Props = {
  node: ForkNode;
  isProducing?: boolean;
  onToggleOnline: () => void;
  onLatencyChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
};

export function NodeCard({
  node,
  isProducing,
  onToggleOnline,
  onLatencyChange,
  onSpeedChange,
}: Props) {
  return (
    <motion.div
      className={`glass-panel relative flex flex-col rounded-2xl border px-3 py-3 text-sm ${
        node.isOnline
          ? 'border-cyan-500/60 shadow-[0_0_22px_rgba(34,211,238,0.6)]'
          : 'border-slate-700/80 opacity-70'
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isProducing ? 1.04 : 1,
      }}
      transition={{ duration: 0.25 }}
    >
      {isProducing && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-emerald-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.6 }}
        />
      )}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-xs">
          <span className="font-mono text-[11px] text-white">
            {node.id.replace('node-', 'N')}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-50">{node.name}</p>
          <p className="text-xs text-slate-400">
            Height: <span className="font-mono">{node.currentHeight}</span> • Nhánh{' '}
            <span className="font-mono">{node.branchId}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleOnline}
          className={`btn btn-xs rounded-full border-0 text-[11px] ${
            node.isOnline ? 'btn-success' : 'btn-outline btn-error'
          }`}
        >
          {node.isOnline ? 'Online' : 'Offline'}
        </button>
      </div>
      <div className="relative z-10 mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Độ trễ mạng (latency)</span>
            <span className="font-mono text-cyan-300">
              {node.latencyMs.toFixed(0)}
              ms
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={node.latencyMs}
            onChange={(e) => onLatencyChange(Number(e.target.value))}
            className="range range-xs mt-1 range-primary"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Tốc độ “đào” (giả lập)</span>
            <span className="font-mono text-amber-200">
              {node.miningSpeed.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min={0.3}
            max={1.5}
            step={0.1}
            value={node.miningSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="range range-xs mt-1 range-secondary"
          />
        </div>
      </div>
    </motion.div>
  );
}


