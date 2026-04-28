import { cn } from "#/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-muted bg-[length:200%_100%] bg-gradient-[90deg,transparent_25%,oklch(0.963_0.002_197.1_/_0.5)_50%,transparent_75%] dark:bg-gradient-[90deg,transparent_25%,oklch(0.275_0.011_216.9_/_0.5)_50%,transparent_75%]",
        "[animation:shimmer_1.8s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
