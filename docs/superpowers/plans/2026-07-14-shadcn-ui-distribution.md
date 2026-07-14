# shadcn UI Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `puzzle-fuzzy/shadcn-ui` as a Bun/React UI source repository that publishes `@puzzle-fuzzy/shadcn-ui` to npm, exposes personal components through a shadcn registry, and receives reviewed upstream updates.

**Architecture:** A Bun workspace contains `packages/ui` as the publishable source package and `apps/docs` as a Vite consumer. Official shadcn files stay in `packages/ui/src/components/ui`; personal components stay in `custom`; generated entry aliases provide stable npm subpath imports. A root `registry.json` distributes registry-specific source items, while GitHub Actions handles CI, upstream update PRs, and changeset-based releases.

**Tech Stack:** Bun, TypeScript, React 19, Vite, Tailwind CSS, shadcn CLI, Radix/base primitives selected by the generated shadcn config, Vitest, Changesets, GitHub Actions.

## Global Constraints

- Repository is independent at `G:\puzzle-fuzzy-shadcn-ui`; do not modify `G:\SuperGlasses` or `puzzle-fuzzy/components`.
- GitHub repository is public and named `puzzle-fuzzy/shadcn-ui`.
- npm package name is `@puzzle-fuzzy/shadcn-ui`; do not reuse the existing Vue package `@puzzle-fuzzy/ui`.
- Use Bun commands and commit `bun.lock`; use `tsc` for type checking because Bun's bundler does not type-check.
- Official components live under `packages/ui/src/components/ui`; personal components live under `packages/ui/src/components/custom`.
- Never let upstream synchronization write to `custom` or silently overwrite a manually modified official component.
- Registry items must be copyable source files with explicit `registryDependencies`; they must not rely on private workspace aliases.
- Keep React and React DOM as peer dependencies of the published package.
- Every task ends with its focused verification command and a small Git commit.

---

### Task 1: Bootstrap the Bun workspace and repository metadata

**Files:**
- Create: `G:\puzzle-fuzzy-shadcn-ui\package.json`
- Create: `G:\puzzle-fuzzy-shadcn-ui\bunfig.toml`
- Create: `G:\puzzle-fuzzy-shadcn-ui\tsconfig.json`
- Create: `G:\puzzle-fuzzy-shadcn-ui\.gitignore`
- Create: `G:\puzzle-fuzzy-shadcn-ui\README.md`
- Modify: `G:\puzzle-fuzzy-shadcn-ui\docs/superpowers/plans/2026-07-14-shadcn-ui-distribution.md` only if implementation discoveries require a plan correction

**Interfaces:**
- Produces the root `workspaces` configuration consumed by all later tasks.
- Produces root scripts named `typecheck`, `lint`, `test`, `build`, and `verify`.

- [ ] **Step 1: Write the root manifests**

Create the root package metadata with Bun workspaces and scripts:

```json
{
  "name": "puzzle-fuzzy-shadcn-ui",
  "private": true,
  "type": "module",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "typecheck": "bun run --filter '*' typecheck",
    "lint": "bun run --filter '*' lint",
    "test": "bun run --filter '*' test",
    "build": "bun run --filter '*' build",
    "verify": "bun run typecheck && bun run lint && bun test && bun run build"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest"
  }
}
```

Use `bunfig.toml` with isolated workspaces and automatic text lockfile output:

```toml
[install]
linker = "isolated"
saveTextLockfile = true

[install.auto]
disable = true
```

Use a root `tsconfig.json` with project references to `packages/ui` and `apps/docs`, and ignore `node_modules`, `dist`, `.vite`, coverage, and generated registry output in `.gitignore`.

- [ ] **Step 2: Write the README project contract**

Document the two supported consumption paths:

```md
## npm

```tsx
import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import "@puzzle-fuzzy/shadcn-ui/styles.css"
```

## shadcn registry

```bash
bunx --bun shadcn@latest add puzzle-fuzzy/shadcn-ui/custom-item
```
```

Also state that `components/ui` is upstream-managed and `components/custom` is user-managed.

- [ ] **Step 3: Install root tooling and verify the workspace**

Run:

```bash
bun install
bun pm ls
```

Expected: Bun creates `bun.lock` and reports the root workspace without missing package errors.

- [ ] **Step 4: Commit the bootstrap**

```bash
git add package.json bunfig.toml tsconfig.json .gitignore README.md bun.lock
git commit -m "chore: bootstrap bun workspace"
```

