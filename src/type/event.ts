export type EventStatus = "success" | "warning" | "error" | "info";

export interface LiveEvent {
  id: string;
  timestamp: number;
  status: EventStatus;
  message: string;
  value: number;
}

export type ConnectionStatus =
  | "connecting"
  | "live"
  | "paused"
  | "reconnecting"
  | "error";

export interface ChartPoint {
  timestamp: number;
  value: number;
}

export interface KpiData {
  totalEvents: number;
  eventsPerSecond: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
}

export type StatusFilter = "all" | EventStatus;

export type TimeWindow = 30 | 60 | 300;
