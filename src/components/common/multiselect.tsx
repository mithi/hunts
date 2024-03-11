import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type OptionType = Record<"value" | "label", string>

const mapVals = (options: OptionType[]) => options.map(option => option.value)

/*
Heavily Copied (but modified) from: https://craft.mxkaske.dev/post/fancy-multi-select

Important Note: 
This component violates this principle:
https://kentcdodds.com/blog/dont-sync-state-derive-it

Because "selected" is a state that is kept by this component
but also passes this value on change, which means the parent component
could be keeping a duplicate state of this as well. 
Instead of being a uncontrolled component, we can update this to 
be an controlled component instead 

TODO: Fix this in the future
*/
export function MultiSelect({
  optionValues,
  onChange,
  emptyText,
}: {
  optionValues: string[]
  onChange: (val: string[]) => void
  emptyText: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<OptionType[]>([])
  const [inputValue, setInputValue] = React.useState("")

  const options = React.useMemo(() => {
    // TODO: When optionValues change, we should clear selected values
    // setSelected([])
    return optionValues.map(value => {
      return { value, label: value }
    })
  }, [optionValues])

  const selectables = options.filter(option => !selected.includes(option))

  return (
    <Command
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "") {
              setSelected(prev => {
                const updated = [...prev]
                updated.pop()
                onChange(mapVals(updated))
                return updated
              })
            }
          }
          // This is not a default behaviour of the <input /> field
          if (e.key === "Escape") {
            input.blur()
          }
        }
      }}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map(option => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      setSelected(prev => {
                        const updated = prev.filter(s => s.value !== option.value)
                        onChange(mapVals(updated))
                        return updated
                      })
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => {
                    setSelected(prev => {
                      const updated = prev.filter(s => s.value !== option.value)
                      onChange(mapVals(updated))
                      return updated
                    })
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            disabled={options.length === 0}
            placeholder={options.length === 0 ? emptyText : "Select..."}
            className={`ml-2 h-[24px] bg-transparent outline-none placeholder:text-muted-foreground flex-1 ${options.length === 0 ? "cursor-not-allowed" : ""}`}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map(option => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue("")
                      setSelected(prev => {
                        const updated = [...prev, option]
                        onChange(mapVals(updated))
                        return updated
                      })
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
