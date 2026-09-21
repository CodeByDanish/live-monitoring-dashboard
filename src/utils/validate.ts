import type { EventStatus, LiveEvent } from "../type/event";

const VALID_STATUSES: readonly EventStatus[] = [
  "success",
  "warning",
  "error",
  "info",
];

const MAX_MESSAGE_LENGTH = 300;
const MAX_ID_LENGTH = 100;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isValidStatus = (value: unknown): value is EventStatus => {
  return (
    typeof value === "string" && VALID_STATUSES.includes(value as EventStatus)
  );
};

export const validateEvent = (data: unknown): LiveEvent | null => {
  if (!isObject(data)) {
    return null;
  }

  const { id, timestamp, status, message, value } = data;

  if (typeof id !== "string" || id.length === 0 || id.length > MAX_ID_LENGTH) {
    return null;
  }

  if (
    typeof timestamp !== "number" ||
    !Number.isFinite(timestamp) ||
    timestamp <= 0
  ) {
    return null;
  }

  if (!isValidStatus(status)) {
    return null;
  }

  if (
    typeof message !== "string" ||
    message.length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return {
    id,
    timestamp,
    status,
    message,
    value,
  };
};
