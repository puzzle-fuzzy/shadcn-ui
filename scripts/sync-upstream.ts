const isDryRun = process.argv.includes("--dry-run")
const repoRoot = process.cwd()

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

if (isDryRun) {
  command.push("--dry-run")
}

const before = Bun.spawnSync(["git", "status", "--porcelain"], {
  cwd: repoRoot,
  stdout: "pipe",
  stderr: "pipe",
})
const beforeStatus = new TextDecoder().decode(before.stdout)

const result = Bun.spawn(command, {
  cwd: repoRoot,
  stdout: "inherit",
  stderr: "inherit",
})
const exitCode = await result.exited

if (exitCode !== 0) {
  throw new Error(`shadcn upstream sync failed with exit code ${exitCode}`)
}

const after = Bun.spawnSync(["git", "status", "--porcelain"], {
  cwd: repoRoot,
  stdout: "pipe",
  stderr: "pipe",
})
const afterStatus = new TextDecoder().decode(after.stdout)

if (isDryRun) {
  if (beforeStatus !== afterStatus) {
    throw new Error("shadcn dry-run changed the worktree")
  }
  console.log("Dry run complete; the worktree is unchanged.")
  process.exit(0)
}

const changed = new TextDecoder()
  .decode(Bun.spawnSync(["git", "diff", "--name-only"], { cwd: repoRoot, stdout: "pipe" }).stdout)
  .split(/\r?\n/)
  .filter(Boolean)

const allowed = [
  /^packages\/ui\/src\/components\/ui(?:\/|$)/,
  /^packages\/ui\/src\/hooks(?:\/|$)/,
  /^packages\/ui\/src\/lib(?:\/|$)/,
  /^packages\/ui\/src\/styles(?:\/|$)/,
  /^packages\/ui\/components\.json$/,
  /^packages\/ui\/package\.json$/,
  /^package\.json$/,
  /^bun\.lock$/,
]

const unexpected = changed.filter((file) => !allowed.some((pattern) => pattern.test(file)))
if (unexpected.length > 0) {
  throw new Error(`Upstream sync touched protected paths:\n${unexpected.join("\n")}`)
}

console.log(changed.length === 0 ? "Upstream is already current." : `Updated ${changed.length} allowed file(s).`)
