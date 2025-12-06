# Task 3 – Fork Resolution Simulator 

Trình mô phỏng **Fork Resolution** (giải quyết fork & re-org) : giả lập mạng nhiều node, độ trễ mạng, các nhánh chuỗi cạnh tranh, orphan block và quy tắc Longest Chain.

---

## 1. Tổng quan

Mục tiêu của Task 3:

- Minh hoạ trực quan:
  - Nhiều node tạo block gần như cùng lúc → sinh **fork**.
  - Các nhánh chuỗi (A/B/C) cạnh tranh độ dài.
  - Quy tắc **Longest Chain Rule** chọn chuỗi hợp lệ.
  - Khi chuỗi dài hơn xuất hiện → **re-org**, block cũ trở thành **orphan**.
- Cho phép điều khiển:
  - Bật/tắt node.
  - Thay đổi **latency** & tốc độ “đào” (giả lập PoW mini).
  - Thay đổi tốc độ mô phỏng (slow / normal / fast).
  - Trigger fork thủ công (2 block cùng height).
- Cung cấp biểu đồ & event log để quan sát orphan rate, độ dài nhánh, phân bố block theo node, phân bố latency.

> Dữ liệu là **fake**, nhưng thời gian, height, orphan/re-org đều được sinh ra theo logic giống hành vi blockchain thực tế ở mức trực quan.

---

## 2. Công nghệ sử dụng

- **React + TypeScript**
- **TailwindCSS + DaisyUI** (theme cyberpunk giống Task 1 & 2)
- **Zustand** – state cho node, nhánh chuỗi, block, sự kiện, tốc độ mô phỏng.
- **Framer Motion** – animation cho cây fork, node card, re-org toast.
- **SVG + motion (D3-style)** – vẽ **ForkTree** (cây block).
- **Recharts** – biểu đồ orphan rate, branch length, block per node, latency.
- **React Router** – route `/fork` tích hợp cùng PoW và PoS.

---

## 3. Cấu trúc file chính cho Fork Simulator

- `src/types/fork.ts`  
  Type cho node, block, branch, event.
- `src/utils/fakeChain.ts`  
  Sinh genesis, nhánh, block giả cho các branch.
- `src/store/forkStore.ts`  
  Zustand store: state & action điều khiển mô phỏng fork.
- `src/hooks/useForkSimulation.ts`  
  Hook chạy loop theo tốc độ mô phỏng (slow/normal/fast) và expose state/handlers.
- `src/components/fork/NodeCard.tsx`  
  Card hiển thị 1 node (latency, mining speed, online/offline).
- `src/components/fork/NodeList.tsx`  
  Danh sách node + nút random latency.
- `src/components/fork/ForkTree.tsx`  
  Cây fork (canonical vs branch vs orphan) trên SVG.
- `src/components/fork/ForkControls.tsx`  
  Điều khiển: start/pause, step, trigger fork, reset, đổi tốc độ.
- `src/components/fork/ForkEventLog.tsx`  
  Log sự kiện (block, fork, re-org, orphan, node, latency).
- `src/components/fork/ForkCharts.tsx`  
  Biểu đồ orphan rate, branch length, block per node, latency.
- `src/components/fork/ReorgAnimation.tsx`  
  Toast animation khi re-org xảy ra.
- `src/pages/ForkPage.tsx`  
  Trang chính Fork – lắp ghép toàn bộ UI & logic trên.

---

## 4. Type & dữ liệu giả lập

### 4.1. `types/fork.ts`

- `ForkNode`:
  - `id`, `name`
  - `latencyMs`: 10–500ms
  - `miningSpeed`: 0.3–1.5 (tốc độ “đào” tương đối)
  - `isOnline`: node đang online/offline.
  - `currentHeight`: height node nghĩ là head hiện tại.
  - `branchId`: node đang bám theo nhánh nào (`A`/`B`/`C`).
- `ForkBlock`:
  - `height`, `hash`, `prevHash`
  - `producerNodeId`, `branchId`
  - `timestamp`, `difficulty` (fake).
  - `isCanonical`: block thuộc chuỗi dài nhất.
  - `isOrphan`: block bị loại sau re-org.
- `ForkBranch`:
  - `id` (`A`/`B`/`C`), `name`, `color`
  - `headHash`, `length` (số block trong nhánh).
- `ForkEvent`:
  - `type`: `'block' | 'fork' | 'reorg' | 'orphan' | 'node' | 'latency'`
  - `message`, `timestamp`.

### 4.2. Sinh chain & block giả – `utils/fakeChain.ts`

- `createGenesisBlock(branchId)` – tạo block genesis cho nhánh `A`.
- `createInitialBranches()` – tạo nhánh `A/B/C` với màu sắc khác nhau (A mặc định canonical).
- `createForkBlock(node, parent, branchId)` – tạo block mới:
  - `height = parent.height + 1` (nếu có parent).
  - `hash` = chuỗi hex 64 ký tự (dùng lại `randomSha256Like` của Task 1).
  - Mang thông tin node producer, nhánh, difficulty random nhỏ.

