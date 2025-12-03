import type { ScenarioKey } from '../../types/pow';

type Props = {
  isRunning: boolean;
  difficulty: number;
  targetBlockTime: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDifficultyChange: (value: number) => void;
  onTargetBlockTimeChange: (value: number) => void;
  onScenarioChange: (scenario: ScenarioKey | null) => void;
};

const scenarioLabels: { key: ScenarioKey; label: string }[] = [
  { key: 'fastest-wins', label: 'Thợ đào nhanh nhất thường thắng' },
  { key: 'slow-miner-luck', label: 'Thợ đào chậm thắng bất ngờ' },
  { key: 'difficulty-low', label: 'Độ khó quá thấp (block ra quá nhanh)' },
  { key: 'difficulty-high', label: 'Độ khó quá cao (block ra quá chậm)' },
];

export function PowControls({
  isRunning,
  difficulty,
  targetBlockTime,
  onStart,
  onPause,
  onReset,
  onDifficultyChange,
  onTargetBlockTimeChange,
  onScenarioChange,
}: Props) {
  return (
    <div className="glass-panel flex flex-col gap-3 rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-100">Bảng điều khiển</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={isRunning ? onPause : onStart}
            className={`btn btn-sm rounded-full ${
              isRunning ? 'btn-error' : 'btn-success'
            } text-sm md:text-base`}
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu đào'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-sm rounded-full border border-slate-600 bg-slate-900/60 text-sm md:text-base text-slate-200"
          >
            Đặt lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-[13px] text-slate-300">
            <span>Độ khó</span>
            <span className="font-mono text-cyan-300">{difficulty.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.1}
            value={difficulty}
            onChange={(e) => onDifficultyChange(parseFloat(e.target.value))}
            className="range range-xs mt-1 range-primary"
          />
          <div className="mt-1 flex justify-between text-[12px] text-slate-500">
            <span>Thấp</span>
            <span>Cao</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[13px] text-slate-300">
            <span>Thời gian block mục tiêu (giây)</span>
            <span className="font-mono text-amber-200">{targetBlockTime.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={3}
            max={20}
            step={0.5}
            value={targetBlockTime}
            onChange={(e) => onTargetBlockTimeChange(parseFloat(e.target.value))}
            className="range range-xs mt-1 range-secondary"
          />
          <div className="mt-1 flex justify-between text-[12px] text-slate-500">
            <span>3s</span>
            <span>20s</span>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1 text-[13px] font-semibold text-slate-200">Kịch bản demo</p>
        <div className="grid gap-2 md:grid-cols-2">
          {scenarioLabels.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onScenarioChange(s.key)}
              className="btn btn-xs justify-start rounded-2xl border border-slate-600/70 bg-slate-900/40 text-left text-[12px] text-slate-200 hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onScenarioChange(null)}
            className="btn btn-xs justify-start rounded-2xl border border-slate-700/70 bg-slate-950/40 text-left text-[12px] text-slate-300 hover:border-slate-500 hover:bg-slate-800/60"
          >
            Xoá kịch bản (để mô phỏng tự nhiên)
          </button>
        </div>
      </div>
    </div>
  );
}


