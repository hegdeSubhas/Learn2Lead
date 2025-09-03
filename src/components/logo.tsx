import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-8 text-accent", className)}
    >
      <path d="M7 15l-4-4 1.5-1.5L6 11l4-4 6 6" />
      <path d="M15 3h6v6" />
      <path d="M21 3l-9 9" />
    </svg>
  );
}
