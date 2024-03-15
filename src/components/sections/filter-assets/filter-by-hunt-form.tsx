import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ReactNode, useState } from "react"
import { Combobox } from "@/components/common/combobox"
import { useAssetFilterParameters } from "@/hooks/api"
import GenericButton from "@/components/common/generic-button"
import { InputLayout } from "@/components/common/misc"

const FilterByHuntLayout = ({
  input,
  actions,
}: {
  input: ReactNode
  actions: ReactNode
}) => {
  return (
    <Card className="pt-6 mb-4">
      <CardContent className="space-y-2">{input}</CardContent>
      <CardFooter className="flex gap-2">{actions}</CardFooter>
    </Card>
  )
}

const FilterByHuntForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (hunt: string) => void
  isLoading?: boolean
}) => {
  const [hunt, setHunt] = useState<string>("")
  const { data } = useAssetFilterParameters()

  const huntOptions = Object.values(data?.hunts || {}).map(hunt => {
    return {
      value: hunt.huntId,
      label: hunt.huntName,
      description: hunt.description,
    }
  })

  const incomplete = hunt === ""
  const errored = data == null
  const disabled = incomplete || errored
  const disabledMsg = incomplete
    ? "Fill all required fields to continue."
    : "Not allowed at this time."

  return (
    <FilterByHuntLayout
      input={
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
      }
      actions={
        <GenericButton
          disabled={disabled}
          disabledMsg={disabledMsg}
          isLoading={isLoading}
          label="Apply Filters"
          onClick={() => {
            onSubmit(hunt)
          }}
        />
      }
    />
  )
}

export default FilterByHuntForm
