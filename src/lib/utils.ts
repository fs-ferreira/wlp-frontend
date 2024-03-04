import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const messages = {
  required: "Field is required.",
  numberOnly: "Only positive numbers are accepted.",
  imageMaxsize: 'Max image size is 5MB.',
  imageFileType: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
}
