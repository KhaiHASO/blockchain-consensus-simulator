# Task 1 – Proof-of-Work Simulator (Frontend Only)

Trình mô phỏng **Proof of Work (PoW)** hoàn toàn frontend, với giao diện dashboard trực quan, nhiều thợ đào giả lập, biểu đồ độ khó/thời gian block và hoạt ảnh mining sống động.

---

## 1. Tổng quan

Mục tiêu của Task 1:

- Minh hoạ cách **nhiều thợ đào cạnh tranh** để tìm nonce hợp lệ.
- Thể hiện ảnh hưởng của:
  - **Hashrate / tốc độ thợ đào**.
  - **Độ khó (difficulty)**.
  - **Thời gian block mục tiêu (target block time)**.
- Cung cấp **các kịch bản demo**:
  - Thợ đào nhanh thường thắng.
  - Thợ đào chậm đôi khi vẫn thắng.
  - Độ khó quá thấp → block ra quá nhanh.
  - Độ khó quá cao → block ra quá chậm.

> Lưu ý: Tất cả dữ liệu là **fake / mô phỏng**, nhưng được thiết kế để **trông và hành xử giống “thế giới thật”**.

---

## 2. Công nghệ sử dụng

- **React + Vite + TypeScript**
- **TailwindCSS + DaisyUI** (theme đêm/cyberpunk tuỳ chỉnh)
- **React Router** – routing cho `Home`, `PoW`, `PoS`, `Fork`.
- **Zustand** – quản lý state mô phỏng PoW.
- **Framer Motion** – animation mượt cho card, panel, mining lanes.
- **Recharts** – biểu đồ:
  - Lịch sử thời gian block.
  - Xu hướng độ khó & hashrate mạng.
- **Hoạt ảnh mining**: sử dụng `div` + Framer Motion để render lanes thay vì canvas thuần.

---

## 3. Cấu trúc liên quan đến Task 1

Các file chính dùng cho PoW:

- `src/components/pow/PowPage.tsx`  
  Trang chính của PoW – ghép toàn bộ UI thành một dashboard.
- `src/components/pow/MinerList.tsx`  
  Danh sách thợ đào + bật/tắt miner.
- `src/components/pow/MinerCard.tsx`  
  Thẻ hiển thị thông tin từng miner (hashrate, shares, trạng thái).
- `src/components/pow/MiningCanvas.tsx`  
  Panel hoạt ảnh “cuộc đua đào khối”.
- `src/components/pow/DifficultyBar.tsx`  
  Thanh hiển thị độ khó hiện tại + mục tiêu thời gian block.
- `src/components/pow/BlockResult.tsx`  
  Card hiển thị block mới nhất (hash, nonce, miner thắng,…).
- `src/components/pow/PowControls.tsx`  
  Bảng điều khiển: Start/Pause/Reset, thay đổi độ khó, target block time, chọn kịch bản demo.
- `src/hooks/usePowSimulation.ts`  
  Hook điều phối vòng lặp mô phỏng (animation loop + tick logic).
- `src/store/powStore.ts`  
  Zustand store: giữ toàn bộ state & logic cập nhật PoW.
- `src/utils/fakeMiner.ts`  
  Sinh ra danh sách thợ đào giả lập (hashrate, speed, avatar,…).
- `src/utils/randomHash.ts`  
  Sinh hash giả dạng SHA-256 (64 ký tự hex).
- `src/utils/fakeBlock.ts`  
  Sinh block giả: height, nonce, hash, timestamp, difficulty, blockTimeSeconds.
- `src/types/pow.ts`  
  Định nghĩa type cho Miner, BlockInfo, Scenario,…

---

## 4. Cách chạy & truy cập PoW Simulator

Trong thư mục gốc dự án:

```bash
npm install
npm run dev
```

Mở trình duyệt:

- `http://localhost:5173/`

Điều hướng:

- Trang chủ: `Home` (Tổng quan).
- Trang PoW: click nút **“Mở trình mô phỏng PoW”** hoặc vào route `/pow`.

---

## 5. Các thành phần UI & Chức năng

### 5.1. Header & Routing

- **Header (App shell)**:
  - Logo + tiêu đề: _“Phòng thí nghiệm đồng thuận blockchain”_.
  - Menu:
    - **Tổng quan**
    - **Bằng chứng công việc (PoW)**
    - **Bằng chứng cổ phần (PoS)** – placeholder
    - **Giải quyết fork** – placeholder
  - Menu hỗ trợ wrap text, nên tiêu đề dài vẫn gọn trên mobile.

