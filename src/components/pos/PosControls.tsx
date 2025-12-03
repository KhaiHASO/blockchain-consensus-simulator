import { useState } from 'react';

type Props = {
  isEpochRunning: boolean;
  currentEpoch: number;
  currentSlot: number;
  slotsPerEpoch: number;
  onStartEpoch: () => void;
  onPauseEpoch: () => void;
  onProposeBlock: () => void;
  onReset: () => void;
  onTriggerSlashing: () => void;
  onAddValidator: (name: string, avatar: string, stake: number) => void;
  onUpdateStake: (id: string, stake: number) => void;
  selectedValidatorId?: string | null;
};

const AVATAR_CHOICES = ['🟣', '🔵', '🟢', '⚡', '🛰️', '💠'];

export function PosControls({
  isEpochRunning,
  currentEpoch,
  currentSlot,
  slotsPerEpoch,
  onStartEpoch,
  onPauseEpoch,
  onProposeBlock,
  onReset,
  onTriggerSlashing,
  onAddValidator,
  onUpdateStake,
  selectedValidatorId,
}: Props) {
  const [newName, setNewName] = useState('Validator mới');
  const [newStake, setNewStake] = useState(80);
  const [newAvatar, setNewAvatar] = useState(AVATAR_CHOICES[0]);
  const [editStake, setEditStake] = useState(100);

  const progress =
    slotsPerEpoch > 0 ? Math.min(100, (currentSlot / slotsPerEpoch) * 100) : 0;

  const handleAddValidator = () => {
    if (!newName.trim() || newStake <= 0) return;
    onAddValidator(newName.trim(), newAvatar, newStake);
  };

  const handleUpdateStake = () => {
    if (!selectedValidatorId || editStake <= 0) return;
    onUpdateStake(selectedValidatorId, editStake);
  };

  return (
    <div className="glass-panel flex h-full flex-col gap-3 rounded-3xl border border-purple-600/60 p-4 text-sm md:text-base">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-purple-300/80">
            Điều khiển PoS
          </p>
          <p className="text-sm font-semibold text-slate-100">
            Epoch #{currentEpoch} • Slot {currentSlot || 0}/{slotsPerEpoch}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={isEpochRunning ? onPauseEpoch : onStartEpoch}
            className={`btn btn-sm rounded-full ${
              isEpochRunning ? 'btn-error' : 'btn-success'
            }`}
          >
            {isEpochRunning ? 'Tạm dừng epoch' : 'Chạy epoch'}
          </button>
          <button
            type="button"
            onClick={onProposeBlock}
            className="btn btn-sm rounded-full border border-cyan-500/70 bg-cyan-500/10 text-cyan-200"
          >
            Propose block đơn
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

      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-300">
          <span>Tiến độ epoch</span>
          <span>
            Slot {currentSlot || 0}/{slotsPerEpoch}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-800/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-200">
            Thêm validator giả lập
          </p>
          <label className="form-control w-full">
            <span className="label-text text-xs text-slate-300">
              Tên validator
            </span>
            <input
              className="input input-sm input-bordered bg-slate-900/70 text-sm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text text-xs text-slate-300">
              Stake ban đầu (Ξ)
            </span>
            <input
              type="number"
              min={5}
              max={500}
              className="input input-sm input-bordered bg-slate-900/70 text-sm"
              value={newStake}
              onChange={(e) => setNewStake(Number(e.target.value))}
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text text-xs text-slate-300">
              Biểu tượng
            </span>
            <select
              className="select select-sm select-bordered bg-slate-900/70 text-sm"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
            >
              {AVATAR_CHOICES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleAddValidator}
            className="btn btn-sm mt-1 w-full rounded-full border border-purple-500/70 bg-purple-600/30 text-purple-50"
          >
            Thêm validator
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-200">
            Chỉnh stake / Slashing demo
          </p>
          <label className="form-control w-full">
            <span className="label-text text-xs text-slate-300">
              Stake mới cho validator đang chọn (Ξ)
            </span>
            <input
              type="number"
              min={1}
              max={500}
              className="input input-sm input-bordered bg-slate-900/70 text-sm"
              value={editStake}
              onChange={(e) => setEditStake(Number(e.target.value))}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUpdateStake}
              disabled={!selectedValidatorId}
              className="btn btn-sm flex-1 rounded-full border border-emerald-500/70 bg-emerald-500/20 text-emerald-100 disabled:opacity-40"
            >
              Cập nhật stake
            </button>
            <button
              type="button"
              onClick={onTriggerSlashing}
              disabled={!selectedValidatorId}
              className="btn btn-sm flex-1 rounded-full border border-red-500/70 bg-red-600/20 text-red-100 disabled:opacity-40"
            >
              Trigger slashing demo
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Slashing sẽ đốt khoảng 30% stake, đặt trạng thái validator thành
            "slashed" và loại khỏi chọn block tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}


