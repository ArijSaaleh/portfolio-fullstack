import { Button } from "./ui/button"

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  options: FilterOption[]
  selected: string
  onChange: (value: string) => void
  label?: string
}

export default function FilterBar({ options, selected, onChange, label }: FilterBarProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selected === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('all')}
        >
          All
        </Button>
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
