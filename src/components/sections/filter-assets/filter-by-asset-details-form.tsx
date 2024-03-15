import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ReactNode, useState } from "react"
import { assetFilterParameters } from "@/db"
import { Combobox } from "@/components/common/combobox"
import { MultiSelect } from "@/components/common/multiselect"
import { useAssetFilterParameters } from "@/hooks/api"
import { InputLayout } from "@/components/common/misc"
import GenericButton from "@/components/common/generic-button"

const FilterByAssetDetailsLayout = ({
  tenant,
  technology,
  versions,
  button,
}: {
  tenant: ReactNode
  technology: ReactNode
  versions: ReactNode
  button: ReactNode
}) => {
  return (
    <Card className="pt-6 mb-4">
      <CardContent className="space-y-2">
        {tenant}
        <Card className="flex flex-col md:flex-row gap-2 px-4 py-2">
          <div className="w-full md:w-1/2 grow">{technology}</div>
          <div className="w-full md:w-1/2 grow">{versions}</div>
        </Card>
      </CardContent>
      <CardFooter>{button}</CardFooter>
    </Card>
  )
}

type AssetDetailsFilters = {
  tenantId: string
  technology: { name: string; versions: string[] }
}

const FilterByAssetDetailsForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (val: AssetDetailsFilters) => void
  isLoading?: boolean
}) => {
  const [filters, setFilters] = useState<AssetDetailsFilters>({
    tenantId: "",
    technology: { name: "", versions: [] },
  })

  const { data, error } = useAssetFilterParameters()

  const options = {
    tenants: Object.values(data?.tenants ?? {}).map(tenant => {
      return { value: tenant.tenantId, label: tenant.tenantName }
    }),
    technologies: Object.values(data?.technologies ?? []).map(tech => {
      return { value: tech.technologyName, label: tech.technologyName }
    }),
  }

  const incomplete =
    filters.tenantId === "" ||
    filters.technology.name === "" ||
    filters.technology.versions.length === 0
  const errored = error != null
  const disabled = incomplete || errored
  const disabledMsg = incomplete
    ? "Fill all required fields to continue."
    : "Not allowed at this time."

  return (
    <FilterByAssetDetailsLayout
      tenant={
        <InputLayout
          label="Tenant Name*"
          field={
            <Combobox
              options={options.tenants}
              value={filters.tenantId}
              onChange={newTenant =>
                setFilters(prev => {
                  return { ...prev, tenantId: newTenant }
                })
              }
            />
          }
        />
      }
      technology={
        <InputLayout
          label="Technology Name*"
          field={
            <Combobox
              options={options.technologies}
              value={filters.technology.name}
              onChange={techName =>
                setFilters(prev => {
                  const newState = {
                    ...prev,
                    technology: {
                      name: techName,
                      versions: [],
                    },
                  }
                  return newState
                })
              }
            />
          }
        />
      }
      versions={
        <InputLayout
          label="Versions* (Match Any)"
          field={
            <MultiSelect
              key={
                filters.technology
                  .name /** Hack: To refresh the component on change of  */
              }
              optionValues={
                assetFilterParameters.technologies[filters.technology.name]
                  ?.availableVersions ?? []
              }
              emptyText="Select a technology to see available versions"
              onChange={newVersions => {
                setFilters(prev => {
                  return {
                    ...prev,
                    technology: {
                      ...prev.technology,
                      versions: newVersions,
                    },
                  }
                })
              }}
            />
          }
        />
      }
      button={
        <GenericButton
          disabled={disabled}
          disabledMsg={disabledMsg}
          label="Apply Filters"
          onClick={() => {
            onSubmit(filters)
          }}
          isLoading={isLoading}
        />
      }
    />
  )
}

export default FilterByAssetDetailsForm
