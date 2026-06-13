import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ size: inputSize = "md", className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "block w-full rounded-lg border-0 bg-white text-gray-900 ring-1 ring-inset ring-gray-300",
        "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-75 transition-colors",
        sizeClasses[inputSize],
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
