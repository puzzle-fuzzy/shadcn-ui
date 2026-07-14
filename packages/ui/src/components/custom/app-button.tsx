import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

export type AppButtonProps = ComponentProps<typeof Button>

export function AppButton({ size = "sm", variant = "secondary", ...props }: AppButtonProps) {
  return <Button size={size} variant={variant} {...props} />
}
