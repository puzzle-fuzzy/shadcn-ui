# puzzle-fuzzy/shadcn-ui 设计规格

日期：2026-07-14

状态：待用户审阅

## 1. 背景

`puzzle-fuzzy/components` 已经是一个 Vue 3 组件库，发布包为 `@puzzle-fuzzy/ui`。本项目是全新的 React 组件分发仓库，不修改、不替换现有 Vue 组件库。

目标是把 shadcn/ui 的源码分发模式与 npm 包分发模式组合起来：官方组件能够持续从 shadcn 上游同步；个人组件能够独立演进；其他项目既可以安装编译后的 npm 包，也可以通过 shadcn registry 获取源码并继续修改。

## 2. 固定决策

- GitHub 仓库：`puzzle-fuzzy/shadcn-ui`
- 仓库可见性：Public；公开仓库可以直接作为 GitHub registry
- npm 包：`@puzzle-fuzzy/shadcn-ui`
- 包管理器：Bun
- 前端技术：React、Vite、TypeScript、Tailwind CSS、shadcn/ui
- 基础组件实现：沿用 shadcn 当前选择的 base/radix 配置，不自行维护第二套 primitive API
- 图标：以初始化时确定的 shadcn icon library 为准，首版使用 lucide
- 当前 SuperGlasses 仓库：完全不修改

## 3. 目标

### 3.1 必须实现

1. 在 `packages/ui` 保存官方 shadcn UI 组件源码。
2. 首次初始化时支持一次性安装当前官方 registry 中的全部可用组件。
3. 官方组件与个人组件隔离，自动同步官方组件时不能覆盖个人组件。
4. npm 包提供 ESM、TypeScript 声明和按组件的 subpath exports。
5. npm 消费者可以按需导入组件，例如 `@puzzle-fuzzy/shadcn-ui/button`。
6. 仓库根目录提供合法的 `registry.json`，个人组件可通过 shadcn CLI 安装。
7. GitHub Actions 定期检查 shadcn 上游变化并创建更新 Pull Request。
8. 提供 `typecheck`、`lint`、`test`、`build` 和 `verify` 脚本。
9. npm 发布前检查导出、类型、包内容和最小消费示例。

### 3.2 不在首版范围内

- 不复制 shadcn 官方完整站点、文档站或内部开发工具。
- 不把官方组件改造成带业务请求、状态管理或后端依赖的业务组件。
- 不自动覆盖 `custom` 目录中的文件。
- 不在本地项目中安装或修改 `SuperGlasses` 的 shadcn 配置。
- 不承诺 Tailwind CSS 会像 JavaScript 模块一样完全按 import 图裁剪。
- 不在没有审阅同步 PR 的情况下自动发布 npm 新版本。

## 4. 仓库结构

```text
shadcn-ui/
├─ apps/
│  └─ docs/                         # Vite 文档和真实消费示例
├─ packages/
│  └─ ui/
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ ui/                  # 官方 shadcn 源码，只由同步流程更新
│     │  │  └─ custom/              # 个人组件和组合组件
│     │  ├─ hooks/
│     │  ├─ lib/
│     │  └─ styles/
│     ├─ components.json
│     ├─ package.json
│     └─ tsconfig.json
├─ registry/
│  └─ custom/                       # registry 专用的可复制源码
├─ registry.json
├─ scripts/
│  ├─ sync-upstream.ts
│  └─ verify-package.ts
├─ .github/workflows/
│  ├─ ci.yml
│  ├─ sync-upstream.yml
│  └─ publish.yml
├─ package.json
├─ bunfig.toml
└─ tsconfig.json
```

`packages/ui/src/components/ui` 是上游同步边界。个人组件不得直接修改其中的官方文件；需要不同 API 或行为时，创建 `custom` 组件并组合官方组件。

`registry/` 与 npm 源码分开，是为了避免 npm 包内部的 workspace alias 被直接复制到其他项目后失效。registry item 必须使用可复制的源码和显式的 `registryDependencies`。

## 5. 分发接口

### 5.1 npm

消费者使用：

```tsx
import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import "@puzzle-fuzzy/shadcn-ui/styles.css"
```

包必须提供：

- `type: module`
- 每个公共组件的 subpath export
- 类型声明
- CSS 入口
- React 和 React DOM peer dependencies
- CSS 文件作为 side effect；不能用无条件的 `sideEffects: false` 删除 CSS

根入口只提供稳定的常用导出，完整组件集合通过 subpath 暴露，减少消费者开发环境的预构建开销并保持清晰的依赖边界。

