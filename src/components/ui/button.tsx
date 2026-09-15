import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg hover:bg-[#e7decc] active:scale-[0.98]",
        secondary:
          "border border-border-strong bg-surface text-fg hover:bg-surface-2 active:scale-[0.98]",
        ghost: "text-muted hover:text-fg hover:bg-surface",
        danger: "bg-crimson text-fg hover:bg-[#9c1d2b] active:scale-[0.98]",
      },
      size: {
        sm: "h-10 px-3 text-sm rounded-[var(--radius-sm)]",
        md: "h-12 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-14 px-5 text-base rounded-[var(--radius-lg)]",
        xl: "h-16 px-6 text-lg rounded-[var(--radius-lg)]",
        icon: "size-12 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";
