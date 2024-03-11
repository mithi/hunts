import assetDetailsATandT from "./asset-details/ATandT"
import assetDetailsCigna from "./asset-details/Cigna"
import assetDetailsCisco from "./asset-details/Cisco"
import assetDetailsMicrosoft from "./asset-details/Microsoft"
import {
  TechnologyName,
  HuntId,
  TenantId,
  AssetId,
  Asset,
  AssetDetails,
  TechnologyRecord,
  TenantRecord,
  HuntRecord,
  AssetFilterParameters,
} from "@/types"

const nodejs_versions = [
  "18.18.2",
  "18.19.0",
  "18.19.1",
  "20.11.0",
  "20.11.1",
  "21.7.0",
  "21.7.1",
]

const nginx_versions = [
  "1.18.0",
  "1.20.0",
  "1.20.1",
  "1.20.2",
  "1.22.0",
  "1.22.1",
  "1.24.0",
]

const tomcat_versions = ["9.0.79", "9.0.86", "10.0.7", "10.0.8", "10.1.18", "10.1.19"]

const technologies = [
  { technologyName: "Node.js", availableVersions: nodejs_versions },
  { technologyName: "Nginx", availableVersions: nginx_versions },
  { technologyName: "Apache Tomcat", availableVersions: tomcat_versions },
]

const tenants = [
  {
    tenantId: "9962fc8c-64da-49d0-a1be-4a07b214a1ed",
    tenantName: "Cisco Systems, Inc.",
    assets: assetDetailsCisco,
  },
  {
    tenantId: "5aa8fe05-8dde-48e1-921e-a4ca8ef97156",
    tenantName: "The Cigna Group",
    assets: assetDetailsCigna,
  },
  {
    tenantId: "829a20e1-ccc2-420c-8340-a0f43780936d",
    tenantName: "AT&T Inc.",
    assets: assetDetailsATandT,
  },
  {
    tenantId: "e770e67b-0be2-4204-bd4a-99f74e054071",
    tenantName: "Microsoft Corporation",
    assets: assetDetailsMicrosoft,
  },
]

const hunts = [
  {
    huntId: "6fdcf583-bae9-45db-ba3f-41dad86a1ad8",
    huntName: "For Cisco Systems, Inc. CVE-2022-41741 (hunt) ",
    description:
      "CVE-2022-41741 affects Nginx 1.1.3-1.23.1 (not vulnerable: 1.23.2+, 1.22.1+)",
    tenantId: "9962fc8c-64da-49d0-a1be-4a07b214a1ed",
  },

  {
    huntId: "4b5c34d5-0316-474e-a97c-69b412603687",
    huntName: "For Cisco Systems, Inc. - CVE-2023-46589 (hunt) ",
    description: "CVE-2023-46589 affects Tomcat 9.0.0-M1 to 9.0.82",
    tenantId: "9962fc8c-64da-49d0-a1be-4a07b214a1ed",
  },

  {
    huntId: "0e4b4d0f-11c5-42de-8b29-e15c61d62ba5",
    huntName: "For  AT&T Inc. CVE-2024-22019 (hunt)",
    description: "CVE-2024-22019 affects Nodejs 18.x, 20.x, 21.x",
    tenantId: "829a20e1-ccc2-420c-8340-a0f43780936d",
  },

  {
    huntId: "330f465b-5667-4101-9a3a-1ebdd6434773",
    huntName: "For The Cigna Group CVE-2022-41741 (hunt) ",
    description:
      "CVE-2022-41741 affects Nginx 1.1.3-1.23.1 (not vulnerable: 1.23.2+, 1.22.1+)",
    tenantId: "5aa8fe05-8dde-48e1-921e-a4ca8ef97156",
  },

  {
    huntId: "9de1f7c7-5b24-492c-b1a4-ba49bdae27ae",
    huntName: "Micro For Microsoft Corporation CVE-2023-46589 (hunt) ",
    description: "CVE-2023-46589 affects Tomcat 9.0.0-M1 to 9.0.82",
    tenantId: "e770e67b-0be2-4204-bd4a-99f74e054071",
  },
]

const huntIds = hunts.map(hunt => hunt.huntId)

const createInitialHuntAssetsRecord = (): Record<HuntId, Set<AssetId>> => {
  return huntIds.reduce(
    (acc, current) => {
      acc[current] = new Set<AssetId>()
      return acc
    },
    {} as Record<HuntId, Set<AssetId>>
  )
}

