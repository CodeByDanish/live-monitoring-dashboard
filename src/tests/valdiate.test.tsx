import { describe, expect, it } from "vitest";
import { validateEvent } from "../utils/validate";

describe("validateEvent", () => {
  it("accepts a valid event", () => {
    const event = {
      id: "event-1",
      timestamp: Date.now(),
      status: "success",
      message: "Request completed",
      value: 42.5,
    };

    const result = validateEvent(event);

    expect(result).toEqual(event);
  });

  it("rejects invalid status", () => {
    const event = {
      id: "event-2",
      timestamp: Date.now(),
      status: "unknown",
      message: "Invalid status",
      value: 20,
    };

    expect(validateEvent(event)).toBeNull();
  });

  it("rejects invalid field types", () => {
    const event = {
      id: 123,
      timestamp: "invalid",
      status: "success",
      message: [],
      value: "50",
    };

    expect(validateEvent(event)).toBeNull();
  });

  it("rejects an oversized message", () => {
    const event = {
      id: "event-3",
      timestamp: Date.now(),
      status: "success",
      message: "a".repeat(301),
      value: 50,
    };

    expect(validateEvent(event)).toBeNull();
  });

  it("rejects null", () => {
    expect(validateEvent(null)).toBeNull();
  });

  it("rejects arrays", () => {
    expect(validateEvent([])).toBeNull();
  });
});
