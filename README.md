# Blockchain Consensus Simulator

Frontend mô phỏng cơ chế đồng thuận blockchain (Task 1: Proof of Work).

## Yêu cầu môi trường

- Node.js (khuyến nghị: phiên bản LTS mới, ví dụ ≥ 18)
- npm (đi kèm Node)

## Cách chạy source

Trong thư mục dự án `blockchain-consensus-simulator`:

```bash
npm install
npm run dev
```

Sau đó mở trình duyệt và truy cập vào địa chỉ mà Vite in ra (thường là `http://localhost:5173`).

## Scripts hữu ích

- `npm run dev` – chạy dev server (hot reload).
- `npm run build` – build bản production.
- `npm run preview` – chạy thử bản build.

## Công nghệ đã dùng

- Vite + React + TypeScript
- TailwindCSS + DaisyUI (theme cyberpunk/night)
- React Router
- Zustand (chuẩn bị cho state management)
- Framer Motion (animation)
- Recharts (biểu đồ)

## Cấu trúc chính (Task 1)

- `src/router/AppRouter.tsx` – routing chính (Home, PoW, PoS, Fork)
- `src/pages/*` – các trang: Home, Pow, Pos, Fork
- `src/components/pow/*` – UI mô phỏng Proof of Work (Task 1)
- `src/components/pos/PosPlaceholder.tsx` – placeholder Proof of Stake
- `src/components/fork/ForkPlaceholder.tsx` – placeholder Fork Resolution

