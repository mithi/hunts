import { Badge } from "@/components/ui/badge"
import { Label } from "@radix-ui/react-label"
import { ReactNode } from "react"

export const ErrorText = ({ text }: { text?: string }) => (
  <div role="alert" className="text-red-600 font-bold my-1 text-sm">
    {text ?? "Error retrieving data required to search. Try again later."}
  </div>
)

export const MutedText = ({ text }: { text: string }) => {
  return <p className="text-muted-foreground text-sm text-left">{text}</p>
}

export const DataItem = ({
  field,
  value,
}: {
  field: string
  value: string | ReactNode
}) => {
  return (
    <div className="flex gap-2">
      <MutedText text={field} />
      {typeof value === "string" ? <Badge>{value}</Badge> : value}
    </div>
  )
}

export const InputLayout = ({ label, field }: { label: string; field: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label>{label}</Label>
      {field}
    </div>
  )
}

export const Spinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-4 w-4 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
