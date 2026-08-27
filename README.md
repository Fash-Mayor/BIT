# BIT // Booking Interface Terminal

A live dashboard that visualizes how a booking system holds up under brutal concurrency — watch simulated request traffic climb in real time, flip on **Chaos Mode** to slam it with a spike, and try to claim the one VIP slot before anyone else does.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) ![Tremor](https://img.shields.io/badge/Charts-Tremor-f97316)

## Why this exists

Booking systems fall over in a very specific way: not gradually, but the instant too many people go for the same limited resource at the same moment — a concert drop, a sneaker release, a "claim your slot" flash sale. BIT is a self-contained simulation of that moment. It doesn't talk to a real backend or a real database; instead it generates synthetic request load in a background thread, streams the numbers onto a live chart, and gives you a single "VIP Slot #001" to fight over, so the *shape* of a concurrency spike — and what a pessimistic locking strategy is meant to protect against — is something you can actually watch happen instead of just read about.

## Features

- **Synthetic traffic engine** — a Web Worker (spun up from an in-memory Blob, no extra build step) continuously generates request-per-second load off the main thread, so the UI never stutters no matter how hard it's pushed.
- **Live telemetry chart** — a Tremor `AreaChart` plots the most recent samples of simulated throughput in real time.
- **Chaos Mode** — a single toggle switches the pipeline between a stable baseline and a simulated traffic spike, with the status badge and chart color reacting instantly (green ↔ red).
- **Telemetry logging to IndexedDB** — every simulated request batch is written to a local `BIT_ChaosDB` database as it streams in, so the run leaves an actual trail behind, not just a chart.
- **VIP slot claim flow** — a mock "Claim VIP Slot" action stands in for a real pessimistic-lock booking write, illustrating what that kind of guard is for.

## Tech stack

| Layer | Tool |
|---|---|
| UI | [React 18](https://react.dev/) |
| Build tool | [Vite](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Charts | [Tremor](https://www.tremor.so/) |
| Concurrency | Web Workers (traffic simulation, off the main thread) |
| Local storage | IndexedDB (telemetry log buffer) |
| Tooling | ESLint |

## Getting started

```bash
npm install
npm run dev        # starts the Vite dev server
```

```bash
npm run build        # production build to dist/
npm run preview       # preview the production build locally
```

## Project structure

```
src/
  BITDashboard.jsx      # the dashboard UI: metrics, chart, chaos toggle, VIP slot action
  useChaosPipeline.js    # the Web Worker + IndexedDB traffic-simulation hook
```
