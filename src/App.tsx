import { useCallback, useMemo, useState } from "react";

import ConnectionBar from "./components/ConnectionBar";
import Controls from "./components/Controls";
import KpiCards from "./components/KpiCards";
import Loading from "./components/Loading";
import EventsList from "./components/EventsList";
import LiveChart from "./components/LiveChart";

import { useLiveStream } from "./hooks/useLiveStream";

import type { StatusFilter, TimeWindow } from "./type/event";

import "./App.css";

function App() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [timeWindow, setTimeWindow] = useState<TimeWindow>(60);

  const {
    events,
    connectionStatus,
    isPaused,
    pause,
    resume,
    reconnect,
    clearEvents,
  } = useLiveStream();

  const timeFilteredEvents = useMemo(() => {
    const cutoffTime = Date.now() - timeWindow * 1000;

    return events.filter(
      (event: any) =>
        event.timestamp >= cutoffTime &&
        (statusFilter === "all" || event.status === statusFilter),
    );
  }, [events, statusFilter, timeWindow]);

  const listEvents = useMemo(
    () => [...timeFilteredEvents].reverse(),
    [timeFilteredEvents],
  );

  const kpiData = useMemo(() => {
    let successCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    for (const event of events) {
      if (event.status === "success") {
        successCount += 1;
      } else if (event.status === "warning") {
        warningCount += 1;
      } else if (event.status === "error") {
        errorCount += 1;
      }
    }

    const latestTimestamp =
      events.length > 0 ? events[events.length - 1].timestamp : 0;

    const oneSecondAgo = latestTimestamp - 1000;

    const eventsPerSecond =
      latestTimestamp === 0
        ? 0
        : events.reduce(
            (count, event) =>
              event.timestamp >= oneSecondAgo ? count + 1 : count,
            0,
          );

    return {
      totalEvents: events.length,
      eventsPerSecond,
      successCount,
      warningCount,
      errorCount,
    };
  }, [events]);

  const handleStatusChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
  }, []);

  const handleTimeWindowChange = useCallback((window: TimeWindow) => {
    setTimeWindow(window);
  }, []);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Live Monitoring Dashboard</h1>
          <p>Real-time system activity and performance</p>
        </div>
      </header>

      <ConnectionBar status={connectionStatus} onReconnect={reconnect} />

      {connectionStatus === "connecting" && <Loading />}

      <Controls
        isPaused={isPaused}
        statusFilter={statusFilter}
        timeWindow={timeWindow}
        onPause={pause}
        onResume={resume}
        onClear={clearEvents}
        onStatusChange={handleStatusChange}
        onTimeWindowChange={handleTimeWindowChange}
      />

      <KpiCards data={kpiData} />

      <LiveChart events={timeFilteredEvents} />

      <EventsList events={listEvents} />

      {connectionStatus === "connecting" && <Loading />}
    </main>
  );
}

export default App;
