import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import { AppButton } from "@puzzle-fuzzy/shadcn-ui/custom/app-button"
import { Widget } from "@puzzle-fuzzy/shadcn-ui/custom/widget"

export default function App() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="max-w-2xl space-y-4">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">拼图模糊组件库</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">一个源代码，两种分发方式。</h1>
          <p className="text-lg text-muted-foreground">
            官方 shadcn 组件持续保持可更新，自定义组合则由你自由演进。
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2" aria-label="组件预览">
          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">npm 子路径导出</p>
            <h2 className="mb-6 text-xl font-semibold">官方按钮</h2>
            <div className="flex flex-wrap gap-3">
              <Button>继续</Button>
              <Button variant="outline">查看</Button>
            </div>
          </div>

          <div className="dark rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">个人组合</p>
            <h2 className="mb-6 text-xl font-semibold">应用按钮</h2>
            <div className="flex flex-wrap gap-3">
              <AppButton>打开工作区</AppButton>
              <AppButton variant="outline">查看详情</AppButton>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4" aria-label="数据小组件预览">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">个人组合</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">数据小组件</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              内置折线图或活跃点阵图的紧凑指标卡片。
            </p>
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
              title="活跃程度"
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
