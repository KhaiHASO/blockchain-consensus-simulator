# Task 2 – Proof-of-Stake (PoS) Simulator 

Trình mô phỏng **Proof of Stake (PoS)** , với validator giả lập, chọn proposer theo stake, epoch/slot, slashing và biểu đồ trực quan.

---

## 1. Tổng quan

Mục tiêu của Task 2:

- Mô phỏng **validator-based consensus**:
  - Mỗi validator có **stake** và **xác suất** được chọn block proposer.
  - Chọn proposer theo **weighted random** dựa trên stake/effectiveStake.
- Chạy **epoch** gồm nhiều **slot** (32 slot / epoch giống Ethereum).
- Minh hoạ **slashing** khi validator vi phạm (ký block “sai”):
  - Đốt ~30% stake.
  - Đưa vào trạng thái `slashed` và loại khỏi quá trình chọn proposer.
- Hiển thị dữ liệu bằng:
  - Danh sách validator đẹp (neon card).
  - Panel proposer mới nhất.
  - Biểu đồ stake, xác suất, phần thưởng, map epoch/slot.

> Lưu ý: Tất cả data là **fake** nhưng được thiết kế để **hợp lý về stake, phần thưởng, và xác suất**.

---

## 2. Công nghệ sử dụng

- **React + TypeScript**
- **TailwindCSS + DaisyUI** (cùng theme cyberpunk với Task 1)
- **Zustand** – state PoS (validators, epoch, slot, rewards, slashing).
- **Framer Motion** – animation cho card, panel.
- **Recharts** – biểu đồ stake, probability, reward, epoch map.
- **React Router** – route `/pos` tái sử dụng shell từ Task 1.

---

## 3. Cấu trúc file chính cho PoS

- `src/types/pos.ts`  
  Type cho validator, selection, slashing event.
- `src/utils/fakeValidators.ts`  
  Sinh danh sách validator giả (tên, avatar emoji, stake, effectiveStake).
- `src/store/posStore.ts`  
  Zustand store: state & action cho PoS.
- `src/hooks/usePosSimulation.ts`  
  Hook điều phối epoch/slot & gọi store.
- `src/components/pos/ValidatorCard.tsx`  
  Card hiển thị 1 validator (stake, xác suất, rewards, trạng thái).
- `src/components/pos/ValidatorList.tsx`  
  Danh sách validator + click chọn.
- `src/components/pos/PosControls.tsx`  
  Bảng điều khiển: epoch, propose, reset, thêm validator, chỉnh stake, slashing demo.
- `src/components/pos/PosCharts.tsx`  
  Bộ biểu đồ stake/probability/reward/epoch-map.
- `src/pages/PosPage.tsx`  
  Trang chính PoS – lắp ghép các phần trên thành dashboard.

---

## 4. State & type cho PoS

### 4.1. `types/pos.ts`

```ts
export type ValidatorStatus = 'active' | 'slashed';

export type Validator = {
  id: string;
  name: string;
  avatar: string;
  stake: number;
  effectiveStake: number;
  status: ValidatorStatus;
  rewards: number;
  probability: number;
};

export type PosSlotSelection = {
  epoch: number;
  slot: number;
  validatorId: string;
  validatorName: string;
  reward: number;
  timestamp: string;
};

export type SlashingEvent = {
  id: string;
  validatorId: string;
  validatorName: string;
  epoch: number;
  slot: number;
  burnedAmount: number;
  remainingStake: number;
  timestamp: string;
};
```

### 4.2. `store/posStore.ts` – State

