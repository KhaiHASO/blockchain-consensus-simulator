import { motion } from 'framer-motion';
import type { Validator } from '../../types/pos';

type Props = {
  validator: Validator;
  isSelected?: boolean;
};

export function ValidatorCard({ validator, isSelected }: Props) {
  const stakePercent = Math.min(100, (validator.effectiveStake / 300) * 100);

  return (
    <motion.div
      className={`glass-panel relative flex flex-col rounded-2xl border px-3 py-3 text-sm ${
        validator.status === 'slashed'
          ? 'border-red-500/80 shadow-[0_0_25px_rgba(248,113,113,0.7)]'
          : isSelected
            ? 'border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.8)]'
            : 'border-purple-500/50'
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
      transition={{ duration: 0.25 }}
    >
      {validator.status === 'slashed' && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-red-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl">
          <span>{validator.avatar}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-50">{validator.name}</p>
          <p className="text-xs text-slate-400">
            Stake:{' '}
            <span className="font-mono text-slate-100">{validator.stake.toFixed(2)} Ξ</span>
          </p>
        </div>
        <div className="flex flex-col items-end text-xs">
          <span
            className={`badge border-0 text-[11px] ${
              validator.status === 'slashed'
                ? 'bg-red-500/30 text-red-100'
                : 'bg-emerald-500/20 text-emerald-200'
            }`}
          >
            {validator.status === 'slashed' ? 'Đã bị slash' : 'Hoạt động'}
          </span>
          <span className="mt-1 font-mono text-[11px] text-cyan-300">
            {(validator.probability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-3 space-y-2">
        <div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Trọng số stake hiệu dụng</span>
            <span className="font-mono text-slate-200">
              {validator.effectiveStake.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-800/80">
            <div
              className={`h-full rounded-full ${
                validator.status === 'slashed'
                  ? 'bg-gradient-to-r from-red-400 to-orange-400'
                  : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'
              }`}
              style={{ width: `${stakePercent}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Phần thưởng</span>
          <span className="font-mono text-amber-200">
            +{validator.rewards.toFixed(4)} Ξ
          </span>
        </div>
      </div>
    </motion.div>
  );
}


