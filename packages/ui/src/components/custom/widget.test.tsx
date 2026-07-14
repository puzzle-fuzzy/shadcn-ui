import { render, screen } from "@testing-library/react"
import { cleanup } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Widget } from "./widget"

describe("Widget", () => {
  afterEach(cleanup)

  it("renders title, value, and unit", () => {
    render(<Widget title="花费" value={85} unit="元" />)

    expect(screen.getByText("花费")).toBeInTheDocument()
    expect(screen.getByText("85")).toBeInTheDocument()
    expect(screen.getByText("元")).toBeInTheDocument()
    expect(document.querySelector('[data-slot="widget"]')).toBeInTheDocument()
  })

  it("renders an accessible line chart and filters non-finite values", () => {
    render(
      <Widget
        title="花费"
        value={85}
        chartData={[Number.NaN, 10, Number.POSITIVE_INFINITY, 20, Number.NEGATIVE_INFINITY]}
        chartAriaLabel="近 7 天花费趋势"
      />,
    )

    const chart = screen.getByRole("img", { name: "近 7 天花费趋势" })
    expect(chart).toHaveAttribute("data-omg-visualization", "line")
    expect(chart.querySelector('path[fill="none"]')?.getAttribute("d")).not.toMatch(/NaN|Infinity/u)
  })

  it("hides a line chart when fewer than two finite values remain", () => {
    render(<Widget title="花费" value={85} chartData={[Number.NaN, Number.POSITIVE_INFINITY]} />)

    expect(document.querySelector('[data-omg-visualization="line"]')).not.toBeInTheDocument()
  })

  it("renders up to two seven-point rows for activity data", () => {
    render(
      <Widget
        title="活跃程度"
        value={14}
        unit="天"
        chartType="activity"
        chartData={Array.from({ length: 20 }, (_, index) => index % 2)}
      />,
    )

    const chart = document.querySelector('[data-omg-visualization="activity"]')
    expect(chart).toBeInTheDocument()
    expect(chart?.querySelectorAll("circle")).toHaveLength(14)
  })

  it("supports custom icon and chart content", () => {
    render(
      <Widget
        title="访问量"
        value="12.3k"
        icon={<span aria-hidden="true">IC</span>}
        chart={<div data-testid="custom-chart">Custom chart</div>}
      />,
    )

    expect(screen.getByText("IC")).toBeInTheDocument()
    expect(screen.getByTestId("custom-chart")).toHaveTextContent("Custom chart")
  })
})
