import type { EventStatus } from "../type/event";
import { generateEventId } from "../utils/helpers";

export type StreamMessageHandler = (data: unknown) => void;
export type StreamErrorHandler = () => void;
export type StreamOpenHandler = () => void;
export type StreamCloseHandler = () => void;

export interface StreamClientOptions {
  onMessage: StreamMessageHandler;
  onOpen?: StreamOpenHandler;
  onError?: StreamErrorHandler;
  onClose?: StreamCloseHandler;
  intervalMs?: number;
  simulateDrop?: boolean;
  simulateMalformed?: boolean;
  burstMode?: boolean;
}
export interface StreamClient {
  connect: () => void;
  disconnect: () => void;
}

const DEFAULT_INTERVAL_MS = 50;
const MIN_INTERVAL_MS = 20;

const STATUSES: readonly EventStatus[] = [
  "success",
  "success",
  "success",
  "success",
  "info",
  "warning",
  "error",
];

const MESSAGES: readonly string[] = [
  "Request processed successfully",
  "Payment transaction completed",
  "API response received",
  "User session updated",
  "Service health check completed",
  "High response time detected",
  "Temporary service warning",
  "Authentication request processed",
  "Database operation completed",
  "Background job completed",
];

const randomItem = <T>(items: readonly T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const createRawEvent = (): unknown => {
  return {
    id: generateEventId(),
    timestamp: Date.now(),
    status: randomItem(STATUSES),
    message: randomItem(MESSAGES),
    value: Number((Math.random() * 100).toFixed(2)),
  };
};

export const createStreamClient = (
  options: StreamClientOptions,
): StreamClient => {
  const {
    onMessage,
    onOpen,
    onError,
    onClose,
    intervalMs = DEFAULT_INTERVAL_MS,
    simulateDrop = false,
  } = options;

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let dropTimerId: ReturnType<typeof setTimeout> | null = null;
  let connectTimerId: ReturnType<typeof setTimeout> | null = null;
  let isConnected = false;

  const safeInterval = Math.max(intervalMs, MIN_INTERVAL_MS);

  const clearTimers = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (dropTimerId !== null) {
      clearTimeout(dropTimerId);
      dropTimerId = null;
    }

    if (connectTimerId !== null) {
      clearTimeout(connectTimerId);
      connectTimerId = null;
    }
  };

  const disconnect = (): void => {
    if (!isConnected) {
      return;
    }

    isConnected = false;
    clearTimers();
    onClose?.();
  };

  const dropConnection = (): void => {
    if (!isConnected) {
      return;
    }

    isConnected = false;
    clearTimers();
    onError?.();
  };

  const connect = (): void => {
    if (isConnected) {
      return;
    }

    isConnected = true;

    connectTimerId = setTimeout(() => {
      if (!isConnected) {
        return;
      }

      onOpen?.();

      intervalId = setInterval(() => {
        if (!isConnected) {
          return;
        }

        try {
          onMessage(createRawEvent());
        } catch {
          onError?.();
        }
      }, safeInterval);

      if (simulateDrop) {
        dropTimerId = setTimeout(() => {
          dropConnection();
        }, 10000);
      }
    }, 500);
  };

  return {
    connect,
    disconnect,
  };
};
