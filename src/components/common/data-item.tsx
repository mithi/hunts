import { Badge } from "@/components/ui/badge"
import { ReactNode } from "react"
import { MutedText } from "./misc"

const DataItem = ({ field, value }: { field: string; value: string | ReactNode }) => {
  return (
    <div className="flex gap-2">
      <MutedText text={field} />
      {typeof value === "string" ? <Badge>{value}</Badge> : value}
    </div>
  )
}

export default DataItem
