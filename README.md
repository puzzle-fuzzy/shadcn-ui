# @puzzle-fuzzy/shadcn-ui

个人 React shadcn/ui 分发仓库：官方组件源码持续同步，个人组件独立维护，同时提供 npm 包和 shadcn registry 两种消费方式。

## npm

```tsx
import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import "@puzzle-fuzzy/shadcn-ui/styles.css"
```

## shadcn registry

```bash
bunx --bun shadcn@latest add puzzle-fuzzy/shadcn-ui/app-button
```

`packages/ui/src/components/ui` 只存放官方 shadcn 源码；`packages/ui/src/components/custom` 存放个人组件和组合组件。上游同步只允许修改官方目录，不会覆盖个人组件。

## 本地验证

```bash
bun install
bun run verify
```

设计规格见 [`docs/superpowers/specs/2026-07-14-shadcn-ui-distribution-design.md`](docs/superpowers/specs/2026-07-14-shadcn-ui-distribution-design.md)，实现计划见 [`docs/superpowers/plans/2026-07-14-shadcn-ui-distribution.md`](docs/superpowers/plans/2026-07-14-shadcn-ui-distribution.md)。
