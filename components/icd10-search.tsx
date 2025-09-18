"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { searchICD10Codes, getCommonOrthopaedicCodes } from "@/lib/icd10-utils"

interface ICD10SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ICD10Search({ value, onChange, placeholder = "Search ICD-10 codes..." }: ICD10SearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ code: string; description: string; fullPath?: string }>>(
    [],
  )
  const [showCommon, setShowCommon] = useState(true)

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchICD10Codes(searchQuery, 50)
      setSearchResults(results)
      setShowCommon(false)
    } else {
      setSearchResults([])
      setShowCommon(true)
    }
  }, [searchQuery])

  const commonCodes = getCommonOrthopaedicCodes()
  const displayedCodes = showCommon ? commonCodes : searchResults

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal bg-transparent"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {value}
              </Badge>
              <span className="truncate">
                {searchResults.find((code) => code.code === value)?.description ||
                  commonCodes.find((code) => code.code === value)?.description ||
                  "Selected code"}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search ICD-10 codes..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            {displayedCodes.length === 0 ? (
              <CommandEmpty>{searchQuery ? "No codes found." : "Start typing to search..."}</CommandEmpty>
            ) : (
              <CommandGroup
                heading={showCommon ? "Common Orthopaedic Codes" : `Search Results (${displayedCodes.length})`}
              >
                {displayedCodes.map((code) => (
                  <CommandItem
                    key={code.code}
                    value={code.code}
                    onSelect={() => {
                      onChange(code.code)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {code.code}
                      </Badge>
                      <span className="font-medium">{code.description}</span>
                    </div>
                    {code.fullPath && <span className="text-xs text-muted-foreground ml-2">{code.fullPath}</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