---

### 5.2. PoW Dashboard (`PowPage`)

Trang PoW được chia làm các khu:

#### (a) Header section – Giới thiệu PoW Simulator

- Tiêu đề: `Mô phỏng đào khối Proof of Work`.
- Mô tả ngắn: giải thích đang mô phỏng nhiều thợ đào, nonce, độ khó, block time.
- Badge:
  - `Dữ liệu giả lập, hành vi giống thực tế`.
  - `Chỉ frontend (chưa có backend)`.

#### (b) Hàng trên – Danh sách thợ đào + Mining Canvas

- **Bên trái: Danh sách thợ đào (`MinerList`)**
  - Tiêu đề: **“Danh sách thợ đào”**.
  - Hiển thị số thợ đào **đang bật / tổng số**.
  - Mỗi miner hiển thị bởi `MinerCard`:
    - Tên, hashrate (MH/s), tốc độ tương đối, số shares, trạng thái (Đang đào / Vừa thắng / Đang chờ / Tắt).
  - **Tương tác**:
    - Click vào card = bật/tắt miner đó (join/leave cuộc đua).

- **Bên phải: Mining Canvas + Difficulty Bar**
  - **MiningCanvas**:
    - Tiêu đề: **“Cuộc đua đào khối”**.
    - Cho mỗi miner:
      - Tên + chấm màu avatar.
      - Thanh tiến trình “làn đua” chạy qua lại (tốc độ dựa trên `speed` của miner).
    - Góc phải trên: hashrate tổng (giả lập tổng H/s).
    - Góc dưới: `Độ khó hiện tại` và `Tổng số hash thử`.
  - **DifficultyBar**:
    - Thanh hiển thị **Độ khó** dưới dạng bar (Dễ → Khó).
    - Hiển thị **Thời gian block mục tiêu (giây)**.

#### (c) Hàng giữa – Control Panel + Block Result

- **Bên trái: Control Panel (`PowControls`)**
  - Nút:
    - **“Bắt đầu đào” / “Tạm dừng”** – bật/tắt mô phỏng.
    - **“Đặt lại”** – reset toàn bộ state (thợ đào mới, lịch sử mới).
  - Slider:
    - **Độ khó**: 0.2 → 5 (ảnh hưởng xác suất ra block).
    - **Thời gian block mục tiêu (giây)**: 3 → 20.
  - Kịch bản demo:
    - `Thợ đào nhanh nhất thường thắng`.
    - `Thợ đào chậm thắng bất ngờ`.
    - `Độ khó quá thấp (block ra quá nhanh)`.
    - `Độ khó quá cao (block ra quá chậm)`.
    - `Xoá kịch bản (để mô phỏng tự nhiên)` – trở về behavior “pure” chỉ dựa vào hash rate.

- **Bên phải: Block Result (`BlockResult`)**
  - Khi **chưa có block**:
    - Hiện text: **“Chưa có block nào được đào. Bấm bắt đầu đào để xem block mới được sinh ra.”**
  - Khi **có block**:
    - `Block #height`.
    - Thợ đào thắng.
    - Nonce.
    - Độ khó tại thời điểm đó.
    - Thời gian tạo block (giây).
    - Hash 64 ký tự hex (giả lập SHA-256).
    - Thời điểm (local time).

#### (d) Hàng dưới – Biểu đồ (`Recharts`)

- **Biểu đồ “Lịch sử thời gian tạo block”**
  - Trục X: block height.
  - Trục Y: thời gian (3s → 20s).
  - Tooltip: thời gian block cho từng khối.

- **Biểu đồ “Xu hướng độ khó & hashrate”**
  - Cùng trục X (height).
  - Trục Y trái: độ khó.
  - Trục Y phải: hashrate mạng (tổng hashrate miners).
  - Tooltip: hiển thị song song độ khó & hashrate.

---

## 6. Nguyên lý fake data & mô phỏng

### 6.1. Thợ đào giả (`utils/fakeMiner.ts`)

- Tên miner lấy từ danh sách cứng để “ngầu”:
  - `Rig-Alpha`, `Rig-Beta`, `NeonHash-01`, `VoidMiner`, `PhotonCore`,...
- Thuộc tính được random mỗi lần khởi tạo/reset:
  - `hashrate`: **5 – 200 MH/s**.
  - `speed`: `hashrate / 200` (dùng làm trọng số xác suất thắng).
  - `avatarColor`: xoay vòng từ một list màu neon.
  - `status = 'idle'`, `active = true`, `sharesMined = 0`.

→ Mỗi lần reset / reload, bạn sẽ được bộ thợ đào với thông số khác nhau, nhưng luôn nằm trong khoảng “hợp lý”.

### 6.2. Hash & Block giả (`utils/randomHash.ts`, `utils/fakeBlock.ts`)

- `randomHex(length)`:
  - Sinh chuỗi hex random (0–9, a–f).
- `randomSha256Like()`:
  - Gọi `randomHex(64)` → giống SHA-256.
- `generateFakeBlock(miner, difficulty, blockTimeSeconds)`:
  - Tự tăng `height` (counter nội bộ).
  - Ghi lại:
    - Thợ đào thắng (`minerId`, `minerName`).
    - `nonce` random trong khoảng 0 → 10 triệu.
    - `hash` dạng SHA-256 giả (64 ký tự hex).
    - `timestamp` = `new Date().toISOString()`.
    - `difficulty`, `blockTimeSeconds` tại thời điểm block được tạo.

### 6.3. Logic mô phỏng – State & tick (`store/powStore.ts`, `hooks/usePowSimulation.ts`)

**State chính (Zustand):**

- `miners`: danh sách thợ đào.
- `isRunning`: đang chạy mô phỏng hay đang dừng.
- `difficulty`: độ khó hiện tại (0.2 – 5).
- `targetBlockTime`: thời gian block mong muốn (3 – 20 giây).
- `attemptsPerSecond`, `attemptsTotal`: số hash/giây và tổng hash thử.
- `currentScenario`: kịch bản mô phỏng (hoặc `null`).
- `latestBlock`: block mới nhất.
- `blockHistory`: danh sách block để vẽ chart.
- `hashrateHistory`: danh sách hashrate mạng tương ứng từng block.

**Vòng lặp mô phỏng (`usePowSimulation`):**

- Dùng `requestAnimationFrame`:
  - Mỗi frame tính `deltaSeconds`.
  - Gọi `tickSimulation(deltaSeconds)` nếu `isRunning = true`.

**Thuật toán trong `tickSimulation(deltaSeconds)` (tóm tắt):**

1. Lấy các miner đang `active`.
2. Tính `baseHashrate = sum(hashrate)`.
3. Tính **attempts per second** (phóng đại cho sinh động):  
   `attemptsPerSecond = baseHashrate * 1000`.
4. Tăng `attemptsTotal` theo `deltaSeconds`.
5. Xác suất tạo được block trong khoảng `deltaSeconds`:
   ```ts
   const threshold = 8_000_000 * difficulty;
   const probability = Math.min(0.9, (attemptsPerSecond / threshold) * deltaSeconds);
   const blockFound = Math.random() < probability;
   ```
   → Độ khó càng lớn → threshold càng lớn → xác suất ra block càng thấp.
6. Nếu **chưa tìm được block** → chỉ cập nhật `attemptsPerSecond`, `attemptsTotal`.
7. Nếu **tìm được block**:
   - **Chọn miner thắng** dựa trên `currentScenario`:
     - `fastest-wins`: miner có hashrate lớn nhất.
     - `slow-miner-luck`: ưu ái miner chậm + thêm 1 miner random để mô phỏng “ăn may”.
     - Các kịch bản còn lại / mặc định:
       - Chọn theo **trọng số `speed`** (hashrate càng cao càng dễ thắng).
   - Sinh `blockTimeSeconds` theo scenario:
     - `difficulty-low`: block 3–7s.
     - `difficulty-high`: block 14–22s.
     - Bình thường: block 5–15s.
   - Gọi `generateFakeBlock(...)` để tạo block giả.
   - **Điều chỉnh difficulty** theo thời gian block thực tế vs target:
     ```ts
     const target = targetBlockTime;
     const ratio = blockTimeSeconds / target;
     const factor = clamp(ratio, 0.5, 1.5);
     nextDifficulty = clamp(difficulty * factor, 0.2, 5);
     ```
   - Cập nhật state:
     - `latestBlock`, `blockHistory`, `hashrateHistory`.
     - `miners`: miner thắng → `status = 'winner'`, `sharesMined += 1`; miner khác active → `status = 'mining'`.

