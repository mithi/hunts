import { Label } from "@/components/ui/label"
import { ReactNode } from "react"

export const InputLayout = ({ label, field }: { label: string; field: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label>{label}</Label>
      {field}
    </div>
  )
}

export default InputLayout