---

## 5. State & store – `store/forkStore.ts`

### 5.1. State

- `nodes: ForkNode[]` – danh sách node mạng.
- `branches: ForkBranch[]` – các nhánh A/B/C.
- `blocks: ForkBlock[]` – toàn bộ block (canonical + fork + orphan).
- `canonicalChain: ForkBlock[]` – chuỗi dài nhất hiện tại.
- `orphans: ForkBlock[]` – các block đã bị orphan.
- `events: ForkEvent[]` – log sự kiện gần đây (giới hạn ~64).
- `isRunning: boolean` – đang auto-simulate hay không.
- `simulationSpeed: 'slow' | 'normal' | 'fast'` – tốc độ tick.

### 5.2. Actions chính

- `reset()` – reset toàn bộ (nodes, branches, blocks, genesis).
- `start()` / `pause()` – bật/tắt auto-simulation.
- `setSpeed(speed)` – chỉnh tốc độ tick.
- `toggleNodeOnline(id)` – bật/tắt node online/offline (ghi log event type `node`).
- `updateLatency(id, latencyMs)` – đổi latency node (log event `latency`).
- `updateMiningSpeed(id, speed)` – đổi tốc độ “đào” của node.
- `randomizeLatencies()` – random tất cả latency (log `latency`).
- `produceBlock(nodeId)` – tạo block mới từ 1 node trên nhánh node đang theo dõi.
- `triggerFork()` – ép 2 node online cùng tạo block từ cùng parent → fork A/B.
- `runTick()` – mỗi tick:
  - Chọn 0–n node có xác suất tạo block (dựa trên `miningSpeed` & `simulationSpeed`).
  - Nếu 1 node → `produceBlock`.
  - Nếu nhiều node cùng height → `triggerFork`.
  - Sau đó gọi `reorgIfNeeded()`.
- `resolveLongestChain()` – tìm nhánh có `length` lớn nhất, backtrack từ `headHash` để đánh dấu canonical/orphan.
- `reorgIfNeeded()` – nếu có duy nhất 1 nhánh dài nhất và length > 1 → `resolveLongestChain()`.

Mỗi thao tác quan trọng đều được ghi lại trong `events` thông qua helper `withEvent(...)`.

---

## 6. Hook mô phỏng – `useForkSimulation.ts`

- Map `simulationSpeed` → chu kỳ tick (ms):
  - `slow`: ~1600ms, `normal`: ~900ms, `fast`: ~450ms.
- Nếu `isRunning = true`:
  - Tạo `setInterval` gọi `runTick()` liên tục.
  - Dừng interval khi pause/unmount.
- Expose ra cho UI:
  - `nodes, branches, blocks, canonicalChain, orphans, events`
  - `isRunning, simulationSpeed`
  - Handler: `reset, start, pause, setSpeed, toggleNodeOnline, updateLatency, updateMiningSpeed, randomizeLatencies, produceBlock, triggerFork`.

---

## 7. UI chi tiết – `ForkPage.tsx`

Trang Fork được chia làm 3 vùng:

### 7.1. Header section – Giới thiệu Fork Resolution

- Tiêu đề: `Mô phỏng giải quyết fork & re-org`.
- Mô tả ngắn về:
  - Mạng phân tán, node tạo block cạnh tranh.
  - Xuất hiện fork, chọn chuỗi dài nhất, re-org & orphan.
- Badge:
  - `Longest chain rule`.
  - `Forks • Orphans • Re-org`.

### 7.2. Hàng thứ nhất – Node List + ForkTree + Controls

- **Trái: `NodeList`**
  - Hiển thị card `NodeCard` cho mỗi node:
    - Tên node, height, branchId hiện tại.
    - Latency slider (10–500ms).
    - Mining speed slider (0.3–1.5x).
    - Nút Online/Offline.
    - Khi node vừa tạo block, card sẽ **pulse sáng** (prop `isProducing`).
  - Nút `Random latency` để random toàn bộ độ trễ mạng.

- **Phải (trên): `ForkTree`**
  - SVG tree các block (dùng canonicalChain + orphans):
    - Đường nối canonical xanh lá sáng.
    - Nhánh fork tím/hồng.
    - Orphan block dùng gradient cam → đỏ, opacity thấp.
  - Block hiển thị:
    - Hình chữ nhật nhỏ với height (số block) ở giữa.
    - Animation slide-in & fade-in khi block mới xuất hiện.
  - Text chú thích: “Đường sáng: chuỗi dài nhất • Block đỏ: orphan”.

- **Phải (dưới): `ForkControls`**
  - Nút:
    - **Bắt đầu mô phỏng / Tạm dừng** – bật/tắt auto `runTick`.
    - **Produce 1 block** – gọi `produceBlock` cho 1 node (mặc định node đầu).
    - **Reset** – gọi `reset()`.
  - Chọn tốc độ mô phỏng (slow / normal / fast) bằng button group.
  - Nút **Trigger fork (2 block cùng height)** – ép 2 node online cùng tạo block trên cùng parent → log event `fork`.

