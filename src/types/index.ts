/*** DB API TYPES *****/
export type TechnologyName = string
export type HuntId = string
export type TenantId = string
export type AssetId = string

export type Asset = {
  assetId: AssetId
  tenantId: AssetId
  macAddress: string
  timestamp: number
}

export type AssetDetails = {
  assetId: AssetId
  macAddress: string
  ipOrSubdomain: string
  timestamp: number
  tenantId: string
  runningTechnologies: {
    port: number
    technology: { name: TechnologyName; version: string }
  }[]
  huntIds: string[]
}

export type TechnologyInfo = {
  technologyName: TechnologyName
  availableVersions: string[]
}
export type TechnologyRecord = Record<TechnologyName, TechnologyInfo>

export type TenantInfo = { tenantId: TenantId; tenantName: string }
export type TenantRecord = Record<TenantId, { tenantId: TenantId; tenantName: string }>

export type HuntInfo = {
  huntId: HuntId
  huntName: string
  description: string
  tenantId: TenantId
}
export type HuntRecord = Record<HuntId, HuntInfo>

export type AssetFilterParameters = {
  technologies: TechnologyRecord
  tenants: TenantRecord
  hunts: HuntRecord
}

/*** TYPES FOR FRONT END *****/
export type AppliedFilters =
  | { type: "hunt"; payload: { huntId: string } }
  | {
      type: "asset-details"
      payload: {
        tenantId: string
        technology: { name: string; versions: string[] }
      }
    }
