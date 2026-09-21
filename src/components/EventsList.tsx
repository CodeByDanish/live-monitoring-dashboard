import { memo } from "react";
import { List, type RowComponentProps } from "react-window";

import type { LiveEvent } from "../type/event";
import { formatTime } from "../utils/helpers";

interface EventsListProps {
  events: LiveEvent[];
}

type EventRowProps = {
  events: LiveEvent[];
};

const EventRow = ({
  index,
  style,
  events,
}: RowComponentProps<EventRowProps>) => {
  const event = events[index];

  if (!event) {
    return null;
  }

  return (
    <div style={style}>
      <div className="event-row">
        <span className="event-time">{formatTime(event.timestamp)}</span>

        <span className={`event-status status-${event.status}`}>
          {event.status}
        </span>

        <span className="event-message">{event.message}</span>

        <span className="event-value">{event.value.toFixed(2)}</span>
      </div>
    </div>
  );
};

const EventsList = ({ events }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <section className="events-panel">
        <div className="panel-header">
          <h2>Recent Events</h2>
          <span>0 events</span>
        </div>

        <div className="empty-state">No events found</div>
      </section>
    );
  }

  return (
    <section className="events-panel">
      <div className="panel-header">
        <h2>Recent Events</h2>
        <span>{events.length} events</span>
      </div>

      <div className="event-table-header">
        <span>Time</span>
        <span>Status</span>
        <span>Message</span>
        <span>Value</span>
      </div>

      <List
        rowComponent={EventRow}
        rowCount={events.length}
        rowHeight={52}
        rowProps={{ events }}
        overscanCount={5}
        style={{
          height: 420,
          width: "100%",
        }}
      />
    </section>
  );
};

export default memo(EventsList);
