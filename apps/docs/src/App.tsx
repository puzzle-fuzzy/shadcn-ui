import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import { AppButton } from "@puzzle-fuzzy/shadcn-ui/custom/app-button"
import { Widget } from "@puzzle-fuzzy/shadcn-ui/custom/widget"

export default function App() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="max-w-2xl space-y-4">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">Puzzle Fuzzy UI</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">One source, two distribution paths.</h1>
          <p className="text-lg text-muted-foreground">
            Official shadcn components stay updateable, while custom compositions remain yours to evolve.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2" aria-label="Component previews">
          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">npm subpath export</p>
            <h2 className="mb-6 text-xl font-semibold">Official Button</h2>
            <div className="flex flex-wrap gap-3">
              <Button>Continue</Button>
              <Button variant="outline">Review</Button>
            </div>
          </div>

          <div className="dark rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">personal composition</p>
            <h2 className="mb-6 text-xl font-semibold">App Button</h2>
            <div className="flex flex-wrap gap-3">
              <AppButton>Open workspace</AppButton>
              <AppButton variant="outline">See details</AppButton>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4" aria-label="Widget previews">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">personal composition</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Widget</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Compact metric cards with a built-in line chart or activity dot chart.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Widget
              title="Spending"
              value={85}
              unit="USD"
              chartData={[42, 58, 45, 72, 60, 85, 78]}
              chartAriaLabel="Spending trend over the last seven days"
            />
            <Widget
              title="Activity"
              value={8}
              unit="days"
              chartType="activity"
              chartData={[1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]}
              chartAriaLabel="Activity over the last two weeks"
            />
            <Widget
              title="Tasks done"
              value={8}
              unit="items"
              chartData={[3, 5, 2, 7, 4, 6, 8]}
              chartAriaLabel="Tasks completed over the last seven days"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">中文内容示例</p>
              <p className="mt-2 text-muted-foreground">检查中文标题、单位和图表无障碍标签在紧凑卡片中的显示效果。</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Widget
                title="花费"
                value={85}
                unit="元"
                chartData={[42, 58, 45, 72, 60, 85, 78]}
                chartAriaLabel="近 7 天花费趋势"
              />
              <Widget
                title="最近两周活跃程度"
                value={8}
                unit="天"
                chartType="activity"
                chartData={[1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]}
                chartAriaLabel="最近两周活跃记录"
              />
              <Widget
                title="完成任务"
                value={8}
                unit="个"
                chartData={[3, 5, 2, 7, 4, 6, 8]}
                chartAriaLabel="近 7 天完成任务趋势"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
