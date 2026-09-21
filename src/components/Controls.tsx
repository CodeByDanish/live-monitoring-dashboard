import { memo } from "react";
import type { StatusFilter, TimeWindow } from "../type/event";

interface ControlsProps {
  isPaused: boolean;
  statusFilter: StatusFilter;
  timeWindow: TimeWindow;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  onStatusChange: (status: StatusFilter) => void;
  onTimeWindowChange: (window: TimeWindow) => void;
}

const Controls = ({
  isPaused,
  statusFilter,
  timeWindow,
  onPause,
  onResume,
  onClear,
  onStatusChange,
  onTimeWindowChange,
}: ControlsProps) => {
  return (
    <div className="controls">
      <div className="control-group">
        <button
          type="button"
          className={isPaused ? "resume-button" : "pause-button"}
          onClick={isPaused ? onResume : onPause}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

        <button type="button" className="clear-button" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="control-group">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="time-window">Time Window</label>

        <select
          id="time-window"
          value={timeWindow}
          onChange={(event) =>
            onTimeWindowChange(Number(event.target.value) as TimeWindow)
          }
        >
          <option value={30}>Last 30 seconds</option>
          <option value={60}>Last 1 minute</option>
          <option value={300}>Last 5 minutes</option>
        </select>
      </div>
    </div>
  );
};

export default memo(Controls);
