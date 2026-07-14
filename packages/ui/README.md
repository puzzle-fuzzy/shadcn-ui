# @puzzle-fuzzy/shadcn-ui

个人 React shadcn/ui 组件包。组件按 subpath 导出：

```tsx
import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import "@puzzle-fuzzy/shadcn-ui/styles.css"
```

官方组件源码位于 `src/components/ui`，个人组件位于 `src/components/custom`。

自定义 Widget：

```tsx
import { Widget } from "@puzzle-fuzzy/shadcn-ui/custom/widget"
import "@puzzle-fuzzy/shadcn-ui/styles.css"

<Widget
  title="Spending"
  value={85}
  unit="USD"
  chartData={[42, 58, 45, 72, 60, 85, 78]}
  chartAriaLabel="Spending trend over the last seven days"
/>
```
