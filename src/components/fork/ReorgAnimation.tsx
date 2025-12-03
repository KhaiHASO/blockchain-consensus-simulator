import { AnimatePresence, motion } from 'framer-motion';
import type { ForkEvent } from '../../types/fork';

type Props = {
  lastReorgEvent: ForkEvent | null;
};

export function ReorgAnimation({ lastReorgEvent }: Props) {
  return (
    <AnimatePresence>
      {lastReorgEvent && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-auto glass-panel neon-border-cyan flex max-w-md items-start gap-3 rounded-2xl border border-emerald-400/70 px-4 py-3 text-sm text-emerald-100">
            <div className="mt-1 text-lg">🔄</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                Re-org detected
              </p>
              <p className="text-sm">{lastReorgEvent.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


