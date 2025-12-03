import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import type { PosSlotSelection, SlashingEvent, Validator } from '../../types/pos';

type Props = {
  validators: Validator[];
  selectionHistory: PosSlotSelection[];
  slashingEvents: SlashingEvent[];
};

const COLORS = ['#22d3ee', '#a855f7', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#ec4899'];

export function PosCharts({ validators, selectionHistory, slashingEvents }: Props) {
  const stakeData = validators.map((v, idx) => ({
    name: v.name,
    value: v.stake,
    color: COLORS[idx % COLORS.length],
  }));

  const probData = validators.map((v, idx) => ({
    name: v.name,
    value: v.probability * 100,
    color: COLORS[idx % COLORS.length],
  }));

  const rewardData = selectionHistory.map((s, idx) => ({
    idx,
    label: `E${s.epoch}-S${s.slot}`,
    validatorName: s.validatorName,
    reward: s.reward,
  }));

  const epochMapData = selectionHistory.map((s) => ({
    label: `E${s.epoch}-S${s.slot}`,
    validator: s.validatorName,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
      <div className="glass-panel rounded-3xl border border-purple-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">Phân bố stake</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stakeData}
                dataKey="value"
                nameKey="name"
                innerRadius={36}
                outerRadius={64}
                paddingAngle={3}
              >
                {stakeData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  fontSize: 11,
                }}
                formatter={(value: number, _name, item) => [
                  `${value.toFixed(2)} Ξ`,
                  item?.payload?.name ?? 'Stake',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-cyan-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Xác suất được chọn theo stake (%)
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={probData}
              margin={{ left: -20, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  fontSize: 11,
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Xác suất']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {probData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-emerald-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Lịch sử phần thưởng theo block
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rewardData} margin={{ left: -20, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval={Math.max(0, Math.floor(rewardData.length / 8) - 1)}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  fontSize: 11,
                }}
                formatter={(value: number, _name, item) => [
                  `${value.toFixed(4)} Ξ`,
                  item?.payload?.validatorName ?? 'Reward',
                ]}
              />
              <Line
                type="monotone"
                dataKey="reward"
                stroke="#22c55e"
                strokeWidth={1.6}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-pink-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Bản đồ proposer theo epoch/slot
        </p>
        <div className="h-48 overflow-x-auto">
          <div className="grid auto-cols-max grid-flow-col gap-2 text-[11px] text-slate-300">
            {epochMapData.map((e) => (
              <div
                key={e.label + e.validator}
                className="min-w-[80px] rounded-xl bg-slate-900/70 px-2 py-1"
              >
                <p className="font-mono text-[10px] text-slate-400">{e.label}</p>
                <p className="truncate text-xs text-slate-100">{e.validator}</p>
              </div>
            ))}
          </div>
          {slashingEvents.length > 0 && (
            <div className="mt-3 border-t border-red-500/40 pt-2 text-xs text-red-200">
              <p className="mb-1 font-semibold">Sự kiện slashing gần đây</p>
              <ul className="space-y-1">
                {slashingEvents.slice(-3).map((ev) => (
                  <li key={ev.id} className="flex justify-between gap-2">
                    <span className="truncate">
                      {ev.validatorName} • đốt {ev.burnedAmount.toFixed(3)} Ξ
                    </span>
                    <span className="font-mono text-[10px] text-red-300">
                      E{ev.epoch}-S{ev.slot}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