### Task 2: Create the publishable UI package and initialize shadcn

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/styles/globals.css`
- Create: `packages/ui/components.json` through the shadcn CLI
- Create: `packages/ui/src/components/ui/*` through the shadcn CLI
- Create: `packages/ui/src/lib/utils.ts` through the shadcn CLI

**Interfaces:**
- Consumes: root Bun workspace from Task 1.
- Produces: official shadcn source components and the `components.json` configuration used by sync and registry commands.

- [ ] **Step 1: Add the package manifest**

Create `packages/ui/package.json`:

```json
{
  "name": "@puzzle-fuzzy/shadcn-ui",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src scripts --max-warnings 0",
    "test": "vitest run src",
    "verify": "bun run typecheck && bun run build && bun run test"
  },
  "peerDependencies": {
    "react": "^18.3.0 || ^19.0.0",
    "react-dom": "^18.3.0 || ^19.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

Add package-local TypeScript settings with `jsx: react-jsx`, strict mode, `moduleResolution: Bundler`, and an `@/*` alias pointing to `src/*`. Keep the generated `components.json` aliases as `@/components`, `@/lib/utils`, `@/hooks`, and `@/components/ui` so both generated code and package-local custom code resolve identically.

- [ ] **Step 2: Initialize shadcn with the Bun runner**

From the repository root, run:

```bash
bunx --bun shadcn@latest init --cwd packages/ui --template vite --yes
```

If the CLI asks for a base, select `radix`; select `lucide` for the icon library and enable CSS variables. Verify the generated `components.json` points its UI alias at `@puzzle-fuzzy/shadcn-ui/components` and its CSS file at `src/styles/globals.css`.

- [ ] **Step 3: Add all official components**

Run:

```bash
bunx --bun shadcn@latest add --cwd packages/ui --all --yes
```

Expected: the CLI writes official UI files under `packages/ui/src/components/ui`, installs only the dependencies required by the resolved registry items, and leaves `packages/ui/src/components/custom` absent or empty.

- [ ] **Step 4: Review the generated source**

Read the generated `components.json`, `src/lib/utils.ts`, `src/styles/globals.css`, and every generated UI file. Check that imports use the package aliases, components follow shadcn group/composition rules, and no generated code imports from the existing Vue project.

- [ ] **Step 5: Verify the package before adding custom code**

Run:

```bash
bun run --cwd packages/ui typecheck
```

Expected: PASS. If the CLI selected a different primitive base or alias format than the plan assumes, update the plan before continuing and keep the generated configuration as the source of truth.

- [ ] **Step 6: Commit the official source snapshot**

```bash
git add packages/ui
git commit -m "feat: add shadcn component source"
```

### Task 3: Add a real custom component and package entry generation

**Files:**
- Create: `packages/ui/src/components/custom/app-button.tsx`
- Create: `packages/ui/src/components/custom/app-button.test.tsx`
- Create: `packages/ui/src/entries/.gitkeep` initially, then generated entry files
- Create: `scripts/generate-entries.ts`
- Modify: `packages/ui/package.json`

**Interfaces:**
- Consumes: official `Button` and `cn` from Task 2.
- Produces: `AppButton` and generated stable entry paths such as `@puzzle-fuzzy/shadcn-ui/button` and `@puzzle-fuzzy/shadcn-ui/custom/app-button`.

- [ ] **Step 1: Install the component test toolchain**

Run:

```bash
bun add --cwd packages/ui -d vite @vitejs/plugin-react vite-tsconfig-paths vite-plugin-dts vitest @testing-library/react @testing-library/jest-dom jsdom eslint publint
```

- [ ] **Step 2: Write the custom component test**

Create a Vitest + Testing Library test that renders `AppButton`, asserts the passed label is visible, and verifies the `data-slot="button"` and `data-variant` attributes/classes from the composed official Button remain present.

Run:

```bash
bun test packages/ui/src/components/custom/app-button.test.tsx
```

Expected: FAIL because `AppButton` does not exist yet.

- [ ] **Step 3: Implement the minimal custom component**

Implement the component as a thin composition layer:

```tsx
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type AppButtonProps = ComponentProps<typeof Button>

export function AppButton({ size = "sm", variant = "secondary", ...props }: AppButtonProps) {
  return <Button size={size} variant={variant} {...props} />
}
```

Keep layout and visual behavior in shadcn variants and semantic tokens; do not add raw color utilities or an application request dependency.

- [ ] **Step 4: Implement deterministic entry generation**

Create `scripts/generate-entries.ts` that:

1. Deletes only `packages/ui/src/entries/generated`.
2. Finds `src/components/ui/**/*.tsx`, `src/components/custom/**/*.tsx`, `src/hooks/**/*.ts`, and `src/lib/**/*.ts`.
3. Writes one `export * from "..."` file per source module under `src/entries/generated`.
4. Maps `components/ui/button.tsx` to `button.ts`, `components/custom/app-button.tsx` to `custom/app-button.ts`, and preserves `hooks/*` and `lib/*` prefixes.
5. Fails if two sources produce the same public entry name.

Add the script to the package lifecycle:

```json
{
  "scripts": {
    "generate:entries": "bun scripts/generate-entries.ts",
    "prebuild": "bun run generate:entries"
  }
}
```

- [ ] **Step 5: Run the custom test and generation**

Run:

```bash
bun test packages/ui/src/components/custom/app-button.test.tsx
bun run --cwd packages/ui generate:entries
```

Expected: the test passes and generated files contain only deterministic re-export statements.

- [ ] **Step 6: Commit the custom slice**

```bash
git add packages/ui/src/components/custom packages/ui/src/entries scripts/generate-entries.ts packages/ui/package.json
git commit -m "feat: add custom app button entry"
```

### Task 4: Configure Vite library output and npm exports

**Files:**
- Create: `packages/ui/vite.config.ts`
- Modify: `packages/ui/package.json`
- Create: `packages/ui/README.md`
- Create: `packages/ui/LICENSE`

**Interfaces:**
- Consumes: generated entry files from Task 3.
- Produces: ESM JavaScript, declaration files, CSS, and package exports for every generated entry.

- [ ] **Step 1: Configure multi-entry Vite output**

Create `packages/ui/vite.config.ts` with `@vitejs/plugin-react`, `vite-tsconfig-paths`, and `vite-plugin-dts`. Discover all files under `src/entries/generated`, use their relative path without `.ts` as the Rollup entry key, emit ESM files into `dist`, preserve CSS as `dist/styles.css`, and externalize `react`, `react-dom`, and every runtime primitive dependency from the package manifest.

The entry map must produce:

```text
dist/button.js
dist/button.d.ts
dist/custom/app-button.js
dist/custom/app-button.d.ts
dist/styles.css
```

- [ ] **Step 2: Add exact package exports**

Update `packages/ui/package.json`:

```json
{
  "exports": {
    "./package.json": "./package.json",
    "./styles.css": "./dist/styles.css",
    "./*": {
      "types": "./dist/*.d.ts",
      "import": "./dist/*.js"
    }
  },
  "sideEffects": ["**/*.css"]
}
```

Do not add a CommonJS export. The package must fail clearly if a consumer imports a non-existent path.

- [ ] **Step 3: Build and inspect the npm package**

Run:

```bash
bun run --cwd packages/ui build
bunx --bun publint packages/ui
```

Expected: `dist/button.js`, `dist/button.d.ts`, `dist/custom/app-button.js`, `dist/custom/app-button.d.ts`, and `dist/styles.css` exist; publint reports no invalid export or package metadata errors.

- [ ] **Step 4: Commit package output configuration**

```bash
git add packages/ui/vite.config.ts packages/ui/package.json packages/ui/README.md packages/ui/LICENSE bun.lock
git commit -m "build: configure shadcn ui package exports"
```

### Task 5: Add the public registry and docs consumer

**Files:**
- Create: `registry.json`
- Create: `registry/custom/app-button/app-button.tsx`
- Create: `apps/docs/package.json`
- Create: `apps/docs/index.html`
- Create: `apps/docs/src/main.tsx`
- Create: `apps/docs/src/App.tsx`
- Create: `apps/docs/src/styles.css`
- Create: `apps/docs/vite.config.ts`

**Interfaces:**
- Consumes: `AppButton` design and package exports from Tasks 3–4.
- Produces: a real Vite consumer and a public GitHub registry item installable with `shadcn add`.

- [ ] **Step 1: Write the registry item**

Define `registry.json` with `name: "puzzle-fuzzy-shadcn-ui"`, homepage `https://github.com/puzzle-fuzzy/shadcn-ui`, and an `app-button` item. The item must list its source file and `registryDependencies: ["button"]`; the registry copy must use the consumer's `@/components/ui/button` alias, not the workspace package alias.

