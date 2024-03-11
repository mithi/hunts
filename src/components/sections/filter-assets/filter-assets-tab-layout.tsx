import { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FilterAssetsTabLayout = ({
  byAssetDetailsTab,
  byHuntTab,
}: {
  byAssetDetailsTab: ReactNode
  byHuntTab: ReactNode
}) => {
  return (
    <Tabs defaultValue="filter-by-asset-details">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="filter-by-asset-details">Filter by Asset Details</TabsTrigger>
        <TabsTrigger value="filter-by-hunt">Filter by Hunt</TabsTrigger>
      </TabsList>
      <TabsContent value="filter-by-asset-details">{byAssetDetailsTab}</TabsContent>
      <TabsContent value="filter-by-hunt">{byHuntTab}</TabsContent>
    </Tabs>
  )
}

export default FilterAssetsTabLayout
