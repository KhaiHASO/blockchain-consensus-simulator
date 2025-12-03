import { motion } from 'framer-motion';

export function PosPlaceholder() {
  return (
    <motion.div
      className="glass-panel rounded-3xl border border-purple-500/40 p-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="mb-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-purple-300/80">
        Task 2 – Xem trước
      </p>
      <h1 className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-xl font-semibold text-transparent">
        Mô phỏng Proof of Stake
      </h1>
      <p className="mt-3 text-sm text-slate-300 md:text-base">
        Màn hình này sẽ chứa mô phỏng đầy đủ cơ chế Proof of Stake: bộ validator, lượng stake và chọn leader theo epoch.
      </p>
      <p className="mt-3 text-sm text-slate-400 md:text-base">
        Routing và layout frontend đã sẵn sàng. Logic chi tiết và phần hiển thị sẽ được bổ sung ở task sau.
      </p>
    </motion.div>
  );
}


