import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePosSimulation } from '../hooks/usePosSimulation';
import { ValidatorList } from '../components/pos/ValidatorList';
import { PosControls } from '../components/pos/PosControls';
import { PosCharts } from '../components/pos/PosCharts';

export function PosPage() {
  const {
    validators,
    isEpochRunning,
    currentEpoch,
    currentSlot,
    slotsPerEpoch,
    selectedValidator,
    latestSelection,
    selectionHistory,
    slashingEvents,
    resetSimulation,
    proposeBlock,
    startEpoch,
    pauseEpoch,
    slashValidator,
    addValidator,
    updateStake,
  } = usePosSimulation();

  const [focusedValidatorId, setFocusedValidatorId] = useState<string | null>(null);

  const selectedId = focusedValidatorId ?? selectedValidator?.id ?? null;

  const handleAddValidator = (name: string, avatar: string, stake: number) => {
    addValidator({ name, avatar, stake });
  };

  const handleTriggerSlashing = () => {
    if (!selectedId) return;
    slashValidator(selectedId);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <motion.section
        className="glass-panel neon-border-purple rounded-3xl px-4 py-4 md:px-6 md:py-5 text-sm md:text-base"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-purple-300/80">
              Task 2
            </p>
            <h1 className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
              Mô phỏng Proof of Stake
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300 md:text-base">
              Quan sát cách validator được chọn làm proposer dựa trên lượng stake, chạy qua các
              epoch/slot và mô phỏng sự kiện slashing khi validator hành xử không đúng.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
            <span className="badge badge-sm border border-purple-400/60 bg-purple-500/10 text-sm text-purple-200">
              Stake-weighted random selection
            </span>
            <span className="badge badge-sm border border-cyan-400/60 bg-cyan-500/10 text-sm text-cyan-200">
              Epoch &amp; slashing demo
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <ValidatorList
            validators={validators}
            selectedId={selectedId}
            onSelect={(id) => setFocusedValidatorId(id)}
          />
        </div>
        <div className="md:col-span-3">
          <PosControls
            isEpochRunning={isEpochRunning}
            currentEpoch={currentEpoch}
            currentSlot={currentSlot}
            slotsPerEpoch={slotsPerEpoch}
            onStartEpoch={startEpoch}
            onPauseEpoch={pauseEpoch}
            onProposeBlock={proposeBlock}
            onReset={resetSimulation}
            onTriggerSlashing={handleTriggerSlashing}
            onAddValidator={handleAddValidator}
            onUpdateStake={updateStake}
            selectedValidatorId={selectedId}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="glass-panel flex h-full flex-col rounded-3xl border border-slate-700/80 p-4 text-sm md:text-base">
            <p className="mb-2 text-sm font-semibold text-slate-100">Block proposer mới nhất</p>
            {latestSelection ? (
              <div className="space-y-2 text-xs md:text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-400">Epoch/Slot:</span>{' '}
                  <span className="font-mono text-slate-100">
                    E{latestSelection.epoch}-S{latestSelection.slot}
                  </span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Proposer:</span>{' '}
                  <span className="font-semibold text-slate-50">
                    {latestSelection.validatorName}
                  </span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Phần thưởng:</span>{' '}
                  <span className="font-mono text-amber-200">
                    +{latestSelection.reward.toFixed(4)} Ξ
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(latestSelection.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Chưa có block nào được propose. Hãy chạy epoch hoặc bấm "Propose block đơn".
              </p>
            )}
            {selectedValidator && (
              <p className="mt-3 text-xs text-slate-400">
                Validator đang chọn:{' '}
                <span className="font-semibold text-slate-100">{selectedValidator.name}</span>
              </p>
            )}
            {slashingEvents.length > 0 && (
              <div className="mt-3 rounded-2xl border border-red-500/50 bg-red-500/10 p-2 text-xs text-red-100">
                <p className="mb-1 font-semibold">Slashing gần đây</p>
                <ul className="space-y-1">
                  {slashingEvents.slice(-2).map((ev) => (
                    <li key={ev.id} className="flex justify-between gap-2">
                      <span className="truncate">
                        {ev.validatorName} bị đốt {ev.burnedAmount.toFixed(3)} Ξ
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
        <div className="md:col-span-3">
          <PosCharts
            validators={validators}
            selectionHistory={selectionHistory}
            slashingEvents={slashingEvents}
          />
        </div>
      </section>
    </div>
  );
}

