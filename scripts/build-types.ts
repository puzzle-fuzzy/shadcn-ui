import { mkdir, writeFile } from "node:fs/promises"
import { relative, resolve } from "node:path"

const packageRoot = process.cwd()
const distRoot = resolve(packageRoot, "dist")
const typesRoot = resolve(distRoot, "types")

const processResult = Bun.spawn(
  [
    "tsc",
    "--emitDeclarationOnly",
    "--declaration",
    "--declarationMap",
    "false",
    "--noEmit",
    "false",
    "--outDir",
    "dist/types",
    "--rootDir",
    "src",
    "--pretty",
    "false",
  ],
  { stdout: "pipe", stderr: "pipe" }
)

const [exitCode, stdout, stderr] = await Promise.all([
  processResult.exited,
  new Response(processResult.stdout).text(),
  new Response(processResult.stderr).text(),
])

if (stdout) process.stdout.write(stdout)
if (stderr) process.stderr.write(stderr)
if (exitCode !== 0) {
  throw new Error(`Type declaration build failed with exit code ${exitCode}`)
}

const publicDeclaration = resolve(typesRoot, "entries/generated/public.d.ts")
await mkdir(distRoot, { recursive: true })
await writeFile(distRoot + "/public.d.ts", `export * from "./types/entries/generated/public"\n`, "utf8")

if (!(await Bun.file(publicDeclaration).exists())) {
  throw new Error(`Expected generated declaration was not found: ${publicDeclaration}`)
}

console.log(`Generated package declarations in ${relative(packageRoot, typesRoot)}`)
