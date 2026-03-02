# Components Structure (Track B)

## Organization

- **`ui/`** – Reusable primitives from Radix UI + Tailwind (Button, Input, Dialog, Select, etc.)
- **Feature components** – App-specific: `app-sidebar`, `top-navbar`, `add-expense-form`, `expenses-table`, etc.
- **Charts** – `monthly-chart`, `category-chart` (Recharts)
- **Auth** – `login-form`, `theme-provider`, `theme-toggle`

## Usage

Import from `@/components/...` – no barrel exports to avoid circular deps.
