import { Combobox } from "@/components/common/combobox"
import GenericButton from "@/components/common/generic-button"
import InputLayout from "@/components/common/input-layout"
import { ErrorText, MutedText, TenantBadge } from "@/components/common/misc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { APIupdateHuntAssets } from "@/db"
import { useAssetFilterParameters } from "@/hooks/api"
import { sleep } from "@/lib/utils"
import { Asset } from "@/types"
import { useState } from "react"

export function AssignHuntDialog({
  assets,
  tenantId,
}: {
  assets: Asset[]
  tenantId: string
}) {
  const [open, setOpen] = useState(false)

  const [hunt, setHunt] = useState<string>("")
  const [mutateState, setMutateState] = useState<
    "LOADING" | "ERRORED" | "COMPLETED" | "IDLE"
  >("IDLE")
  const { data, isLoading } = useAssetFilterParameters()

  const huntOptions = Object.values(data?.hunts || {})
    .filter(h => h.tenantId === tenantId)
    .map(h => {
      return {
        value: h.huntId,
        label: h.huntName,
        description: h.description,
      }
    })

  const incomplete = hunt === ""
  const errored = data == null
  const disabled = incomplete || errored
  const disabledMsg = incomplete
    ? "Fill all required fields to continue."
    : "Not allowed at this time."

  const { toast } = useToast()

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="py-3 px-4 m-0 h-4">
          Attach ({assets.length}) Assets to a Hunt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attach ({assets.length}) Assets to a Hunt</DialogTitle>
          <DialogDescription>
            *Only hunts belonging to the current tenant <TenantBadge id={tenantId} /> is
            displayed.
          </DialogDescription>
        </DialogHeader>
        <InputLayout
          label="Hunt Name*"
          field={
            <Combobox
              options={huntOptions}
              value={hunt}
              onChange={newHunt => {
                setHunt(newHunt)
              }}
            />
          }
        />

        <MutedText
          text={`The ${assets.length} asset(s) with identifiers listed below will be attached to this hunt:`}
        />
        <ScrollArea className="max-h-[60px]">
          {assets.map(asset => {
            return (
              <Badge className="mx-1" key={asset.assetId}>
                {asset.macAddress}
              </Badge>
            )
          })}
        </ScrollArea>
        {mutateState === "ERRORED" && (
          <ErrorText
            text={"Failed to attach hunt to the specified asset. Please try again."}
          />
        )}
        <DialogFooter>
          <GenericButton
            disabled={disabled}
            disabledMsg={disabledMsg}
            label="Attach"
            onClick={() => {
              setMutateState("LOADING")
              sleep(5000)
                .then(() => {
                  APIupdateHuntAssets(
                    hunt,
                    assets.map(asset => asset.assetId)
                  )
                  setMutateState("COMPLETED")
                  toast({
                    title: "Request Successful",
                    description: `${assets.length} Assets(s) was added to the selected hunt`,
                  })

                  setOpen(false)
                })
                .catch(() => {
                  setMutateState("ERRORED")
                })
            }}
            isLoading={isLoading || mutateState === "LOADING"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AssignHuntDialog
