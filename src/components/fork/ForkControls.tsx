import type { SimulationSpeed } from '../../store/forkStore';

type Props = {
  isRunning: boolean;
  simulationSpeed: SimulationSpeed;
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onTriggerFork: () => void;
  onReset: () => void;
  onSetSpeed: (speed: SimulationSpeed) => void;
};

export function ForkControls({
  isRunning,
  simulationSpeed,
  onStart,
  onPause,
  onStep,
  onTriggerFork,
  onReset,
  onSetSpeed,
}: Props) {
  return (
    <div className="glass-panel flex h-full flex-col gap-3 rounded-3xl border border-cyan-600/60 p-4 text-sm md:text-base">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
            Điều khiển fork
          </p>
          <p className="text-sm font-semibold text-slate-100">
            Mô phỏng độ trễ mạng & fork/re-org
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={isRunning ? onPause : onStart}
            className={`btn btn-sm rounded-full ${
              isRunning ? 'btn-error' : 'btn-success'
            }`}
          >
            {isRunning ? 'Tạm dừng' : 'Bắt đầu mô phỏng'}
          </button>
          <button
            type="button"
            onClick={onStep}
            className="btn btn-sm rounded-full border border-slate-600 bg-slate-900/60"
          >
            Produce 1 block
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-sm rounded-full border border-slate-600 bg-slate-900/60"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span>Tốc độ mô phỏng</span>
        <div className="join rounded-full border border-slate-700/80 bg-slate-900/70">
          <button
            type="button"
            onClick={() => onSetSpeed('slow')}
            className={`join-item btn btn-xs rounded-full ${
              simulationSpeed === 'slow'
                ? 'btn-primary'
                : 'btn-ghost text-slate-300'
            }`}
          >
            Chậm
          </button>
          <button
            type="button"
            onClick={() => onSetSpeed('normal')}
            className={`join-item btn btn-xs rounded-full ${
              simulationSpeed === 'normal'
                ? 'btn-primary'
                : 'btn-ghost text-slate-300'
            }`}
          >
            Bình thường
          </button>
          <button
            type="button"
            onClick={() => onSetSpeed('fast')}
            className={`join-item btn btn-xs rounded-full ${
              simulationSpeed === 'fast'
                ? 'btn-primary'
                : 'btn-ghost text-slate-300'
            }`}
          >
            Nhanh
          </button>
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-2 text-xs text-slate-300">
        <p className="font-semibold text-slate-200">Tạo fork thủ công</p>
        <p>
          Bấm nút dưới để ép 2 block cạnh tranh xuất hiện cùng height trên các
          nhánh khác nhau, minh hoạ việc mạng bị chia nhánh.
        </p>
        <button
          type="button"
          onClick={onTriggerFork}
          className="btn btn-sm w-full rounded-full border border-pink-500/70 bg-pink-600/30 text-pink-50"
        >
          Trigger fork (2 block cùng height)
        </button>
      </div>
    </div>
  );
}


