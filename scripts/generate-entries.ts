import { readdir, rm, mkdir, writeFile } from "node:fs/promises"
import { dirname, extname, join, relative, resolve } from "node:path"

type Entry = {
  file: string
  publicName: string
}

const packageRoot = process.cwd()
const sourceRoot = resolve(packageRoot, "src")
const generatedRoot = resolve(sourceRoot, "entries/generated")

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(file)))
    } else {
      files.push(file)
    }
  }

  return files
}

function toPosix(value: string) {
  return value.replaceAll("\\", "/")
}

function toPublicName(file: string) {
  const sourceName = toPosix(relative(sourceRoot, file))
  const withoutExtension = sourceName.slice(0, -extname(sourceName).length)

  if (withoutExtension.startsWith("components/ui/")) {
    return withoutExtension.slice("components/ui/".length)
  }

  if (withoutExtension.startsWith("components/custom/")) {
    return `custom/${withoutExtension.slice("components/custom/".length)}`
  }

  return withoutExtension
}

async function main() {
  await rm(generatedRoot, { recursive: true, force: true })

  const candidates = [
    resolve(sourceRoot, "components/ui"),
    resolve(sourceRoot, "components/custom"),
    resolve(sourceRoot, "hooks"),
    resolve(sourceRoot, "lib"),
  ]
  const files: string[] = []

  for (const directory of candidates) {
    try {
      files.push(...(await collectFiles(directory)))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
    }
  }

  const entries: Entry[] = files
    .filter((file) => /\.(tsx?|jsx?)$/.test(file))
    .filter((file) => !/(^|[./])(?:test|spec)\.[^.]+$/.test(file))
    .map((file) => ({ file, publicName: toPublicName(file) }))
    .sort((left, right) => left.publicName.localeCompare(right.publicName))

  const names = new Set<string>()
  for (const entry of entries) {
    if (names.has(entry.publicName)) {
      throw new Error(`Duplicate public entry: ${entry.publicName}`)
    }
    names.add(entry.publicName)

    const outputFile = resolve(generatedRoot, `${entry.publicName}.ts`)
    const importPath = toPosix(relative(dirname(outputFile), entry.file).replace(/\.(tsx?|jsx?)$/, ""))
    const specifier = importPath.startsWith(".") ? importPath : `./${importPath}`

    await mkdir(dirname(outputFile), { recursive: true })
    await writeFile(outputFile, `export * from "${specifier}"\n`, "utf8")
  }

  console.log(`Generated ${entries.length} package entries in ${generatedRoot}`)
}

await main()
