import DataItem from "@/components/common/data-item"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RunningTechnologiesTable } from "./running-technologies-table"
import { useTenantAssetDetails } from "@/hooks/api"
import SkeletonCard from "@/components/common/skeleton-card"
import { ErrorText, HuntBadge, MutedText, TenantBadge } from "@/components/common/misc"
import { Card } from "@/components/ui/card"
import { AssetDetails } from "@/types"

const AssetDetailsDisplay = ({ asset }: { asset: AssetDetails }) => {
  return (
    <div className="flex flex-col gap-2 m-0 p-0">
      <h1 className="text-xl leading-none flex align-items-center gap-2">
        Asset Details <Badge>{asset.macAddress}</Badge>
      </h1>
      <Separator />
      <ScrollArea className="px-4 h-[380px]">
        <Accordion type="multiple" className="w-[325px]">
          <AccordionItem value="item-1">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 my-4">
                <DataItem
                  field={"Timestamp"}
                  value={new Date(asset.timestamp).toUTCString()}
                />
                <DataItem field={"Tenant"} value={<TenantBadge id={asset.tenantId} />} />
                <DataItem field={"Identifier"} value={asset.macAddress} />
                <DataItem field={"IP or Subdomain"} value={asset.ipOrSubdomain} />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Technologies Running</AccordionTrigger>
            <AccordionContent>
              {asset.runningTechnologies.length > 0 ? (
                <RunningTechnologiesTable items={asset.runningTechnologies} />
              ) : (
                <MutedText text="No technologies running." />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Attached To Hunts</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-1 mt-4">
                {asset.huntIds.map(hunt => {
                  return <HuntBadge key={hunt} id={hunt} />
                })}
                {asset.huntIds.length === 0 && (
                  <MutedText text="This asset is not yet attached to any hunt." />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
}
const AssetDetailsContent = ({
  tenantId,
  assetId,
}: {
  tenantId: string
  assetId: string
}) => {
  const { data, isLoading, error } = useTenantAssetDetails(tenantId, assetId)

  if (isLoading) {
    return <SkeletonCard />
  }

  if (error) {
    return (
      <Card className="m-4 p-4">
        {" "}
        <ErrorText text="Cannot fetch this data at this time. Try again later" />
      </Card>
    )
  }

  if (data == null) {
    return (
      <Card className="m-4 p-4">
        {" "}
        Asset Data Not Available. Try refreshing the page or come back later.{" "}
      </Card>
    )
  }

  return <AssetDetailsDisplay asset={data} />
}

export default AssetDetailsContent