- `validators: Validator[]`
- `isRunning: boolean` – cờ tổng (hiện chủ yếu dùng `isEpochRunning`).
- `isEpochRunning: boolean` – đang chạy epoch auto slot hay không.
- `currentEpoch: number`
- `currentSlot: number`
- `slotsPerEpoch: number` – mặc định `32`.
- `baseReward: number` – reward cơ bản cho mỗi block (mặc định `2`).
- `selectedValidator: Validator | null` – validator vừa được chọn làm proposer.
- `latestSelection: PosSlotSelection | null` – block proposal gần nhất.
- `selectionHistory: PosSlotSelection[]` – lịch sử proposer theo epoch/slot.
- `rewardHistory: { epoch; slot; validatorId; rewards }[]` – dùng cho chart.
- `slashingEvents: SlashingEvent[]` – lịch sử slashing.

### 4.3. `store/posStore.ts` – Actions

- `resetSimulation()` – sinh lại validators, reset epoch, slot, lịch sử, slashing.
- `recalcProbabilities()` – tính lại `validator.probability` dựa trên effectiveStake.
- `proposeBlock()` – chọn proposer theo stake & cộng reward.
- `startEpoch()` / `pauseEpoch()` – bật/tắt auto-advance slot.
- `advanceSlot()` – tăng `currentSlot`, nếu vượt `slotsPerEpoch` thì +1 epoch, reset slot.
- `slashValidator(id)` – mô phỏng slashing (đốt 30% stake, status = `slashed`, probability = 0).
- `addValidator({ name, avatar, stake })` – thêm validator mới.
- `updateStake(id, stake)` – chỉnh stake & effectiveStake (±5–10%), rồi recalc probability.

---

## 5. Sinh validator giả – `utils/fakeValidators.ts`

- Tên mẫu chuyên nghiệp:  
  `"Validator Alpha"`, `"Validator Sigma"`, `"StakeMaster 01"`, `"Node 23"`, `"Cypher Guardian"`,...
- Avatar emoji cyberpunk: `🟣`, `🔵`, `⚡`, `🛰️`, `💠`,...
- Stake:
  - `baseStake` random từ **10 → 300** token.
  - `effectiveStake = baseStake * (0.95–1.05)` (±5%).
- Probability:
  - Sau khi generate, tính `total = sum(effectiveStake)`.
  - `validator.probability = effectiveStake / total` cho các validator active.

Mỗi lần reset hoặc khởi tạo, bộ validator sẽ mới, nhưng phân bố stake luôn trong khoảng “thực tế”.

---

## 6. Logic chọn proposer & epoch

### 6.1. Weighted random proposer – `proposeBlock()`

1. Lấy `activeValidators`: `status === 'active' && stake > 0 && probability > 0`.
2. Tính tổng trọng số:
   ```ts
   const totalWeight = activeValidators.reduce(
     (acc, v) => acc + v.probability * v.effectiveStake,
     0,
   );
   ```
3. Lấy random `r` trong `[0, totalWeight)` và trừ dần theo trọng số từng validator để tìm người thắng:
   ```ts
   let r = Math.random() * totalWeight;
   for (const v of activeValidators) {
     const weight = v.probability * v.effectiveStake;
     r -= weight;
     if (r <= 0) { chosen = v; break; }
   }
   ```
4. Tính reward dựa trên tỷ lệ stake:
   ```ts
   const totalStake = activeValidators.reduce((acc, v) => acc + v.stake, 0);
   const stakeWeight = totalStake > 0 ? chosen.stake / totalStake : 0;
   const reward = baseReward * (0.5 + stakeWeight);
   ```
5. Cập nhật:
   - `latestSelection`, `selectionHistory`, `rewardHistory`.
   - Cộng `rewards` cho `chosen`.

### 6.2. Epoch & slot – `startEpoch`, `advanceSlot`, `usePosSimulation`

- `slotsPerEpoch = 32`.
- `usePosSimulation` tạo interval với `SLOT_DURATION_MS = 1500` ms:
  - Khi `isEpochRunning = true` → `setInterval` gọi `advanceSlot()` mỗi 1.5s.
  - Khi dừng → clear interval.
