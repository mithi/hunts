import { Button } from "../ui/button"
import { TooltipButtonWrapper } from "./tooltip-button-wrapper"

const GenericButton = ({
  disabled,
  disabledMsg,
  isLoading,
  onClick,
  label,
}: {
  label: string
  disabled?: boolean
  disabledMsg?: string
  isLoading?: boolean
  onClick?: () => void
}) => {
  if (disabled && disabledMsg) {
    if (disabledMsg) {
      return (
        <TooltipButtonWrapper message={disabledMsg}>
          <Button className="cursor-not-allowed">{label}</Button>
        </TooltipButtonWrapper>
      )
    }

    return <Button disabled>{label}</Button>
  }

  if (isLoading) {
    return <Button isLoading>{label}</Button>
  }

  return <Button onClick={onClick}>{label}</Button>
}

export default GenericButton