---

## 7. Cách sử dụng PoW Simulator (Walkthrough)

1. **Mở trang PoW**  
   - Từ trang chủ, bấm **“Mở trình mô phỏng PoW”**.

2. **Quan sát danh sách thợ đào**  
   - Xem hashrate, tốc độ tương đối, số shares đã đào.
   - Click vào thẻ thợ đào để **bật/tắt** họ khỏi cuộc đua.

3. **Bắt đầu mô phỏng**  
   - Trong “Bảng điều khiển”, bấm **“Bắt đầu đào”**.
   - Bạn sẽ thấy:
     - Làn chạy trên Mining Canvas chuyển động.
     - Tổng H/s tăng lên.
     - Sau một thời gian, block mới sẽ xuất hiện ở panel bên phải.

4. **Xem kết quả block**  
   - Kiểm tra:
     - Thợ đào nào vừa thắng.
     - Nonce nào được tìm thấy.
     - Hash block (64 ký tự hex).
     - Độ khó tại thời điểm đó.
     - Thời gian block (giây).

5. **Theo dõi biểu đồ**  
   - Các block mới liên tục thêm vào 2 biểu đồ phía dưới:
     - Lịch sử thời gian tạo block.
     - Xu hướng độ khó & hashrate.
   - Quan sát cách độ khó tự động tăng/giảm để áp về target block time.

6. **Sử dụng kịch bản demo**  
   - Chọn các kịch bản trong `Kịch bản demo` để thấy:
     - Thợ đào nhanh gần như luôn thắng.
     - Thợ đào chậm đôi khi thắng (nhờ random).
     - Độ khó thấp/cao quá khiến block ra nhanh/chậm bất thường.

7. **Điều chỉnh độ khó & target block time**  
   - Kéo slider **Độ khó** và **Thời gian block mục tiêu** để xem hệ thống tự điều chỉnh.

8. **Reset mô phỏng**  
   - Bấm **“Đặt lại”** để:
     - Sinh mới danh sách thợ đào (hashrate khác).
     - Xoá lịch sử block & biểu đồ.
     - Reset counters.

---

## 8. Chuẩn bị cho backend & các task tiếp theo

### 8.1. PoW API placeholder (`src/services/api/powApi.ts`)

- Các hàm fake (chưa gọi network) tương ứng với endpoint tương lai:
  - `GET /miners` → `fetchMiners()`.
  - `GET /latest-block` → `fetchLatestBlock()`.
  - `POST /mine` → `postMine()`.
  - `POST /difficulty/update` → `updateDifficulty()`.
- Khi làm backend, chỉ cần:
  - Implement HTTP call thật trong các hàm này.
  - Kết nối state PoW với dữ liệu từ server thay vì fake local.

### 8.2. Routing & placeholders cho Task 2 & 3

- `PosPlaceholder` (Proof of Stake) và `ForkPlaceholder` (Fork Resolution) đã được tạo sẵn với layout/cyberpunk UI tương tự.
- Chúng hiện chỉ hiển thị text giải thích, sẵn sàng để gắn logic & visualizations ở Task 2 và Task 3.

---

## 9. Gợi ý sử dụng cho demo

- **Demo 1 – Cơ bản**:
  - Bật PoW, giữ default difficulty/target block time.
  - Cho chạy vài block, giải thích miner thắng theo hashrate.
- **Demo 2 – Thợ đào nhanh thống trị**:
  - Chọn kịch bản `Thợ đào nhanh nhất thường thắng`.
  - Chỉ vào miner có hashrate cao nhất, cho chạy vài block.
- **Demo 3 – Thợ đào chậm thắng bất ngờ**:
  - Chọn kịch bản `Thợ đào chậm thắng bất ngờ`.
  - Quan sát khi miner chậm hơn vẫn có lúc thắng block.
- **Demo 4 – Difficulty tuning**:
  - Giảm mạnh độ khó → block ra liên tục, biểu đồ thời gian block tụt xuống.
  - Tăng mạnh độ khó → block lâu mới xuất hiện, biểu đồ độ khó & thời gian block thay đổi tương ứng.

README này có thể dùng trực tiếp làm tài liệu hướng dẫn khi quay video demo hoặc trình bày Task 1 PoW. 


