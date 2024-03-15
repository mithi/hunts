import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AssetDetailsContent from "../asset-details/asset-details-content"
import { Asset } from "@/types"
import ViewMorePopover from "@/components/common/view-more-popover"
import { TenantBadge } from "@/components/common/badges"

const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "macAddress",
    header: "Asset Identifier",
    cell: ({ row }) => <>{row.getValue("macAddress")}</>,
  },
  {
    accessorKey: "tenantId",
    header: "Tenant",
    cell: ({ row }) => <TenantBadge id={row.getValue("tenantId")} />,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = Number(row.getValue("timestamp"))
      return <>{new Date(timestamp).toUTCString()}</>
    },
  },
  {
    id: "asset-details",
    header: "Asset Details",
    cell: ({ row }) => {
      return (
        <ViewMorePopover
          content={
            <AssetDetailsContent
              assetId={row.original.assetId}
              tenantId={row.original.tenantId}
            />
          }
        />
      )
    },
  },
]

export function AssetsTable({
  data,
  renderSelectedAssets,
  enableSelect,
}: {
  data: Asset[]
  enableSelect: boolean
  renderSelectedAssets?: (selected: Asset[]) => React.ReactNode
}) {
  const cols = React.useMemo(() => {
    return enableSelect ? columns : columns.slice(1)
  }, [enableSelect])

  const table = useReactTable({
    data,
    columns: cols,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const selectedAssets: Asset[] = table
    .getSelectedRowModel()
    ?.rows.map(row => row.original)

  return (
    <div>
      {enableSelect && (
        <div className="flex gap-2">
          <div className="text-sm h-8 text-muted-foreground">
            {selectedAssets.length} of {data.length} assets(s) selected.
          </div>
          {renderSelectedAssets?.(selectedAssets)}
        </div>
      )}
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AssetsTable
