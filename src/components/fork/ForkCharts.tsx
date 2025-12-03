import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ForkBlock, ForkBranch, ForkEvent, ForkNode } from '../../types/fork';

type Props = {
  nodes: ForkNode[];
  branches: ForkBranch[];
  blocks: ForkBlock[];
  events: ForkEvent[];
};

export function ForkCharts({ nodes, branches, blocks, events }: Props) {
  const orphanSeries = (() => {
    let orphanCount = 0;
    return blocks
      .filter((b) => b.height > 0)
      .map((b) => {
        if (b.isOrphan) orphanCount += 1;
        return {
          height: b.height,
          orphanRate: orphanCount / blocks.length,
        };
      });
  })();

  const branchSeries = branches.map((b) => ({
    id: b.id,
    label: b.id,
    length: b.length,
  }));

  const nodeBlockCount: Record<string, number> = {};
  blocks.forEach((b) => {
    if (!b.isOrphan && b.height > 0) {
      nodeBlockCount[b.producerNodeId] = (nodeBlockCount[b.producerNodeId] ?? 0) + 1;
    }
  });
  const nodeSeries = nodes.map((n) => ({
    name: n.name,
    blocks: nodeBlockCount[n.id] ?? 0,
  }));

  const latencySeries = nodes.map((n) => ({
    name: n.name,
    latency: n.latencyMs,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
      <div className="glass-panel rounded-3xl border border-emerald-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Orphan rate theo height
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={orphanSeries}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="orphanRateGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="height" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  fontSize: 11,
                }}
                formatter={(value: number) => [
                  `${(value * 100).toFixed(2)}%`,
                  'Orphan rate',
                ]}
                labelFormatter={(label) => `Height #${label}`}
              />
              <Area
                type="monotone"
                dataKey="orphanRate"
                stroke="#f97316"
                strokeWidth={1.6}
                fill="url(#orphanRateGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-purple-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Độ dài các nhánh hiện tại
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={branchSeries}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  fontSize: 11,
                }}
                formatter={(value: number) => [value, 'Độ dài nhánh']}
              />
              <Bar dataKey="length" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-cyan-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Số block được tạo bởi mỗi node
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={nodeSeries}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
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
                formatter={(value: number) => [value, 'Blocks']}
              />
              <Bar dataKey="blocks" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-pink-600/60 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-100">
          Phân bố latency của node
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={latencySeries}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
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
                formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Latency']}
              />
              <Bar dataKey="latency" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


