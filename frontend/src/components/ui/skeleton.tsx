import { cn } from "@/lib/utils"
import { MotionDiv } from "@/components/common/motion"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Enhanced skeleton with shimmer effect
function SkeletonShimmer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:animate-[shimmer_1.5s_ease-in-out_infinite]",
        className
      )}
      {...props}
    >
      <div className="invisible">{props.children}</div>
    </div>
  )
}

// Crypto card skeleton
function CryptoCardSkeleton() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="crypto-card-glass p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-5 w-8" />
        </div>
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-4 w-12 mb-3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </MotionDiv>
  )
}

// Loading spinner component
function LoadingSpinner({ size = "md", className, ...props }: {
  size?: "sm" | "md" | "lg"
  className?: string
} & React.ComponentProps<"div">) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Crypto-themed loading spinner
function CryptoSpinner({ size = "md", className, ...props }: {
  size?: "sm" | "md" | "lg"
  className?: string
} & React.ComponentProps<"div">) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn(
        "relative inline-block rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full border-2 border-crypto-cyan/30 animate-spin" />
      <div className="absolute inset-1 rounded-full border-2 border-crypto-purple/30 animate-spin animation-delay-150" />
      <div className="absolute inset-2 rounded-full bg-crypto-blue animate-pulse" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Skeleton, SkeletonShimmer, CryptoCardSkeleton, LoadingSpinner, CryptoSpinner }
