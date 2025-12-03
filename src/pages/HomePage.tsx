import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <motion.section
        className="glass-panel neon-border-cyan rounded-3xl px-6 py-6 md:px-8 md:py-7 text-sm md:text-base"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/70">
              Phòng thí nghiệm tương tác
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
              Trình mô phỏng cơ chế đồng thuận blockchain
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
              Khám phá cách các cơ chế đồng thuận hoạt động trong những kịch bản trực quan.
              Task 1 tập trung vào mô phỏng cuộc đua đào khối của Proof of Work.
            </p>
          </div>
          <div className="mt-3 flex gap-3 md:mt-0">
            <Link to="/pow" className="btn btn-primary btn-sm md:btn-md rounded-full text-sm md:text-base">
              Mở trình mô phỏng PoW
            </Link>
            <Link
              to="/pos"
              className="btn btn-outline btn-sm md:btn-md rounded-full border-purple-500 text-purple-200 text-sm md:text-base"
            >
              Sắp có: PoS
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        <motion.div
          className="glass-panel rounded-2xl border border-cyan-500/40 p-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Task 1
          </p>
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Mô phỏng Proof of Work
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Quan sát cuộc đua đào khối, điều chỉnh độ khó và thời gian tạo block với nhiều thợ đào giả lập.
          </p>
          <Link to="/pow" className="btn btn-link btn-xs mt-2 px-0 text-cyan-300 text-sm">
            Mở dashboard PoW
          </Link>
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl border border-purple-500/40 p-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-purple-300/80">
            Task 2
          </p>
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Mô phỏng Proof of Stake
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Placeholder cho mô phỏng chọn leader theo cổ phần, hiệu suất validator và phần thưởng.
          </p>
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl border border-pink-500/40 p-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          <p className="mb-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-pink-300/80">
            Task 3
          </p>
          <h2 className="text-sm md:text-base font-semibold text-slate-50">
            Mô phỏng giải quyết fork
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Placeholder cho việc hiển thị chia nhánh chuỗi, re-org và quy tắc chọn chuỗi dài nhất.
          </p>
        </motion.div>
      </section>
    </div>
  );
}


