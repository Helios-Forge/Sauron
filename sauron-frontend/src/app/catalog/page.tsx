"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

// Define our catalog item type.
type CatalogItem = {
  id: number
  name: string
  price: number
  category: string
  vendor: string
}

// Sample data – in a real app, you would fetch this from an API.
const sampleData: CatalogItem[] = [
  { id: 1, name: "AR-15 Rifle", price: 800, category: "firearms", vendor: "Vendor A" },
  { id: 2, name: "AK-47", price: 900, category: "firearms", vendor: "Vendor B" },
  { id: 3, name: "Trigger", price: 40, category: "parts", vendor: "Vendor C" },
  { id: 4, name: "Optic Sight", price: 120, category: "accessories", vendor: "Vendor D" },
  // ...more items
]

// Define our columns using TanStack Table's ColumnDef
const columns: ColumnDef<CatalogItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    },
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
]

interface CatalogPageProps {
  searchParams: {
    category?: string
  }
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  // Extract pre-applied category filter from the URL query.
  const { category } = searchParams

  // Pre-filter the sample data by category if provided.
  const filteredByCategory = React.useMemo(() => {
    return category
      ? sampleData.filter((item) => item.category === category)
      : sampleData
  }, [category])

  // Global search filter state.
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Configure the table instance using TanStack Table hooks.
  const table = useReactTable({
    data: filteredByCategory,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="container mx-auto p-4">
      {/* Global Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by name..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-4 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 