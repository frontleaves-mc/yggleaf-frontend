import { HexColorPicker } from 'react-colorful'

import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-all duration-200 outline-none hover:border-ring hover:bg-input/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        >
          <span
            className="size-4 shrink-0 rounded-sm border border-foreground/10"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-xs">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={value} onChange={onChange} />
        <div className="mt-2 flex items-center gap-2">
          <span
            className="size-5 shrink-0 rounded-sm border border-foreground/10"
            style={{ backgroundColor: value }}
          />
          <Input
            value={value}
            onChange={(e) => {
              const v = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                onChange(v)
              }
            }}
            className="h-7 flex-1 font-mono text-xs"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker, type ColorPickerProps }
