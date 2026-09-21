import { memo } from "react";
import type { ConnectionStatus } from "../type/event";

interface ConnectionBarProps {
  status: ConnectionStatus;
  onReconnect: () => void;
}

const statusLabels: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  live: "Live",
  paused: "Paused",
  reconnecting: "Reconnecting",
  error: "Connection Error",
};

const ConnectionBar = ({ status, onReconnect }: ConnectionBarProps) => {
  const showReconnect = status === "error";

  return (
    <div
      className={`connection-bar connection-${status}`}
      role="status"
      aria-live="polite"
    >
      <div className="connection-info">
        <span className="connection-dot" />

        <span>{statusLabels[status]}</span>
      </div>

      {showReconnect && (
        <button
          type="button"
          className="reconnect-button"
          onClick={onReconnect}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default memo(ConnectionBar);
