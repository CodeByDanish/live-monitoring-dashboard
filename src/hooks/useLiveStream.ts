import { useCallback, useEffect, useRef, useState } from "react";

import {
  createStreamClient,
  type StreamClient,
} from "../services/streamClient";

import type { ConnectionStatus, LiveEvent } from "../type/event";

import { MAX_EVENTS, UI_UPDATE_INTERVAL } from "../utils/helpers";

import { validateEvent } from "../utils/validate";

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 16000;
const MAX_RECONNECT_ATTEMPTS = 5;

export interface UseLiveStreamOptions {
  bufferSize?: number;
  updateInterval?: number;
  streamInterval?: number;
}

export interface UseLiveStreamResult {
  events: LiveEvent[];
  connectionStatus: ConnectionStatus;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  reconnect: () => void;
  clearEvents: () => void;
}

export const useLiveStream = (
  options: UseLiveStreamOptions = {},
): UseLiveStreamResult => {
  const {
    bufferSize = MAX_EVENTS,
    updateInterval = UI_UPDATE_INTERVAL,
    streamInterval = 50,
  } = options;

  const [events, setEvents] = useState<LiveEvent[]>([]);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const [isPaused, setIsPaused] = useState(false);

  const pendingEventsRef = useRef<LiveEvent[]>([]);

  const clientRef = useRef<StreamClient | null>(null);

  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reconnectAttemptsRef = useRef(0);

  const pausedRef = useRef(false);

  const manuallyDisconnectedRef = useRef(false);

  const connectRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  const flushPendingEvents = useCallback(() => {
    if (pausedRef.current || pendingEventsRef.current.length === 0) {
      return;
    }

    const pending = pendingEventsRef.current;

    pendingEventsRef.current = [];

    setEvents((previousEvents) => {
      const combined = [...previousEvents, ...pending];

      if (combined.length <= bufferSize) {
        return combined;
      }

      return combined.slice(-bufferSize);
    });
  }, [bufferSize]);

  const queueEvent = useCallback(
    (event: LiveEvent) => {
      const queue = pendingEventsRef.current;

      queue.push(event);

      if (queue.length > bufferSize) {
        pendingEventsRef.current = queue.slice(-bufferSize);
      }
    },
    [bufferSize],
  );

  const handleMessage = useCallback(
    (rawData: unknown) => {
      const event = validateEvent(rawData);

      if (!event) {
        return;
      }

      if (pausedRef.current) {
        return;
      }

      queueEvent(event);
    },
    [queueEvent],
  );

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);

      reconnectTimerRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (manuallyDisconnectedRef.current) {
      return;
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setConnectionStatus("error");
      return;
    }

    setConnectionStatus("reconnecting");

    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * 2 ** reconnectAttemptsRef.current,
      MAX_RECONNECT_DELAY,
    );

    reconnectAttemptsRef.current += 1;

    clearReconnectTimer();

    reconnectTimerRef.current = setTimeout(() => {
      connectRef.current();
    }, delay);
  }, [clearReconnectTimer]);

  const connect = useCallback(() => {
    clearReconnectTimer();

    clientRef.current?.disconnect();

    const client = createStreamClient({
      intervalMs: streamInterval,

      simulateDrop: import.meta.env.VITE_SIMULATE_DROP === "true",

      simulateMalformed: import.meta.env.VITE_SIMULATE_MALFORMED === "true",

      burstMode: import.meta.env.VITE_BURST_MODE === "true",

      onOpen: () => {
        reconnectAttemptsRef.current = 0;

        setConnectionStatus(pausedRef.current ? "paused" : "live");
      },

      onMessage: handleMessage,

      onError: () => {
        clientRef.current = null;

        scheduleReconnect();
      },

      onClose: () => {
        if (!manuallyDisconnectedRef.current) {
          scheduleReconnect();
        }
      },
    });

    clientRef.current = client;

    client.connect();
  }, [clearReconnectTimer, handleMessage, scheduleReconnect, streamInterval]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const pause = useCallback(() => {
    pausedRef.current = true;

    pendingEventsRef.current = [];

    setIsPaused(true);

    setConnectionStatus("paused");
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;

    setIsPaused(false);

    if (clientRef.current) {
      setConnectionStatus("live");
      return;
    }
    connectRef.current();
  }, []);

  const reconnect = useCallback(() => {
    manuallyDisconnectedRef.current = true;

    clearReconnectTimer();

    clientRef.current?.disconnect();

    clientRef.current = null;

    reconnectAttemptsRef.current = 0;

    manuallyDisconnectedRef.current = false;

    setConnectionStatus("connecting");

    connectRef.current();
  }, [clearReconnectTimer]);

  const clearEvents = useCallback(() => {
    pendingEventsRef.current = [];

    setEvents([]);
  }, []);

  useEffect(() => {
    manuallyDisconnectedRef.current = false;

    connectRef.current();

    return () => {
      manuallyDisconnectedRef.current = true;

      clearReconnectTimer();

      clientRef.current?.disconnect();

      clientRef.current = null;

      pendingEventsRef.current = [];
    };
  }, [clearReconnectTimer]);

  useEffect(() => {
    flushTimerRef.current = setInterval(flushPendingEvents, updateInterval);

    return () => {
      if (flushTimerRef.current !== null) {
        clearInterval(flushTimerRef.current);

        flushTimerRef.current = null;
      }
    };
  }, [flushPendingEvents, updateInterval]);

  return {
    events,
    connectionStatus,
    isPaused,
    pause,
    resume,
    reconnect,
    clearEvents,
  };
};