- `advanceSlot()`:
  - Nếu `currentSlot < slotsPerEpoch`: tăng `slot` và gọi `proposeBlock()`.
  - Nếu `currentSlot >= slotsPerEpoch`: tăng `epoch`, reset `slot` về 0.

Kết quả: bạn có thể xem **epoch # / slot #** chạy dần, với proposer được chọn mỗi slot.

---

## 7. Slashing – mô phỏng vi phạm PoS

### 7.1. `slashValidator(id)`

- Tìm validator cần slash, nếu đã `slashed` thì bỏ qua.
- Tính:
  - `burned = stake * 0.3` (đốt 30%).
  - `remaining = stake - burned`.
- Cập nhật validator:
  - `status = 'slashed'`.
  - `stake = remaining`.
  - `effectiveStake = remaining * 0.9` (giảm thêm để minh hoạ).
  - `probability = 0` (không còn được chọn proposer).
- Ghi lại `SlashingEvent` trong `slashingEvents`.
- Gọi `recalcProbabilities()` để cập nhật trọng số stake các validator còn lại.

### 7.2. UI slashing

- Ở `ValidatorCard`:
  - Border đổi thành **đỏ phát sáng**, overlay đỏ mờ.
  - Badge trạng thái hiển thị **“Đã bị slash”**.
- Ở `PosPage`:
  - Panel bên phải hiển thị **“Slashing gần đây”** với thông tin:
    - Tên validator.
    - Số stake bị đốt.
    - Epoch/slot tại thời điểm slashing.

---

## 8. UI chi tiết – `PosPage.tsx`

Trang PoS chia làm 3 vùng chính:

### 8.1. Header section – Giới thiệu PoS

- Tiêu đề: `Mô phỏng Proof of Stake`.
- Mô tả: giải thích chọn validator theo stake, epoch/slot, slashing.
- Badge:
  - `Stake-weighted random selection`.
  - `Epoch & slashing demo`.

### 8.2. Hàng thứ nhất – Validator List + Controls

- **Trái: `ValidatorList`**
  - Tiêu đề: **“Danh sách validator”**.
  - Hiển thị số validator đang hoạt động.
  - Tính tổng stake toàn mạng và hiển thị.
  - Mỗi card (`ValidatorCard`) gồm:
    - Emoji avatar.
    - Tên validator.
    - Stake & effective stake + thanh bar neon.
    - Probability badge (% xác suất).
    - Rewards tích luỹ.
    - Border & badge đỏ nếu `status = 'slashed'`.
  - Nhấp vào card → chọn validator cho phần điều khiển.

- **Phải: `PosControls`**
  - Bộ nút:
    - **Chạy epoch / Tạm dừng epoch** – bật/tắt interval advance slot.
    - **Propose block đơn** – gọi `proposeBlock()` cho 1 block.
    - **Reset** – gọi `resetSimulation()`.
  - Thanh **tiến độ epoch**: Slot hiện tại / 32.
  - Form **thêm validator**:
    - Tên validator.
    - Stake ban đầu.
    - Emoji avatar (select).
    - Nút `Thêm validator` → gọi `onAddValidator` → `addValidator` trong store.
  - Form **chỉnh stake validator đang chọn & slashing demo**:
    - Input stake mới.
    - Nút `Cập nhật stake` → `onUpdateStake`.
    - Nút `Trigger slashing demo` → `onTriggerSlashing` (gọi `slashValidator`).

### 8.3. Hàng thứ hai – Proposer panel + Charts

- **Trái: Panel proposer mới nhất**
  - Nếu có `latestSelection`:
    - Epoch/Slot (`E#/S#`).
    - Tên proposer.
    - Reward nhận được.
    - Thời gian local.
  - Nếu không có: hiển thị hướng dẫn “Chưa có block nào…”.  
  - Hiển thị validator đang được chọn (nếu có).
  - Phía dưới: tóm tắt **slashing gần đây** (tối đa vài sự kiện).

