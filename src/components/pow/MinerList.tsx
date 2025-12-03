import type { Miner } from '../../types/pow';
import { MinerCard } from './MinerCard';

type Props = {
  miners: Miner[];
  latestWinnerId?: string;
  onToggleMiner: (id: string) => void;
};

export function MinerList({ miners, latestWinnerId, onToggleMiner }: Props) {
  return (
    <div className="flex h-full flex-col gap-2 text-sm md:text-base">
      <div className="flex items-center justify-between text-slate-300">
        <span className="font-semibold">Danh sách thợ đào</span>
        <span className="text-[11px] text-slate-400">
          Đang bật {miners.filter((m) => m.active).length}/{miners.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {miners.map((miner) => (
          <button
            key={miner.id}
            type="button"
            onClick={() => onToggleMiner(miner.id)}
            className="w-full text-left"
          >
            <MinerCard miner={miner} isWinner={latestWinnerId === miner.id} />
          </button>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        Nhấn vào thẻ thợ đào để bật/tắt. Thợ đào tắt sẽ không tham gia cuộc đua khối.
      </p>
    </div>
  );
}


