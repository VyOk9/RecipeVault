"use client"

import { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TagInputProps {
  label: string
  placeholder: string
  value: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
}

export function TagInput({ label, placeholder, value, onChange, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !value.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
        onChange([...value, newTag])
        setInputValue("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[40px] items-center">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <Input
          id={label}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[100px] border-none focus-visible:ring-0 shadow-none"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
