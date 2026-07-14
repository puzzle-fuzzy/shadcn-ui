import { Button } from "@puzzle-fuzzy/shadcn-ui/button"
import { AppButton } from "@puzzle-fuzzy/shadcn-ui/custom/app-button"
import "@puzzle-fuzzy/shadcn-ui/styles.css"

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
      </div>
    </main>
  )
}