### 5.2 shadcn registry

根 `registry.json` 至少包含个人组件，并为每个 item 声明文件、npm 依赖和 registry 依赖。公开 GitHub 仓库支持以下消费方式：

```bash
bunx --bun shadcn@latest add puzzle-fuzzy/shadcn-ui/<item>
```

registry 源码不得依赖只有本仓库存在的路径别名；需要共享逻辑时，作为同一 item 的文件或显式 registry dependency 分发。

## 6. 上游同步

### 6.1 同步原则

shadcn/ui 的组件是复制到项目中的源码，不是一个可以直接 `npm update` 的传统组件依赖。因此同步采用“自动检测、Pull Request 审阅、合并后发布”的流程。

### 6.2 工作流

1. GitHub Actions 按周运行，并允许手动触发。
2. 在干净的同步工作目录中执行 `bunx --bun shadcn@latest add --all`，目标只包含 `components/ui`。
3. 对比当前仓库的官方目录，生成同步提交。
4. 执行 typecheck、lint、test、build 和包消费验证。
5. 只有存在差异且验证通过时，才创建或更新 `shadcn-upstream` Pull Request。
6. 人工审阅 API、依赖和 CSS 变化后合并。
7. 合并到默认分支后，由发布工作流根据 changeset 发布 npm。

### 6.3 冲突处理

- `custom` 目录不参与自动覆盖。
- 如果业务确实需要修改官方组件，创建独立的 `custom` 变体，并在文档中注明对应的官方组件。
- 同步 PR 不使用静默强制覆盖整个仓库。
- 上游组件发生破坏性 API 变化时，更新 PR 必须暂停发布，等待手工适配和测试更新。

## 7. 版本和发布

- 使用 Changesets 管理 npm 版本和变更说明。
- 组件 API 兼容的修复发布 patch；新增组件发布 minor；破坏性 API 发布 major。
- npm 发布只从默认分支的已验证提交执行。
- GitHub Release、npm 版本和 registry 文档中的版本保持一致。
- 发布工作流不保存 npm token 到仓库文件；使用 GitHub Actions 的受保护 secret 或可信发布配置。

## 8. 文档与验证

`apps/docs` 提供每个公共组件的最小使用示例，并至少覆盖：

- Button、Card、Dialog、Form、Table
- 一个个人 custom 组件
- npm 导入方式
- shadcn registry 安装方式
- 主题、暗色模式和 CSS 入口配置

验证命令：

```bash
bun install
bun run typecheck
bun run lint
bun test
bun run build
bun run verify
```

包验证必须在一个临时 Vite React 消费项目中执行，确认 subpath imports、CSS、类型声明和 production build 均能工作。

## 9. 分阶段实施

### 阶段 1：可发布基础包

- 初始化 Bun monorepo。
- 配置 `packages/ui/components.json`。
- 安装全部官方组件。
- 配置 ESM、subpath exports、类型检查和最小构建。
- 加入一个最小个人组件作为 vertical slice。

### 阶段 2：registry 和文档

- 编写 `registry.json` 和个人 registry item。
- 添加 Vite 文档应用和真实消费示例。
- 验证 GitHub registry 安装流程。

### 阶段 3：自动同步和发布

- 添加同步脚本和定时 workflow。
- 添加 CI、changesets 和 npm 发布 workflow。
- 使用 dry-run 消费项目验证发布包。

## 10. 验收标准

完成首版后，以下命令应成功：

```bash
bun install
bun run verify
```

并且一个全新 Vite React 项目能够同时完成：

```bash
bun add @puzzle-fuzzy/shadcn-ui
```

```tsx
import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
```

以及：

```bash
bunx --bun shadcn@latest add puzzle-fuzzy/shadcn-ui/<custom-item>
```

同步 workflow 生成的 PR 不应修改 `components/custom`，而官方组件更新后应能在 `components/ui` 中显示可审阅的差异。

## 11. 风险与取舍

- npm 方式牺牲部分 shadcn 的“复制后自由修改”体验，换取跨项目版本管理和复用便利。
- 全量源码会让 Tailwind 扫描范围扩大；JavaScript Tree Shaking 不能保证 CSS 规则同样按 import 图删除。
- 官方组件更新可能包含 primitive、Tailwind 或配置迁移，需要保留人工审阅环节。
- registry 源码与 npm 构建源码存在不同的路径约束，必须通过独立的 registry 消费测试防止发布后才暴露问题。
