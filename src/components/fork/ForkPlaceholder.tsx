import { motion } from 'framer-motion';

export function ForkPlaceholder() {
  return (
    <motion.div
      className="glass-panel rounded-3xl border border-pink-500/40 p-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="mb-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-pink-300/80">
        Task 3 – Xem trước
      </p>
      <h1 className="bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-xl font-semibold text-transparent">
        Mô phỏng giải quyết fork
      </h1>
      <p className="mt-3 text-sm text-slate-300 md:text-base">
        Màn hình này sẽ hiển thị việc chuỗi bị chia nhánh, các nhánh cạnh tranh và cách giao thức chọn chuỗi hợp lệ.
      </p>
      <p className="mt-3 text-sm text-slate-400 md:text-base">
        Layout và navigation đã có sẵn. Mô phỏng tăng trưởng chuỗi, re-org và quy tắc chọn fork sẽ được làm ở task sau.
      </p>
    </motion.div>
  );
}


