import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { PowPage } from '../pages/PowPage';
import { PosPage } from '../pages/PosPage';
import { ForkPage } from '../pages/ForkPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-main">
        <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-base-300/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 text-sm md:text-base">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 neon-border-cyan" />
              <div>
                <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan-300/70">
                  Trình mô phỏng
                </p>
                <p className="text-sm md:text-base font-semibold text-slate-100">
                  Phòng thí nghiệm đồng thuận blockchain
                </p>
              </div>
            </div>
            <nav className="flex gap-2 text-sm md:text-base">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `btn btn-ghost btn-xs md:btn-sm rounded-full border border-transparent px-3 md:px-4 ${
                    isActive ? 'border-cyan-400 text-cyan-300' : 'text-slate-300'
                  }`
                }
              >
                Tổng quan
              </NavLink>
              <NavLink
                to="/pow"
                className={({ isActive }) =>
                  `btn btn-ghost btn-xs md:btn-sm rounded-full border border-transparent px-3 md:px-4 ${
                    isActive ? 'border-cyan-400 text-cyan-300' : 'text-slate-300'
                  }`
                }
              >
                Bằng chứng công việc (PoW)
              </NavLink>
              <NavLink
                to="/pos"
                className={({ isActive }) =>
                  `btn btn-ghost btn-xs md:btn-sm rounded-full border border-transparent px-3 md:px-4 ${
                    isActive ? 'border-purple-400 text-purple-300' : 'text-slate-300'
                  }`
                }
              >
                Bằng chứng cổ phần (PoS)
              </NavLink>
              <NavLink
                to="/fork"
                className={({ isActive }) =>
                  `btn btn-ghost btn-xs md:btn-sm rounded-full border border-transparent px-3 md:px-4 ${
                    isActive ? 'border-pink-400 text-pink-300' : 'text-slate-300'
                  }`
                }
              >
                Giải quyết fork
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-8 pt-4 md:px-4 md:pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pow" element={<PowPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/fork" element={<ForkPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