### 7.3. Hàng thứ hai – Event Log + Charts

- **Trái: `ForkEventLog`**
  - Hiển thị danh sách 40 event gần nhất (mới nhất trên đầu).
  - Mỗi log gồm:
    - Badge loại (`BLOCK`, `FORK`, `RE-ORG`, `ORPHAN`, `NODE`, `LAT`) với màu khác nhau.
    - Message chi tiết (VD: “Node 1 tạo block mới ở height 5 trên nhánh A”).
    - Thời gian (local).

- **Phải: `ForkCharts`**
  - **Orphan rate theo height** (AreaChart):
    - X: height.
    - Y: orphan rate (cumulative số orphan / tổng block).
  - **Độ dài các nhánh hiện tại** (BarChart):
    - Trục X: nhánh A/B/C.
    - Trục Y: `branch.length`.
  - **Số block được tạo bởi mỗi node** (BarChart):
    - Đếm block không orphan theo `producerNodeId`.
  - **Phân bố latency của node** (BarChart):
    - X: tên node, Y: `latencyMs`.

---

## 8. Re-org animation – `ReorgAnimation.tsx`

- Lắng nghe event cuối cùng có `type = 'reorg'` trong `events`.
- Nếu có, hiển thị **toast nổi** ở top center:
  - Icon 🔄.
  - Tiêu đề `Re-org detected`.
  - Message chi tiết từ store (VD: “Re-org: nhánh B trở thành chuỗi dài nhất (height 8)”).
- Dùng `AnimatePresence` + `motion.div` cho hiệu ứng fade/slide vào/ra.

---

## 9. Cách sử dụng Fork Simulator (Walkthrough)

1. **Mở trang Fork**  
   - Từ menu trên cùng → click **“Giải quyết fork”** hoặc vào `/fork`.

2. **Quan sát các node**  
   - Mỗi node có latency & speed khác nhau.
   - Node `Laggy` có latency cao hơn, minh hoạ node “chậm mạng”.

3. **Chạy mô phỏng**  
   - Bấm **“Bắt đầu mô phỏng”**.
   - Quan sát:
     - Node card nào đang “sáng” là node vừa tạo block.
     - `ForkTree` cập nhật các block mới.
     - Event log hiển thị block mới sinh ra.

4. **Tạo fork thủ công**  
   - Bấm **“Trigger fork (2 block cùng height)”**.
   - Hệ thống ép 2 node online tạo block mới trên cùng parent → sinh fork A/B.
   - Trên `ForkTree` bạn sẽ thấy 2 nhánh tách ra cùng height.
   - Event log hiển thị event `FORK` với height tương ứng.

5. **Quan sát re-org & orphan**  
   - Tiếp tục chạy mô phỏng, để một nhánh vượt độ dài nhánh còn lại.
   - Khi `reorgIfNeeded` phát hiện duy nhất 1 nhánh dài nhất:
     - `resolveLongestChain` đánh dấu canonical & orphan block.
     - Hiện toast `Reorg detected`.
     - Trên `ForkTree`:
       - Chuỗi canonical sáng lên.
       - Block bị orphan chuyển sang màu cam/đỏ mờ.

6. **Điều chỉnh latency & speed**  
   - Kéo slider latency cho node để thấy ảnh hưởng tới xác suất “bắt” block canonical kịp thời.
   - Tăng giảm mining speed để node đó tạo block thường xuyên hơn/ít hơn.

7. **Xem biểu đồ thống kê**  
   - Orphan rate tăng dần khi có nhiều block bị orphan.
   - Branch length cho thấy nhánh nào đang dài hơn.
   - Block per node cho biết node nào tạo nhiều block nhất.
   - Latency distribution cho thấy node nào “được ưu ái” mạng hơn.

8. **Reset mô phỏng**  
   - Nhấn **“Reset”** để quay về trạng thái genesis:
     - Xoá tất cả block, event, orphans.
     - Giữ cấu trúc node mặc định nhưng reset height/branch.

---

## 10. Gợi ý demo

- **Demo 1 – Fork do mạng chậm**  
  - Tăng latency của 1–2 node.
  - Chạy mô phỏng và chỉ ra lúc nào chúng thấy head khác các node còn lại.

- **Demo 2 – Trigger fork thủ công + Re-org**  
  - Bấm Trigger fork để tạo 2 nhánh A/B từ cùng height.
  - Tiếp tục chạy, để một nhánh thắng độ dài.
  - Chỉ ra block nào bị orphan, và chuỗi canonical mới.

- **Demo 3 – So sánh với PoW/PoS**  
  - PoW: cạnh tranh dựa trên hashrate.
  - PoS: cạnh tranh dựa trên stake.
  - Fork simulator: minh hoạ *mạng phân tán* và quy tắc fork choice (Longest Chain) khi đã có block.

README này là tài liệu giải thích và demo riêng cho **Task 3 – Fork Resolution Simulator**, dùng khi bạn trình bày toàn bộ project (PoW → PoS → Fork). 