function createRecord<T>(arr: T[], key: keyof T): Record<string, T> {
  return arr.reduce(
    (acc, current) => {
      const id = current[key] as string
      acc[id] = current
      return acc
    },
    {} as Record<string, T>
  )
}

function createAssetDetailsRecordNoHuntIds(
  tenantId: TenantId,
  arr: Omit<AssetDetails, "tenantId" | "huntIds">[]
): Record<AssetId, Omit<AssetDetails, "huntIds">> {
  const tenantAssets = arr.reduce(
    (acc, current) => {
      acc[current.assetId] = { ...current, tenantId }
      return acc
    },
    {} as Record<AssetId, Omit<AssetDetails, "huntIds">>
  )
  return tenantAssets
}

type TenantAssetsRecord = Record<
  TenantId,
  { assets: Record<AssetId, Omit<AssetDetails, "huntIds">> }
>

const allAssetsRecord: TenantAssetsRecord = tenants.reduce((acc, tenant) => {
  const tenantId = tenant.tenantId
  const tenantAssets = createAssetDetailsRecordNoHuntIds(tenantId, tenant.assets)
  acc[tenantId] = { assets: tenantAssets }
  return acc
}, {} as TenantAssetsRecord)

const tenantRecord: TenantRecord = createRecord(tenants, "tenantId")
const huntRecord: HuntRecord = createRecord(hunts, "huntId")
const technologyRecord: TechnologyRecord = createRecord(technologies, "technologyName")

// Get Filter Parameters for filtering assets (Response: AssetFilterParameters)
// GET /api/asset-filter-parameters
export const assetFilterParameters: AssetFilterParameters = {
  tenants: tenantRecord,
  hunts: huntRecord,
  technologies: technologyRecord,
}

// Filter assets by asset details given a tenant (Response: Asset[])
// GET /api/tenants/:tenantId/assets/?technology=TECH_NAME&versions=VERSION1,VERSION2
export const APIgetTenantAssets = (
  tenant: TenantId,
  technology: TechnologyName,
  technologyVersions: string[]
): Asset[] => {
  const tenantAssets: Asset[] = Object.values(allAssetsRecord[tenant].assets ?? {})
    .filter(assetDetails => {
      return assetDetails.runningTechnologies.find(runningTech => {
        const include =
          runningTech.technology.name === technology &&
          technologyVersions.includes(runningTech.technology.version)
        return include
      })
    })
    .map(asset => {
      const { assetId, macAddress, timestamp } = asset
      return { assetId, macAddress, timestamp, tenantId: tenant }
    })

  return tenantAssets
}

/* mutable */
const huntAssetsRecord = createInitialHuntAssetsRecord()

// Get basic asset information associated to a hunt (Response: Asset[])
// GET /api/hunts/:huntId/assets/
export const APIgetHuntAssets = (huntId: HuntId): Asset[] => {
  const huntDetails = huntRecord[huntId]
  if (huntDetails == null) {
    return []
  }
  const tenantAssets = allAssetsRecord[huntDetails.tenantId].assets
  const assetIds: Set<AssetId> = huntAssetsRecord[huntId] ?? new Set<AssetId>()
  const assets: Asset[] = [...assetIds]
    .filter(assetId1 => {
      return tenantAssets[assetId1] != null
    })
    .map(assetId2 => {
      const { timestamp, macAddress, assetId } = tenantAssets[assetId2]
      return { timestamp, macAddress, assetId, tenantId: huntDetails.tenantId }
    })

  return assets
}

// Get detailed information given specific asset (Response: AssetDetails | null)
// GET /api/tenants/:tenantId/assets/:assetId/
export const APIgetTenantAssetDetails = (
  tenantId: TenantId,
  assetId: AssetId
): AssetDetails | null => {
  const partialRecord = allAssetsRecord[tenantId]?.assets?.[assetId]

  if (partialRecord == null) {
    return null
  }

  const huntIds = hunts
    .filter(
      hunt => hunt.tenantId === tenantId && huntAssetsRecord[hunt.huntId].has(assetId)
    )
    .map(hunt => hunt.huntId)

  const assetDetails: AssetDetails = { ...partialRecord, huntIds }
  return assetDetails
}

// Update a hunt to include a list of assets (Request: { assetIds: AssetId[] })
// PUT /api/hunts/:huntId
export const APIupdateHuntAssets = (huntId: HuntId, newAssetIds: AssetId[]) => {
  const assetIds: Set<AssetId> = huntAssetsRecord[huntId]
  newAssetIds.forEach(item => assetIds.add(item))
  return
}
