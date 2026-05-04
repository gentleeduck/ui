## Philosophy

Data tables are the workhorses of application UIs. Rather than shipping a monolithic DataTable component with 50 props, we teach you to build tables progressively using TanStack Table primitives. Each feature  -  sorting, filtering, pagination, selection  -  layers on independently. You only pay for what you use.

## Introduction

Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.

It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the flexibility that [headless UI](https://tanstack.com/table/v8/docs/introduction#what-is-headless-ui) provides.

So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.

We'll start with the basic `` component and build a complex data table from scratch.

} className="mt-4">

**Tip:** If you find yourself using the same table in multiple places in your app, you can always extract it into a reusable component.

## Table of Contents

This guide will show you how to use [TanStack Table](https://tanstack.com/table) and the `` component to build your own custom data table. We'll cover the following topics:

- [Basic Table](#basic-table)
- [Row Actions](#row-actions)
- [Pagination](#pagination)
- [Sorting](#sorting)
- [Filtering](#filtering)
- [Visibility](#visibility)
- [Row Selection](#row-selection)
- [Reusable Components](#reusable-components)

## Installation

1. Add the `` component to your project:

```bash
npx @gentleduck/cli add table
```

2. Add `tanstack/react-table` dependency:

```bash
npm install @tanstack/react-table
```

## Prerequisites

We are going to build a table to show recent payments. Here's what our data looks like:

```tsx showLineNumbers
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]
```

## Project Structure

Start by creating the following file structure:

```txt
app
└── payments
    ├── columns.tsx
    ├── data-table.tsx
    └── page.tsx
```

I'm using a Next.js example here but this works for any other React framework.

- `columns.tsx` (client component) will contain our column definitions.
- `data-table.tsx` (client component) will contain our `` component.
- `page.tsx` (server component) is where we'll fetch data and render our table.

## Basic Table

Let's start by building a basic table.

### Column Definitions

First, we'll define our columns.

```tsx showLineNumbers title="app/payments/columns.tsx" {3,14-27}
"use client"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef` component

Next, we'll create a `` component to render our table.

```tsx showLineNumbers title="app/payments/data-table.tsx"
"use client"

  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps` in multiple places, this is the component you could make reusable by extracting it to `components/ui/data-table.tsx`.

``

### Render the table

Finally, we'll render our table in our page component.

```tsx showLineNumbers title="app/payments/page.tsx" {22}

async function getData(): Promise

  )
}
```

## Cell Formatting

Let's format the amount cell to display the dollar amount. We'll also align the cell to the right.

### Update columns definition

Update the `header` and `cell` definitions for amount as follows:

```tsx showLineNumbers title="app/payments/columns.tsx" {4-15}
export const columns: ColumnDef` component for this.

### Update columns definition

Update our columns definition to add a new `actions` column. The `actions` cell returns a `` component.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,6-14,18-45}
"use client"

  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef

            ` component and the `table.previousPage()`, `table.nextPage()` API methods.

```tsx showLineNumbers title="app/payments/data-table.tsx" {1,15,21-39}

export function DataTable

      )
    },
  },
]
```

This will automatically sort the table (asc and desc) when the user toggles on the header cell.

## Filtering

Let's add a search input to filter emails in our table.

### Update `

    ),
    cell: ({ row }) => (
      
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
```

### Update `

  )
}
```

This adds a checkbox to each row and a checkbox in the header to select all rows.

### Show selected rows

You can show the number of selected rows using the `table.getFilteredSelectedRowModel()` API.

```tsx

    ),
  },
]
```

### Pagination

Add pagination controls to your table including page size and selection count.

```tsx

```

### Column toggle

A component to toggle column visibility.

```tsx

```