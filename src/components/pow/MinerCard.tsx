import { motion } from 'framer-motion';
import type { Miner } from '../../types/pow';

type Props = {
  miner: Miner;
  isWinner?: boolean;
};

export function MinerCard({ miner, isWinner }: Props) {
  return (
    <motion.div
      className={`glass-panel flex flex-col rounded-2xl border px-3 py-3 text-sm ${
        isWinner ? 'border-amber-400/80 neon-border-cyan' : 'border-slate-700/80'
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className="avatar placeholder">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-sm text-white">
            <span>{miner.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-50">{miner.name}</p>
          <p className="text-[11px] text-slate-400">
            {miner.hashrate.toFixed(1)} MH/s • Tốc độ {miner.speed.toFixed(2)}
          </p>
        </div>
        <span
          className={`badge badge-sm border-0 text-[11px] ${
            miner.active
              ? miner.status === 'mining'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-slate-500/20 text-slate-200'
              : 'bg-slate-700/60 text-slate-400'
          }`}
        >
          {miner.active ? (miner.status === 'mining' ? 'Đang đào' : miner.status === 'winner' ? 'Vừa thắng' : 'Đang chờ') : 'Tắt'}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col text-[11px] text-slate-400">
          <span>Shares</span>
          <span className="font-mono text-sm text-slate-100">
            {miner.sharesMined.toString().padStart(3, '0')}
          </span>
        </div>
        {isWinner && (
          <span className="badge badge-sm border border-amber-400/70 bg-amber-500/20 text-[11px] text-amber-200">
            Thợ đào thắng gần nhất
          </span>
        )}
      </div>
    </motion.div>
  );
}


