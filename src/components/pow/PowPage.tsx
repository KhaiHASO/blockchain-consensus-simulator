import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { usePowSimulation } from '../../hooks/usePowSimulation';
import { MinerList } from './MinerList';
import { MiningCanvas } from './MiningCanvas';
import { DifficultyBar } from './DifficultyBar';
import { BlockResult } from './BlockResult';
import { PowControls } from './PowControls';

export function PowPage() {
  const {
    miners,
    isRunning,
    difficulty,
    targetBlockTime,
    attemptsPerSecond,
    attemptsTotal,
    latestBlock,
    blockHistory,
    hashrateHistory,
    reset,
    toggleMinerActive,
    setScenario,
    setDifficulty,
    setTargetBlockTime,
    setRunning,
  } = usePowSimulation();

  const latestWinnerId = latestBlock?.minerId;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <motion.section
        className="glass-panel neon-border-cyan rounded-3xl px-4 py-4 md:px-6 md:py-5 text-sm md:text-base"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
              Task 1
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
              Mô phỏng đào khối Proof of Work
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300 md:text-base">
              Quan sát nhiều thợ đào chạy đua tìm nonce hợp lệ, điều chỉnh độ khó theo thời gian thực
              với hash giả lập kiểu SHA-256 và độ trễ block biến thiên tự nhiên.
            </p>
          </div>
          <div className="mt-2 flex gap-2 md:mt-0">
            <span className="badge badge-sm border border-cyan-400/60 bg-cyan-500/10 text-sm text-cyan-200">
              Dữ liệu giả lập, hành vi giống thực tế
            </span>
            <span className="badge badge-sm border border-purple-400/60 bg-purple-500/10 text-sm text-purple-200">
              Chỉ frontend (chưa có backend)
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <MinerList
            miners={miners}
            latestWinnerId={latestWinnerId}
            onToggleMiner={toggleMinerActive}
          />
        </div>
        <div className="md:col-span-3 flex flex-col gap-3">
          <MiningCanvas
            miners={miners}
            attemptsPerSecond={attemptsPerSecond}
            attemptsTotal={attemptsTotal}
            difficulty={difficulty}
            isRunning={isRunning}
          />
          <DifficultyBar difficulty={difficulty} targetBlockTime={targetBlockTime} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <PowControls
            isRunning={isRunning}
            difficulty={difficulty}
            targetBlockTime={targetBlockTime}
            onStart={() => setRunning(true)}
            onPause={() => setRunning(false)}
            onReset={reset}
            onDifficultyChange={setDifficulty}
            onTargetBlockTimeChange={setTargetBlockTime}
            onScenarioChange={setScenario}
          />
        </div>
        <div className="md:col-span-3">
          <BlockResult block={latestBlock ?? null} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base">
          <p className="mb-2 text-sm md:text-base font-semibold text-slate-100">Lịch sử thời gian tạo block</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={blockHistory.map((b) => ({
                  height: b.height,
                  blockTime: b.blockTimeSeconds,
                  difficulty: b.difficulty,
                }))}
                margin={{ left: -22, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="blockTimeGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="height" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => `${v}s`}
                  domain={[3, 20]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid rgba(148, 163, 184, 0.4)',
                    fontSize: 11,
                  }}
                  labelFormatter={(label) => `Block #${label}`}
                  formatter={(value: number) => [`${value.toFixed(2)}s`, 'Thời gian block']}
                />
                <Area
                  type="monotone"
                  dataKey="blockTime"
                  stroke="#22d3ee"
                  strokeWidth={1.5}
                  fill="url(#blockTimeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base">
          <p className="mb-2 text-sm md:text-base font-semibold text-slate-100">Xu hướng độ khó & hashrate</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={blockHistory.map((b, idx) => ({
                  height: b.height,
                  difficulty: b.difficulty,
                  hashrate: hashrateHistory[idx]?.hashrate ?? 0,
                }))}
                margin={{ left: -22, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="difficultyGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="hashrateGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="height" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)} MH/s`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid rgba(148, 163, 184, 0.4)',
                    fontSize: 11,
                  }}
                  labelFormatter={(label) => `Block #${label}`}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="difficulty"
                  stroke="#a855f7"
                  strokeWidth={1.4}
                  fill="url(#difficultyGradient)"
                  name="Độ khó"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="hashrate"
                  stroke="#22c55e"
                  strokeWidth={1.2}
                  fill="url(#hashrateGradient)"
                  name="Hashrate mạng"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}


