import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import KpiCards from "../components/KpiCards";

describe("KpiCards", () => {
  it("renders KPI values", () => {
    render(
      <KpiCards
        data={{
          totalEvents: 150,
          eventsPerSecond: 20,
          successCount: 100,
          warningCount: 30,
          errorCount: 20,
        }}
      />,
    );

    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("Events / Sec")).toBeInTheDocument();
    expect(screen.getByText("20.0")).toBeInTheDocument();

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("Warnings")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();

    expect(screen.getByText("Errors")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
