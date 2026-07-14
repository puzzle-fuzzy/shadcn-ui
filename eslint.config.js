import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "packages/ui/src/entries/generated/**"],
  },
  ...tseslint.configs.recommended,
)
