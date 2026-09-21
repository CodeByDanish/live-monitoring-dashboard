import { memo } from "react";
import type { KpiData } from "../type/event";

interface KpiCardsProps {
  data: KpiData;
}

const KpiCards = ({ data }: KpiCardsProps) => {
  return (
    <section className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-label">Total Events</span>
        <strong className="kpi-value">
          {data.totalEvents.toLocaleString()}
        </strong>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Events / Sec</span>
        <strong className="kpi-value">{data.eventsPerSecond.toFixed(1)}</strong>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Success</span>
        <strong className="kpi-value">
          {data.successCount.toLocaleString()}
        </strong>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Warnings</span>
        <strong className="kpi-value">
          {data.warningCount.toLocaleString()}
        </strong>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Errors</span>
        <strong className="kpi-value">
          {data.errorCount.toLocaleString()}
        </strong>
      </div>
    </section>
  );
};

export default memo(KpiCards);
