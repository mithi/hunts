import { useState } from "react"

import { AppliedFilters } from "@/types"
import AssetsTable from "@/components/sections/assets-table"
import AssignHuntDialog from "@/components/sections/assign-hunt-dialog"
import {
  FilterByHuntForm,
  FilterByAssetDetailsForm,
  AppliedFiltersHeader,
  FilterAssetsTabLayout,
} from "@/components/sections/filter-assets"
import SkeletonCard from "@/components/common/skeleton-card"
import { useFilteredAssets } from "@/hooks/api"

const MainContent = () => {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(null)
  const {
    data,
    isLoading: isLoadingAssets,
    isValidating: isValidatingAssets,
  } = useFilteredAssets(appliedFilters)
  const isFetchingAssets = isLoadingAssets || isValidatingAssets
  const assets = data ?? []

  return (
    <>
      <FilterAssetsTabLayout
        byAssetDetailsTab={
          <FilterByAssetDetailsForm
            isLoading={isFetchingAssets}
            onSubmit={newAssetDetails => {
              setAppliedFilters({ type: "asset-details", payload: newAssetDetails })
            }}
          />
        }
        byHuntTab={
          <FilterByHuntForm
            isLoading={isFetchingAssets}
            onSubmit={newHunt => {
              setAppliedFilters({ type: "hunt", payload: { huntId: newHunt } })
            }}
          />
        }
      />
      {!isFetchingAssets && (
        <>
          {appliedFilters && (
            <AppliedFiltersHeader count={assets.length} filters={appliedFilters} />
          )}
          <AssetsTable
            data={assets}
            enableSelect={appliedFilters?.type === "asset-details"}
            renderSelectedAssets={assets => {
              if (appliedFilters?.type !== "asset-details" || assets.length === 0) {
                return null
              }

              return (
                <AssignHuntDialog
                  assets={assets}
                  tenantId={appliedFilters.payload.tenantId}
                />
              )
            }}
          />
        </>
      )}
      {isFetchingAssets && <SkeletonCard />}
    </>
  )
}

export default MainContent
