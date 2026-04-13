"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "group/input-group flex h-9 w-full min-w-0 items-stretch rounded-lg border border-input bg-background text-[12px] shadow-sm transition-[color,box-shadow] outline-none has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex shrink-0 cursor-text select-none items-center justify-center gap-1.5 text-muted-foreground [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-1 pl-2.5",
        "inline-end": "order-3 pr-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="presentation"
      data-slot="input-group-addon"
      className={cn(inputGroupAddonVariants({ align }), className)}
      onMouseDown={(e) => {
        const t = e.target as HTMLElement
        if (t.closest("button,a,[role='button']")) return
        e.preventDefault()
        e.currentTarget
          .closest("[data-slot=input-group]")
          ?.querySelector<HTMLInputElement>("input")
          ?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        "order-2 h-full min-w-0 flex-1 border-0 bg-transparent px-1 py-1 text-[12px] outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput }
