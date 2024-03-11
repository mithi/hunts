import useSWR, { preload } from "swr"
import {
  APIgetHuntAssets,
  APIgetTenantAssetDetails,
  APIgetTenantAssets,
  assetFilterParameters,
} from "@/db"
import {
  AppliedFilters,
  Asset,
  AssetDetails,
  AssetFilterParameters,
  HuntInfo,
  TechnologyInfo,
  TenantInfo,
} from "@/types"
import { sleep } from "@/lib/utils"

const FETCH_ASSET_FILTER_KEY = "/api/asset-filter-parameters"
const fetchAssetFilters = () => sleep(1500).then(() => assetFilterParameters)

export const preloadAssetFilters = () =>
  preload(FETCH_ASSET_FILTER_KEY, fetchAssetFilters)

export const useAssetFilterParameters = () => {
  const state = useSWR<AssetFilterParameters>(FETCH_ASSET_FILTER_KEY, fetchAssetFilters, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })
  return state
}

export const useFilteredAssets = (appliedFilters: AppliedFilters | null) => {
  const state = useSWR<Asset[]>(
    appliedFilters,
    () => {
      return sleep(3000).then(() => {
        return appliedFilters == null
          ? []
          : appliedFilters.type === "asset-details"
            ? APIgetTenantAssets(
                appliedFilters.payload.tenantId,
                appliedFilters.payload.technology.name,
                appliedFilters.payload.technology.versions
              )
            : APIgetHuntAssets(appliedFilters.payload.huntId)
      })
    },
    { keepPreviousData: true, revalidateOnFocus: false }
  )

  return state
}

export const useTenantAssetDetails = (
  tenantId: string,
  assetId: string
): AsyncState<AssetDetails | null | undefined> => {
  const state = useSWR<AssetDetails | null>(
    [assetId, tenantId],
    () => {
      return sleep(2000).then(() => APIgetTenantAssetDetails(tenantId, assetId))
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )

  return state
}

type AsyncState<T> = { data: T; isLoading: boolean; isValidating: boolean; error?: Error }

export const useHuntInfo = (id: string): AsyncState<HuntInfo | null | undefined> => {
  const { data, ...rest } = useAssetFilterParameters()
  return { ...rest, data: data?.hunts?.[id] }
}

export const useTenantInfo = (id: string): AsyncState<TenantInfo | null | undefined> => {
  const { data, ...rest } = useAssetFilterParameters()
  return { ...rest, data: data?.tenants?.[id] }
}

export const useTechnologyInfo = (
  id: string
): AsyncState<TechnologyInfo | null | undefined> => {
  const { data, ...rest } = useAssetFilterParameters()
  return { ...rest, data: data?.technologies?.[id] }
}
