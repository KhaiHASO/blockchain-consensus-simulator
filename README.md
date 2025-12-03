## Blockchain Consensus Simulator

Ứng dụng frontend mô phỏng **3 cơ chế/khía cạnh đồng thuận blockchain** với giao diện cyberpunk:

- **Task 1 – Proof of Work (PoW)**: cuộc đua đào khối, độ khó, thời gian block.  
- **Task 2 – Proof of Stake (PoS)**: validator, stake, epoch/slot, slashing.  
- **Task 3 – Fork Resolution**: fork, re-org, orphan block, longest-chain rule.

Toàn bộ đều là **mô phỏng FE-only (không backend)**, dùng dữ liệu giả nhưng hành vi được thiết kế giống thực tế ở mức trực quan.

---

## 1. Yêu cầu môi trường

- Node.js (khuyến nghị: LTS, ≥ 18)
- npm (đi kèm Node)

---

## 2. Cách chạy dự án

Trong thư mục `blockchain-consensus-simulator`:

```bash
npm install
npm run dev
```

Sau đó mở trình duyệt và truy cập địa chỉ Vite in ra (mặc định: `http://localhost:5173`).

### Scripts hữu ích

- `npm run dev` – chạy dev server (HMR).  
- `npm run build` – build bản production.  
- `npm run preview` – chạy thử bản build.

---

## 3. Công nghệ & kiến trúc

- **Vite + React + TypeScript** – khởi tạo & build.  
- **TailwindCSS + DaisyUI** – styling theme dark/cyberpunk, glassmorphism, neon.  
- **React Router** – routing: Home / PoW / PoS / Fork.  
- **Zustand** – state management cho từng simulator (PoW, PoS, Fork).  
- **Framer Motion** – animation (card, panel, toast, tree).  
- **Recharts** – biểu đồ thống kê.  
- **SVG (D3-style)** – vẽ cây fork (Fork Resolution).

Kiến trúc chia theo domain:

- `src/pages` – các trang cấp cao (`HomePage`, `PowPage`, `PosPage`, `ForkPage`).  
- `src/components/pow` – UI/logic hiển thị riêng cho PoW.  
- `src/components/pos` – UI/logic hiển thị riêng cho PoS.  
- `src/components/fork` – UI/logic hiển thị riêng cho Fork Resolution.  
- `src/store` – Zustand stores: `powStore`, `posStore`, `forkStore`.  
- `src/hooks` – hooks mô phỏng: `usePowSimulation`, `usePosSimulation`, `useForkSimulation`.  
- `src/utils` – helper sinh dữ liệu giả (miners, validators, chain...).  
- `src/types` – định nghĩa type dùng chung cho từng domain.

---

## 4. Tổng quan từng simulator

### 4.1. Proof of Work Simulator (Task 1)

Route: **`/pow`**  
Thư mục chính: `src/components/pow`, `src/store/powStore.ts`, `src/hooks/usePowSimulation.ts`.

Tính năng:

- **Miner dashboard**: danh sách thợ đào (hashrate 5–200 MH/s, speed, trạng thái, shares).  
- **Mining race panel**: hoạt ảnh nhiều miner “chạy” theo hashrate, tổng H/s, tổng số hash thử.  
- **Control panel**:
  - Start / Pause / Reset.  
  - Điều chỉnh **difficulty** & **target block time**.  
  - Các demo scenario (fastest-wins, slow-miner-luck, difficulty quá cao/thấp).  
- **Block result**: block mới nhất (height, miner thắng, nonce, hash 64 hex, thời gian block).  
- **Charts**:
  - Lịch sử thời gian block.  
  - Độ khó & hashrate theo height.  
- Fake data: miner, nonce, hash, block time được sinh động theo xác suất, nhưng vẫn “trông thật”.

### 4.2. Proof of Stake Simulator (Task 2)

Route: **`/pos`**  
Thư mục chính: `src/components/pos`, `src/store/posStore.ts`, `src/hooks/usePosSimulation.ts`.

Tính năng:

- **Danh sách validator**: tên, emoji avatar, stake, effective stake, xác suất được chọn, rewards, trạng thái (`active`/`slashed`).  
- **Epoch & slot**:
  - Mỗi epoch có 32 slot.  
  - Với mỗi slot, chọn proposer dựa trên stake-weighted random.  
- **Control panel**:
  - Start/Pause epoch.  
  - Propose block đơn.  
  - Reset mô phỏng.  
  - Thêm validator mới (tên, stake, emoji).  
  - Chỉnh stake validator đang chọn.  
  - Trigger **slashing demo** (đốt ~30% stake, set `slashed`, loại khỏi selection).  
- **Charts**:
  - Pie chart phân bố stake.  
  - Bar chart probability (%).  
  - Line chart lịch sử reward.  
  - Epoch/slot proposer map + log slashing gần đây.

### 4.3. Fork Resolution Simulator (Task 3)

Route: **`/fork`**  
Thư mục chính: `src/components/fork`, `src/store/forkStore.ts`, `src/hooks/useForkSimulation.ts`, `src/utils/fakeChain.ts`.

Tính năng:

- **Node list**:
  - Mỗi node có latency (10–500ms), mining speed, trạng thái online/offline, height, branch.  
  - Có nút random hoá latency toàn mạng.  
  - Node sáng/pulse khi vừa tạo block.  
- **Cây fork (`ForkTree`)**:
  - Vẽ chuỗi block canonical & các nhánh fork trên SVG.  
  - Chuỗi canonical sáng (neon xanh), nhánh phụ tím/hồng, orphan cam/đỏ mờ.  
  - Animation cho block mới & đường nối.  
- **Fork controls**:
  - Start/Pause simulation.  
  - Produce 1 block (step-by-step).  
  - Trigger fork (ép 2 block cùng height).  
  - Reset.  
  - Chọn tốc độ: slow / normal / fast.  
- **Event log**:
  - Ghi lại: block mới, fork, re-org, orphan, node online/offline, thay đổi latency.  
- **Charts**:
  - Orphan rate theo height.  
  - Độ dài các nhánh A/B/C.  
  - Số block được tạo bởi mỗi node.  
  - Phân bố latency các node.  
- **Re-org animation**:
  - Khi chuỗi dài nhất thay đổi, hiển thị toast “Re-org detected” với mô tả nhánh thắng.

---

## 5. Điều hướng & trải nghiệm người dùng

- **Home (`/`)**:
  - Giới thiệu dự án.  
  - 3 card tóm tắt: PoW, PoS, Fork Resolution.  
  - Nút truy cập nhanh từng simulator.  
- **Header chung**:
  - Logo + tiêu đề “Phòng thí nghiệm đồng thuận blockchain”.  
  - Tabs: Tổng quan / PoW / PoS / Fork.  
- Toàn bộ UI dùng ngôn ngữ **tiếng Việt**, chữ được tăng size để dễ đọc, với hiệu ứng neon/cyberpunk đồng nhất giữa 3 task.

