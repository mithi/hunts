import { Badge } from "@/components/ui/badge"
import { useHuntInfo, useTenantInfo } from "@/hooks/api"

export const TenantBadge = ({ id }: { id: string }) => {
  const { data } = useTenantInfo(id)
  return <Badge className="mx-1">{data?.tenantName ?? "..."}</Badge>
}

export const HuntBadge = ({ id }: { id: string }) => {
  const { data } = useHuntInfo(id)
  return <Badge className="mx-1">{data?.huntName ?? "..."}</Badge>
}

export const ErrorText = ({ text }: { text?: string }) => (
  <div role="alert" className="text-red-600 font-bold my-1 text-sm">
    {text ?? "Error retrieving data required to search. Try again later."}
  </div>
)

export const MutedText = ({ text }: { text: string }) => {
  return <p className="text-muted-foreground text-sm text-left">{text}</p>
}
