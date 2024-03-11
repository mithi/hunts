import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RunningTechnologiesTable({
  items,
}: {
  items: {
    port: number
    technology: { name: string; version: string }
  }[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Port</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={`${item.technology.name}${item.port}${item.technology.version}`}>
            <TableCell>{item.technology.name}</TableCell>
            <TableCell>{item.technology.version}</TableCell>
            <TableCell>{item.port}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
