import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AppButton } from "./app-button"

describe("AppButton", () => {
  it("composes the official Button with personal defaults", () => {
    render(<AppButton>Open</AppButton>)

    const button = screen.getByRole("button", { name: "Open" })

    expect(button).toHaveAttribute("data-slot", "button")
    expect(button.className).toContain("bg-secondary")
    expect(button.className).toContain("h-7")
  })
})
