import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface EmptyStateProps {
  title?: string
  message?: string
}

export default function EmptyState({
  title = "No records found!",
  message = "There are no records to display." }: EmptyStateProps) {
  return (
    <div className="w-full h-[45vh] flex flex-col items-center justify-center text-center text-secondary-foreground">
      <ExclamationTriangleIcon className="size-16" />
      <h1 className="font-semibold text-xl">
        {title}
      </h1>
      <h1 className="font-medium text-base">
        {message}
      </h1>
    </div>
  )
}