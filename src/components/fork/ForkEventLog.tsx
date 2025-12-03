import type { ForkEvent } from '../../types/fork';

type Props = {
  events: ForkEvent[];
};

const typeLabel: Record<ForkEvent['type'], { label: string; className: string }> = {
  block: { label: 'BLOCK', className: 'badge-primary' },
  fork: { label: 'FORK', className: 'badge-warning' },
  reorg: { label: 'RE-ORG', className: 'badge-success' },
  orphan: { label: 'ORPHAN', className: 'badge-error' },
  node: { label: 'NODE', className: 'badge-info' },
  latency: { label: 'LAT', className: 'badge-accent' },
};

export function ForkEventLog({ events }: Props) {
  const latest = [...events].slice(-40).reverse();

  return (
    <div className="glass-panel flex h-full flex-col rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base">
      <p className="mb-2 text-sm font-semibold text-slate-100">Nhật ký sự kiện fork</p>
      <div className="flex-1 overflow-y-auto pr-1">
        {latest.length === 0 && (
          <p className="text-xs text-slate-500">
            Chưa có sự kiện nào. Hãy bắt đầu mô phỏng hoặc trigger fork để xem log.
          </p>
        )}
        <ul className="space-y-1 text-xs">
          {latest.map((ev) => {
            const info = typeLabel[ev.type];
            return (
              <li
                key={ev.id}
                className="flex items-start gap-2 rounded-xl bg-slate-900/70 px-2 py-1.5"
              >
                <span className={`badge badge-xs mt-[2px] ${info.className}`}>
                  {info.label}
                </span>
                <div className="flex-1">
                  <p className="text-slate-200">{ev.message}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