- [ ] **Step 2: Create the Vite docs consumer**

Create an `apps/docs` React Vite app that imports the workspace package through `@puzzle-fuzzy/shadcn-ui/button` and `@puzzle-fuzzy/shadcn-ui/custom/app-button`, imports the package CSS, and renders a small page showing both official and custom buttons in light and dark theme containers.

- [ ] **Step 3: Verify both distribution paths**

Run:

```bash
bun run --cwd apps/docs dev --host 127.0.0.1
bun run --cwd apps/docs build
bunx --bun shadcn@latest registry validate ./registry.json
bunx --bun shadcn@latest list puzzle-fuzzy/shadcn-ui
```

Expected: the docs app builds, registry validation passes, and the registry list contains `app-button`.

- [ ] **Step 4: Commit registry and docs**

```bash
git add registry.json registry apps/docs
git commit -m "feat: add registry and docs consumer"
```

### Task 6: Add CI and reviewed upstream synchronization

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/sync-upstream.yml`
- Create: `scripts/sync-upstream.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `packages/ui/components.json` and package verification scripts.
- Produces: scheduled upstream update PRs that touch only official component files and pass CI.

- [ ] **Step 1: Implement the sync script**

Create `scripts/sync-upstream.ts` that runs the official CLI from the repository root. It must parse `process.argv.includes("--dry-run")`; dry-run mode appends `--dry-run` to the CLI command and performs no allowlist failure check against modified files because the CLI must not write files. Normal mode uses the following command:

