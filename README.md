# Live Monitoring Dashboard

A real-time monitoring dashboard built with React, TypeScript and Vite. The dashboard displays incoming events, live metrics, KPI values and connection status.

## Features

- Real-time simulated event stream
- Live KPI updates
- Time-series chart
- Recent events list with virtualization
- Pause and resume controls
- Status and time-window filters
- Connection and reconnection states
- Exponential reconnect backoff
- Bounded event and chart data
- Runtime validation for incoming events
- Responsive layout
- Loading, empty and error states

## Tech Stack

- React
- TypeScript
- Vite
- Recharts
- react-window
- Vitest
- React Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a `.env` file if you want to use the stream testing options. The available configuration is shown in `.env.example`.

```env
VITE_SIMULATE_DROP=false
VITE_SIMULATE_MALFORMED=false
VITE_BURST_MODE=false
```

`VITE_SIMULATE_DROP` can be enabled to test reconnection behavior.

`VITE_SIMULATE_MALFORMED` sends invalid events to verify that validation rejects them.

`VITE_BURST_MODE` generates events at a higher rate for performance testing.

## Performance

Incoming events are queued and applied to React state in batches instead of updating the UI for every message.

The event buffer has a fixed maximum size so memory usage does not continue growing over time. Chart data is also limited to a fixed number of recent points.

The events list uses virtualization, and memoization is used where appropriate to reduce unnecessary rendering.

## Security

Incoming stream data is treated as untrusted and validated before it is added to the application state.

Streamed text is rendered using normal React text rendering and `dangerouslySetInnerHTML` is not used.

No credentials or private tokens are stored in the client. The Vite environment variables in this project are only used for non-sensitive test configuration.

## Tests

Run the tests:

```bash
npm run test:run
```

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Project Structure

```text
src/
├── components/
├── hooks/
│   └── useLiveStream.ts
├── services/
│   └── streamClient.ts
├── type/
│   └── event.ts
├── utils/
├── test/
├── App.tsx
└── main.tsx
```

The stream connection and buffering logic is kept outside the UI components so the components remain focused on presentation.
