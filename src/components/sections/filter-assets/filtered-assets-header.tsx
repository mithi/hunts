import { HuntBadge, TenantBadge } from "@/components/common/badges"
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
  return (
    <div className="py-4">
      <h1 className="mb-2 text-xl">Filtered Assets</h1>
      <Separator className="mb-2" />
      <div className="flex-1 text-sm text-muted-foreground ">
        <p>Displaying the {count} asset(s) that match your recently applied filters.</p>
        {filters.type === "hunt" ? (
          <div>
            Hunt: <HuntBadge id={filters.payload.huntId} />
          </div>
        ) : (
          <div className="leading-2 flex flex-wrap">
            Tenant: <TenantBadge id={filters.payload.tenantId} />
            Technology:
            <Badge className="mx-1">{filters.payload.technology.name}</Badge> with
            versions:{" "}
            {filters.payload.technology.versions.map(version => (
              <Badge key={version} className="mx-1 mt-1">
                {version}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppliedFiltersHeader
