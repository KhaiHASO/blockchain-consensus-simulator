import type { ForkNode } from '../../types/fork';
import { NodeCard } from './NodeCard';

type Props = {
  nodes: ForkNode[];
  producingNodeId?: string | null;
  onToggleOnline: (id: string) => void;
  onLatencyChange: (id: string, value: number) => void;
  onSpeedChange: (id: string, value: number) => void;
  onRandomizeLatency: () => void;
};

export function NodeList({
  nodes,
  producingNodeId,
  onToggleOnline,
  onLatencyChange,
  onSpeedChange,
  onRandomizeLatency,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-2 text-sm md:text-base">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-100">Nút mạng phân tán</p>
          <p className="text-xs text-slate-400">
            Mỗi node có độ trễ mạng và tốc độ tạo block khác nhau.
          </p>
        </div>
        <button
          type="button"
          onClick={onRandomizeLatency}
          className="btn btn-xs rounded-full border border-cyan-500/70 bg-cyan-500/10 text-[11px] text-cyan-200"
        >
          Random latency
        </button>
      </div>
      <div className="mt-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {nodes.map((n) => (
          <NodeCard
            key={n.id}
            node={n}
            isProducing={producingNodeId === n.id}
            onToggleOnline={() => onToggleOnline(n.id)}
            onLatencyChange={(v) => onLatencyChange(n.id, v)}
            onSpeedChange={(v) => onSpeedChange(n.id, v)}
          />
        ))}
      </div>
    </div>
  );
}


