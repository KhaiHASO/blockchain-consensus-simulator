import type { Validator } from '../../types/pos';
import { ValidatorCard } from './ValidatorCard';

type Props = {
  validators: Validator[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export function ValidatorList({ validators, selectedId, onSelect }: Props) {
  const activeCount = validators.filter((v) => v.status === 'active').length;
  const totalStake = validators.reduce((acc, v) => acc + v.stake, 0);

  return (
    <div className="flex h-full flex-col gap-2 text-sm md:text-base">
      <div className="flex items-center justify-between text-slate-200">
        <div>
          <p className="font-semibold">Danh sách validator</p>
          <p className="text-xs text-slate-400">
            Đang hoạt động {activeCount}/{validators.length}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Tổng stake</p>
          <p className="font-mono text-slate-100">{totalStake.toFixed(2)} Ξ</p>
        </div>
      </div>
      <div className="mt-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {validators.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect?.(v.id)}
            className="w-full text-left"
          >
            <ValidatorCard validator={v} isSelected={selectedId === v.id} />
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Nhấn vào validator để chỉnh stake hoặc trigger slashing từ bảng điều khiển.
      </p>
    </div>
  );
}


