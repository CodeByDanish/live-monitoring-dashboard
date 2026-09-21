import type { LiveEvent } from "../type/event";

export const MAX_EVENTS = 1000;
export const MAX_CHART_POINTS = 300;
export const UI_UPDATE_INTERVAL = 200;

export const capEvents = (
  events: LiveEvent[],
  maxSize = MAX_EVENTS,
): LiveEvent[] => {
  if (events.length <= maxSize) {
    return events;
  }

  return events.slice(events.length - maxSize);
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const generateEventId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};
