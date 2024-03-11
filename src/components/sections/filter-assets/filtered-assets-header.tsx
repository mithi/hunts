import { HuntBadge, TenantBadge } from "@/components/common/misc"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AppliedFilters } from "@/types"

const AppliedFiltersHeader = ({
  count,
  filters,
}: {
  count: number
  filters: AppliedFilters
}) => {
  const description = `Displaying the ${count} asset(s) that match your recently applied filters.`
  const appliedInfo =
    filters.type === "hunt" ? (
      <div>
        Hunt: <HuntBadge id={filters.payload.huntId} />
      </div>
    ) : (
      <div className="leading-2 flex">
        Tenant: <TenantBadge id={filters.payload.tenantId} />
        Technology:
        <Badge className="mx-1">{filters.payload.technology.name}</Badge> with versions:{" "}
        {filters.payload.technology.versions.map(version => (
          <Badge key={version} className="mx-1">
            {version}
          </Badge>
        ))}
      </div>
    )

  return (
    <div className="py-4">
      <h1 className="mb-2 text-xl">Filtered Assets</h1>
      <Separator className="mb-2" />
      <div className="flex-1 text-sm text-muted-foreground ">
        {description}
        {appliedInfo}
      </div>
    </div>
  )
}

export default AppliedFiltersHeader
