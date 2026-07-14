import { readFileSync, readdirSync } from "node:fs"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitest/config"

const packageRoot = dirname(fileURLToPath(import.meta.url))
const generatedRoot = resolve(packageRoot, "src/entries/generated")

function collectEntries(directory: string): string[] {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = resolve(directory, entry.name)
      return entry.isDirectory() ? collectEntries(file) : file.endsWith(".ts") ? [file] : []
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []
    }
    throw error
  }
}

const entries = Object.fromEntries(
  collectEntries(generatedRoot).map((file) => [
    relative(generatedRoot, file).replace(/\.ts$/, "").replaceAll("\\", "/"),
    file,
  ])
)

entries.styles = resolve(packageRoot, "src/styles/entry.ts")

const packageJson = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const external = [...Object.keys(packageJson.dependencies ?? {}), ...Object.keys(packageJson.peerDependencies ?? {})].map(
  (name) => new RegExp(`^${escapeRegExp(name)}(?:/|$)`)
)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "styles",
    },
    rollupOptions: {
      external,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
})