```ts
const command = [
  "bunx",
  "--bun",
  "shadcn@latest",
  "add",
  "--cwd",
  "packages/ui",
  "--all",
  "--overwrite",
  "--yes",
]
```

The script must fail on a non-zero exit code, then inspect `git diff --name-only` and exit with a non-zero code if any changed path is outside `packages/ui/src/components/ui`, `packages/ui/src/lib`, `packages/ui/src/hooks`, `packages/ui/src/styles`, `packages/ui/components.json`, or dependency manifests. This prevents an upstream run from modifying `custom` or unrelated application code.

- [ ] **Step 2: Add CI checks**

Configure `ci.yml` for pushes and pull requests to `main`. It installs with `bun install --frozen-lockfile`, then runs `bun run verify`, `bunx --bun shadcn@latest registry validate ./registry.json`, and a package tarball smoke test.

- [ ] **Step 3: Add scheduled sync PR workflow**

Configure `sync-upstream.yml` for `workflow_dispatch` and a weekly cron. It runs the sync script, generates entries, runs the focused UI verification, and uses the preinstalled `gh` CLI to create or update a draft branch `shadcn-upstream` only when `git diff --quiet` is false. The workflow must not merge or publish automatically.

- [ ] **Step 4: Test the safety boundary locally**

Run:

```bash
bun scripts/sync-upstream.ts --dry-run
```

Expected: the dry run reports the files it would update and does not change the worktree. In normal mode, the allowlist rejects any changed path outside the official component/config/dependency paths. Do not use `--overwrite` manually on files in `custom`.

- [ ] **Step 5: Commit CI and sync**

```bash
git add .github/workflows scripts/sync-upstream.ts package.json
git commit -m "ci: add shadcn upstream sync checks"
```

### Task 7: Add changesets, npm publish workflow, and final verification

**Files:**
- Create: `.changeset/config.json`
- Create: `.github/workflows/publish.yml`
- Create: `packages/ui/CHANGELOG.md`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: package build and CI from Tasks 4–6.
- Produces: versioned npm releases from reviewed commits.

- [ ] **Step 1: Install Changesets**

Run:

```bash
bun add -d @changesets/cli
bunx changeset init
```

Configure `.changeset/config.json` with `baseBranch: "main"`, `access: "public"`, and `updateInternalDependencies: "patch"`.

- [ ] **Step 2: Add release scripts**

Add:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "bun run build && changeset publish"
  }
}
```

- [ ] **Step 3: Add protected publish workflow**

Configure `publish.yml` on pushes to `main` and manual dispatch. It installs with the frozen lockfile, runs `bun run verify`, runs `changeset version` when release PRs are merged, and publishes only when a changeset exists. npm authentication must come from the repository's protected publish configuration; no token is committed.

- [ ] **Step 4: Run the complete local verification**

Run:

```bash
bun install --frozen-lockfile
bun run verify
bunx --bun shadcn@latest registry validate ./registry.json
bun pm pack --cwd packages/ui
```

Expected: every command exits zero, the tarball contains `dist`, `README.md`, and `LICENSE`, and it does not contain source test files or workspace-only configuration.

- [ ] **Step 5: Commit release tooling**

```bash
git add .changeset .github/workflows/publish.yml packages/ui/CHANGELOG.md package.json README.md bun.lock
git commit -m "ci: add changeset npm release"
```

## Self-review checklist

- Spec coverage: Tasks 1–2 cover the Bun workspace and full official source; Tasks 3–4 cover custom composition, ESM exports, declarations, and tree-shaking boundaries; Task 5 covers registry and docs; Task 6 covers reviewed upstream synchronization; Task 7 covers npm versioning and publish validation.
- Placeholder scan: no unresolved placeholder markers or unnamed files remain in the plan.
- Type consistency: generated entries are the sole public npm entrypoints; Vite output and package exports both use the same relative entry names; registry sources use consumer aliases instead of package aliases.
- Safety: the plan never stages `SuperGlasses`, never reuses `@puzzle-fuzzy/ui`, and limits upstream writes to an explicit allowlist.
