"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import sampleData from "./sample-data"

interface Product {
  id: string
  name: string
  category: string
  compatibility: string[]
  price: number
  inStock: boolean
  rating: number
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "compatibility",
    header: "Compatible With",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue("compatibility") as string[]).map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">
        ${row.getValue<number>("price").toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "inStock",
    header: "Availability",
    cell: ({ row }) => (
      <Badge variant={row.getValue("inStock") ? "default" : "destructive"}>
        {row.getValue("inStock") ? "In Stock" : "Out of Stock"}
      </Badge>
    ),
  },
]

export default function CatalogPage() {
  // Unwrap search params using the useSearchParams hook from next/navigation
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory)

  const filteredData = React.useMemo(() => {
    return selectedCategory === "all"
      ? sampleData
      : sampleData.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  const table = useReactTable({
    data: filteredData,
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
      <h1 className="text-2xl font-bold mb-6">GunGuru Product Catalog</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="optics">Optics</SelectItem>
            <SelectItem value="triggers">Triggers</SelectItem>
            <SelectItem value="barrels">Barrels</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1}{" "}
          to{" "}
          {Math.min(
            table.getState().pagination.pageSize * (table.getState().pagination.pageIndex + 1),
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} products
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
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
    </div>
  )
}