- **Phải: `PosCharts`**
  - **Pie chart** – phân bố stake các validator.
  - **Bar chart** – xác suất được chọn (%).
  - **Line chart** – lịch sử phần thưởng mỗi block (E#/S#).
  - **Epoch proposer map** – danh sách block `E#/S#` với tên proposer.
  - Phía dưới map: danh sách `slashingEvents` gần nhất.

---

## 9. Cách sử dụng PoS Simulator (Walkthrough)

1. **Mở trang PoS**
   - Từ menu trên cùng → click **“Bằng chứng cổ phần (PoS)”** hoặc vào `/pos`.

2. **Xem danh sách validator**
   - Quan sát stake, effective stake, xác suất (%), phần thưởng.
   - Validator bị slash (khi demo) sẽ có border đỏ & trạng thái “Đã bị slash”.

3. **Chạy epoch**
   - Bấm **“Chạy epoch”**:
     - `currentSlot` bắt đầu tăng dần 1.5s/slot.
     - Mỗi slot, một validator được chọn làm proposer (theo stake-probability).
   - Bấm **“Tạm dừng epoch”** để dừng lại.

4. **Propose block đơn**
   - Bấm **“Propose block đơn”** ngay cả khi không chạy epoch.
   - Hệ thống chọn proposer một lần, cập nhật panel bên trái & biểu đồ.

5. **Quan sát kết quả**
   - Panel **“Block proposer mới nhất”** cho biết:
     - Ai vừa được chọn.
     - Reward bao nhiêu.
     - Epoch/Slot nào.
   - Các biểu đồ phía phải cập nhật theo thời gian (stake, xác suất, reward, map proposer).

6. **Thêm validator giả & chỉnh stake**
   - Dùng form “Thêm validator giả lập”:
     - Điền tên, stake ban đầu, chọn emoji.
   - Click vào validator trong list để chọn và:
     - Chỉnh stake bằng form “Stake mới…”, bấm **“Cập nhật stake”**.
   - Sau mỗi thay đổi, xác suất được tính lại dựa trên stake mới.

7. **Trigger slashing demo**
   - Chọn một validator trong list.
   - Nhấn **“Trigger slashing demo”**:
     - Đốt ~30% stake.
     - Đánh dấu `slashed` (border đỏ, badge “Đã bị slash”).
     - Loại khỏi quá trình chọn proposer (probability = 0).
   - Panel slashing & epoch map sẽ phản ánh thay đổi.

8. **Reset mô phỏng**
   - Nhấn **“Reset”** để:
     - Sinh lại bộ validator fake mới.
     - Reset epoch, slot, lịch sử proposer, reward, slashing.

---

## 10. Gợi ý dùng cho demo

- **Demo 1 – PoS cơ bản**  
  Chạy epoch với dữ liệu mặc định; giải thích stake càng cao thì xác suất được chọn càng lớn (xem bar chart & selection history).

- **Demo 2 – Thêm validator lớn**  
  Thêm validator với stake rất lớn; quan sát biểu đồ stake & xác suất thay đổi, và tần suất được chọn tăng lên.

- **Demo 3 – Slashing**  
  Chọn một validator có stake lớn, chạy epoch cho nó được chọn vài lần, sau đó trigger slashing; quan sát:
  - Stake giảm, status đổi thành “slashed”.
  - Probability về 0.
  - Biểu đồ stake/probability & map proposer thay đổi tương ứng.

- **Demo 4 – So sánh với PoW (Task 1)**  
  Chuyển qua lại giữa PoW và PoS:
  - PoW dùng hashrate để chọn winner.
  - PoS dùng stake để chọn proposer.
  - Cả 2 đều hiển thị lịch sử block/epoch & các biến quan trọng trên biểu đồ.

README này có thể dùng làm tài liệu trình bày/giải thích riêng cho **Task 2 – PoS Simulator** khi bạn demo dự án. 


