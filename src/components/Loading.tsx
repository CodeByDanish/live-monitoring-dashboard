import { memo } from "react";

const Loading = () => {
  return (
    <div className="loading-state" role="status">
      <div className="spinner" />
      <span>Connecting to live stream...</span>
    </div>
  );
};

export default memo(Loading);
