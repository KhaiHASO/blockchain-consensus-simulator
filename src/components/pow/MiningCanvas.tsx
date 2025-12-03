import { motion } from 'framer-motion';
import type { Miner } from '../../types/pow';

type Props = {
  miners: Miner[];
  attemptsPerSecond: number;
  attemptsTotal: number;
  difficulty: number;
  isRunning: boolean;
};

export function MiningCanvas({
  miners,
  attemptsPerSecond,
  attemptsTotal,
  difficulty,
  isRunning,
}: Props) {
  const maxSpeed = Math.max(...miners.map((m) => m.speed));

  return (
    <div className="glass-panel neon-border-purple relative h-64 overflow-hidden rounded-3xl border border-purple-500/50 p-4 text-sm md:text-base">
      <div className="mb-2 flex items-center justify-between text-slate-300">
        <span className="font-semibold">Cuộc đua đào khối</span>
        <span className="font-mono text-[12px] text-cyan-300">
          {Math.round(attemptsPerSecond).toLocaleString()} H/s
        </span>
      </div>
      <div className="mb-2 grid grid-cols-12 gap-2 text-[12px] text-slate-400">
        <span className="col-span-4">Thợ đào</span>
        <span className="col-span-6">Làn đua</span>
        <span className="col-span-2 text-right">Tốc độ</span>
      </div>
      <div className="space-y-2">
        {miners.map((miner) => {
          const progress =
            (Math.sin(Date.now() / 400 + miner.hashrate) * 0.2 + 0.8) *
            (miner.speed / maxSpeed || 0);

          return (
            <div key={miner.id} className="grid grid-cols-12 items-center gap-2 text-[12px]">
              <div className="col-span-4 flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: miner.avatarColor }}
                />
                <span className="truncate text-slate-200">{miner.name}</span>
              </div>
              <div className="col-span-6">
                <div className="relative h-2 overflow-hidden rounded-full bg-slate-800/70">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400"
                    animate={{
                      width: `${Math.max(4, progress * 100)}%`,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeOut',
                      repeat: isRunning ? Infinity : 0,
                      repeatType: 'reverse',
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 text-right text-slate-300">
                {(miner.speed * 10).toFixed(1)}x
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-4 pb-3 text-[11px] text-slate-500">
        <span>Độ khó: {difficulty.toFixed(2)}</span>
        <span>Tổng số hash thử: {Math.round(attemptsTotal).toLocaleString()}</span>
      </div>
    </div>
  );
}


