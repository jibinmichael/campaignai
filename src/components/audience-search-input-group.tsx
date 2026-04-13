import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function AudienceSearchInputGroup({
  id,
  value,
  onChange,
  onBuildAudience,
  className,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  onBuildAudience?: () => void
  className?: string
}) {
  return (
    <InputGroup className={className}>
      <InputGroupInput
        id={id}
        placeholder="Search or describe who you're messaging"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-3"
      />
      <InputGroupAddon align="inline-end">
        <button
          type="button"
          onClick={onBuildAudience}
          className="rounded-md px-1 py-0.5 text-left text-[12px] font-medium transition-opacity hover:opacity-80"
        >
          <span className="bg-linear-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-violet-400 dark:to-fuchsia-400">
            Build audience
          </span>
        </button>
      </InputGroupAddon>
    </InputGroup>
  )
}
