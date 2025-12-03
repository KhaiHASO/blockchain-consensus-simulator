import { motion } from 'framer-motion';
import type { BlockInfo } from '../../types/pow';

type Props = {
  block: BlockInfo | null;
};

export function BlockResult({ block }: Props) {
  if (!block) {
    return (
      <div className="glass-panel flex h-full flex-col items-center justify-center rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base text-slate-400">
        <p>Chưa có block nào được đào.</p>
        <p className="mt-1 text-[12px]">Bấm bắt đầu đào để xem block mới được sinh ra.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={block.height}
      className="glass-panel neon-border-cyan flex h-full flex-col rounded-3xl border border-cyan-500/60 p-4 text-sm md:text-base"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            Block mới nhất
          </p>
          <p className="text-base font-semibold text-slate-50">Block #{block.height}</p>
        </div>
        <span className="badge badge-sm border border-emerald-400/70 bg-emerald-500/10 text-[12px] text-emerald-200">
          Block mới
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Thợ đào</p>
          <p className="mt-1 font-medium text-slate-100">{block.minerName}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Nonce</p>
          <p className="mt-1 font-mono text-[13px] text-slate-100">{block.nonce}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Độ khó</p>
          <p className="mt-1 font-mono text-[13px] text-cyan-300">
            {block.difficulty.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Thời gian tạo block</p>
          <p className="mt-1 font-mono text-[13px] text-amber-200">
            {block.blockTimeSeconds.toFixed(2)} s
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Hash</p>
        <p className="mt-1 break-all font-mono text-[13px] text-slate-100">{block.hash}</p>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        {new Date(block.timestamp).toLocaleTimeString()} • hash giả lập dạng SHA-256 (64 ký tự hex)
      </p>
    </motion.div>
  );
}


