import { BarChart3 } from "lucide-react"
import { useId, useMemo, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export const widgetChartTypes = ["line", "activity"] as const

export type WidgetChartType = (typeof widgetChartTypes)[number]

export interface WidgetProps extends Omit<ComponentProps<"div">, "title"> {
  /** Card label displayed in the upper-right quadrant. */
  title: string
  /** Primary value displayed in the lower-left quadrant. */
  value: string | number
  /** Optional unit displayed next to the primary value. */
  unit?: string
  /** Built-in mini visualization to render in the lower-right quadrant. */
  chartType?: WidgetChartType
  /** Values used by the built-in line or activity visualization. */
  chartData?: readonly number[]
  /** Accessible name for a built-in chart. Without it, the chart is decorative. */
  chartAriaLabel?: string
  /** Custom icon replacing the default chart icon. */
  icon?: ReactNode
  /** Custom chart replacing the built-in line or activity visualization. */
  chart?: ReactNode
}

export interface WidgetLineChartProps {
  data: readonly number[]
  ariaLabel?: string
  gradientId: string
}

function WidgetLineChart({ data, ariaLabel, gradientId }: WidgetLineChartProps) {
  const linePath = useMemo(() => {
    const usableData = data.filter(Number.isFinite)
    if (usableData.length < 2) return ""

    const width = 100
    const height = 36
    const padding = 2
    const min = Math.min(...usableData)
    const max = Math.max(...usableData)
    const range = max - min || 1
    const step = (width - padding * 2) / (usableData.length - 1)

    return usableData
      .map((value, index) => {
        const x = padding + index * step
        const y = height - padding - ((value - min) / range) * (height - padding * 2)
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")
  }, [data])

  if (!linePath) return null

  const fillPath = `${linePath} L98,34 L2,34 Z`
  const accessibleName = ariaLabel?.trim() || undefined

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 100 36"
      data-omg-visualization="line"
      role={accessibleName ? "img" : undefined}
      aria-label={accessibleName}
      aria-hidden={accessibleName ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={fillPath} fill={`url(#${gradientId})`} />
    </svg>
  )
}

function WidgetActivityChart({ data, ariaLabel }: Pick<WidgetLineChartProps, "data" | "ariaLabel">) {
  const points = data.slice(0, 14).map((value, index) => ({
    x: 10 + (index % 7) * 13,
    y: index < 7 ? 14 : 28,
    active: value === 1,
  }))
  const accessibleName = ariaLabel?.trim() || undefined

  if (points.length === 0) return null

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 96 40"
      data-omg-visualization="activity"
      role={accessibleName ? "img" : undefined}
      aria-label={accessibleName}
      aria-hidden={accessibleName ? undefined : true}
    >
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={point.active ? "currentColor" : "none"}
          stroke={point.active ? "none" : "currentColor"}
          strokeOpacity={point.active ? 0 : 0.25}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

export function Widget({
  title,
  value,
  unit,
  chartType = "line",
  chartData = [],
  chartAriaLabel,
  icon,
  chart,
  className,
  ...props
}: WidgetProps) {
  const gradientId = `widget-line-fill-${useId().replaceAll(":", "")}`

  return (
    <div
      data-slot="widget"
      className={cn(
        "relative grid h-[130px] w-[160px] min-w-[160px] grid-cols-2 grid-rows-2 rounded-[35px] bg-card/55 p-4 text-foreground backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-card/40 via-transparent to-transparent"
      />

      <div className="relative flex size-11 place-self-start items-center justify-center rounded-full bg-foreground/5 p-3 [&>svg]:size-5">
        {icon ?? <BarChart3 aria-hidden="true" />}
      </div>

      <div className="relative max-w-full place-self-start justify-self-end truncate text-sm font-medium leading-[1.4] text-muted-foreground">
        {title}
      </div>

      <div className="relative flex min-w-0 max-w-full items-baseline gap-0.5 place-self-end justify-self-start overflow-hidden">
        <span className="truncate text-[22px] font-semibold tabular-nums leading-none">{value}</span>
        {unit ? <span className="shrink-0 text-xs font-medium leading-none text-muted-foreground">{unit}</span> : null}
      </div>

      <div className="relative flex w-full max-w-24 place-self-end justify-self-end overflow-hidden text-primary">
        {chart ??
          (chartType === "line" ? (
            <WidgetLineChart data={chartData} ariaLabel={chartAriaLabel} gradientId={gradientId} />
          ) : (
            <WidgetActivityChart data={chartData} ariaLabel={chartAriaLabel} />
          ))}
      </div>
    </div>
  )
}
