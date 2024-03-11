import SkeletonCard from "@/components/common/skeleton-card"
import { preloadAssetFilters, useAssetFilterParameters } from "@/hooks/api"
import { ErrorText } from "./components/common/misc"
import MainContent from "@/components/screens/main-content"

preloadAssetFilters()

function App() {
  const { isLoading, data } = useAssetFilterParameters()

  if (isLoading) {
    return <SkeletonCard />
  }

  return (
    <>
      {data == null && (
        <ErrorText text="Unable to retrieve data required to search. Try again later." />
      )}
      <MainContent />
    </>
  )
}

export default App
