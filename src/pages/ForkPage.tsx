import { motion } from 'framer-motion';
import { useForkSimulation } from '../hooks/useForkSimulation';
import { NodeList } from '../components/fork/NodeList';
import { ForkTree } from '../components/fork/ForkTree';
import { ForkControls } from '../components/fork/ForkControls';
import { ForkEventLog } from '../components/fork/ForkEventLog';
import { ForkCharts } from '../components/fork/ForkCharts';
import { ReorgAnimation } from '../components/fork/ReorgAnimation';

export function ForkPage() {
  const {
    nodes,
    branches,
    blocks,
    canonicalChain,
    orphans,
    events,
    isRunning,
    simulationSpeed,
    reset,
    start,
    pause,
    setSpeed,
    toggleNodeOnline,
    updateLatency,
    updateMiningSpeed,
    randomizeLatencies,
    produceBlock,
    triggerFork,
  } = useForkSimulation();

  const lastBlock = blocks[blocks.length - 1];
  const producingNodeId = lastBlock?.producerNodeId ?? null;
  const lastReorgEvent =
    [...events].reverse().find((e) => e.type === 'reorg') ?? null;

  return (
    <div className="relative flex flex-1 flex-col gap-4">
      <ReorgAnimation lastReorgEvent={lastReorgEvent} />

      <motion.section
        className="glass-panel neon-border-purple rounded-3xl px-4 py-4 md:px-6 md:py-5 text-sm md:text-base"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-pink-300/80">
              Task 3
            </p>
            <h1 className="bg-gradient-to-r from-pink-300 via-purple-400 to-cyan-300 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
              Mô phỏng giải quyết fork & re-org
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300 md:text-base">
              Minh hoạ mạng blockchain phân tán khi nhiều node tạo block cạnh tranh, xuất hiện
              fork, chọn chuỗi dài nhất (Longest Chain Rule) và các block bị orphan sau re-org.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
            <span className="badge badge-sm border border-pink-400/60 bg-pink-500/10 text-sm text-pink-200">
              Longest chain rule
            </span>
            <span className="badge badge-sm border border-cyan-400/60 bg-cyan-500/10 text-sm text-cyan-200">
              Forks • Orphans • Re-org
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <NodeList
            nodes={nodes}
            producingNodeId={producingNodeId}
            onToggleOnline={toggleNodeOnline}
            onLatencyChange={updateLatency}
            onSpeedChange={updateMiningSpeed}
            onRandomizeLatency={randomizeLatencies}
          />
        </div>
        <div className="md:col-span-3 flex flex-col gap-3">
          <ForkTree branches={branches} blocks={[...canonicalChain, ...orphans]} />
          <ForkControls
            isRunning={isRunning}
            simulationSpeed={simulationSpeed}
            onStart={start}
            onPause={pause}
            onStep={() => produceBlock(nodes[0]?.id)}
            onTriggerFork={triggerFork}
            onReset={reset}
            onSetSpeed={setSpeed}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <ForkEventLog events={events} />
        </div>
        <div className="md:col-span-3">
          <ForkCharts
            nodes={nodes}
            branches={branches}
            blocks={blocks}
            events={events}
          />
        </div>
      </section>
    </div>
  );
}

