import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "soft";
type Color = "primary" | "gray" | "red" | "green" | "blue";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  color?: Color;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, Record<Color, string>> = {
  solid: {
    primary: "text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/20" 
      + " " + "bg-[#003527]",
    gray: "text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/20"
      + " " + "bg-[#707974]",
    red: "text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-red-500/20"
      + " " + "bg-[#ba1a1a]",
    green: "text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-green-500/20"
      + " " + "bg-[#2c4d00]",
    blue: "text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20"
      + " " + "bg-blue-600",
  },
  outline: {
    primary: "border-2 border-[#003527] text-[#003527] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-primary/20",
    gray: "border-2 border-[#707974] text-[#707974] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/20",
    red: "border-2 border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] focus:ring-2 focus:ring-offset-2 focus:ring-red-500/20",
    green: "border-2 border-[#2c4d00] text-[#2c4d00] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-green-500/20",
    blue: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20",
  },
  ghost: {
    primary: "text-[#003527] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-primary/20",
    gray: "text-[#707974] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/20",
    red: "text-[#ba1a1a] hover:bg-[#ffdad6] focus:ring-2 focus:ring-offset-2 focus:ring-red-500/20",
    green: "text-[#2c4d00] hover:bg-[#f1f5f2] focus:ring-2 focus:ring-offset-2 focus:ring-green-500/20",
    blue: "text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20",
  },
  soft: {
    primary: "bg-[#b0f0d6] text-[#0b513d] hover:bg-[#95d3ba] focus:ring-2 focus:ring-offset-2 focus:ring-primary/20",
    gray: "bg-[#ebefec] text-[#404944] hover:bg-[#dfe3e1] focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/20",
    red: "bg-[#ffdad6] text-[#93000a] hover:bg-red-200 focus:ring-2 focus:ring-offset-2 focus:ring-red-500/20",
    green: "bg-[#bbf37c] text-[#1c3400] hover:bg-[#a0d663] focus:ring-2 focus:ring-offset-2 focus:ring-green-500/20",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", color = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant][color],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
