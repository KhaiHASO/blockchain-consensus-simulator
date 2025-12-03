type Props = {
  difficulty: number;
  targetBlockTime: number;
};

export function DifficultyBar({ difficulty, targetBlockTime }: Props) {
  const normalized = Math.min(1, difficulty / 5);

  return (
    <div className="glass-panel rounded-2xl border border-slate-700/80 p-3 text-sm md:text-base">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-100">Độ khó</span>
        <span className="font-mono text-[12px] text-cyan-300">{difficulty.toFixed(2)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-800/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500"
          style={{ width: `${normalized * 100}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-slate-400">
        <span>Dễ</span>
        <span>Khó</span>
      </div>
      <p className="mt-2 text-[12px] text-slate-400">
        Thời gian block mục tiêu:{' '}
        <span className="text-slate-200">{targetBlockTime.toFixed(1)}s</span>
      </p>
    </div>
  );
}


