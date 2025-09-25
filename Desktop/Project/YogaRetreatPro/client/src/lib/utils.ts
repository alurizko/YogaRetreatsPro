import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility to merge Tailwind classes safely across component props
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
