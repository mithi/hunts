import { Badge } from "@/components/ui/badge"
import { useHuntInfo, useTenantInfo } from "@/hooks/api"

export const TenantBadge = ({ id }: { id: string }) => {
    const { data } = useTenantInfo(id)
    return <Badge className="mx-1 text-center rounded-xl">{data?.tenantName ?? "..."}</Badge>
}

export const HuntBadge = ({ id }: { id: string }) => {
    const { data } = useHuntInfo(id)
    return <Badge className="mx-1 text-center rounded-xl">{data?.huntName ?? "..."}</Badge>
}
