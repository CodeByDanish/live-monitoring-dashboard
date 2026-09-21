import { memo, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { LiveEvent } from "../type/event";
import { MAX_CHART_POINTS } from "../utils/helpers";

interface LiveChartProps {
  events: LiveEvent[];
}

interface ChartDataPoint {
  timestamp: number;
  time: string;
  value: number;
}

const LiveChart = ({ events }: LiveChartProps) => {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return events.slice(-MAX_CHART_POINTS).map((event) => ({
      timestamp: event.timestamp,
      time: new Date(event.timestamp).toLocaleTimeString([], {
        minute: "2-digit",
        second: "2-digit",
      }),
      value: event.value,
    }));
  }, [events]);

  return (
    <section className="chart-panel">
      <div className="panel-header">
        <div>
          <h2>Live Metric</h2>
          <p>Incoming metric over time</p>
        </div>

        <span>{chartData.length} points</span>
      </div>

      {chartData.length === 0 ? (
        <div className="empty-state">Waiting for live data...</div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />

              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                width={40}
              />

              <Tooltip
                labelFormatter={(_, payload) => {
                  const point = payload?.[0]?.payload as
                    | ChartDataPoint
                    | undefined;

                  if (!point) {
                    return "";
                  }

                  return new Date(point.timestamp).toLocaleTimeString();
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default memo(LiveChart);
