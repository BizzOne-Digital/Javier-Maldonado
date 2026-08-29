import { cn } from "@/lib/utils";

type BadgeVariant =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment_scheduled"
  | "closed"
  | "archived"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "for_sale"
  | "for_lease"
  | "sold"
  | "leased"
  | "published"
  | "draft"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-lake/15 text-lake border-lake/30",
  contacted: "bg-copper/15 text-copper border-copper/30",
  qualified: "bg-champagne/30 text-midnight border-champagne/50",
  appointment_scheduled: "bg-lake/20 text-lake border-lake/40",
  closed: "bg-midnight/10 text-midnight border-midnight/20",
  archived: "bg-charcoal/10 text-charcoal/70 border-charcoal/20",
  pending: "bg-copper/15 text-copper border-copper/30",
  confirmed: "bg-lake/15 text-lake border-lake/30",
  completed: "bg-midnight/10 text-midnight border-midnight/20",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  for_sale: "bg-lake/15 text-lake border-lake/30",
  for_lease: "bg-copper/15 text-copper border-copper/30",
  sold: "bg-midnight/10 text-midnight border-midnight/20",
  leased: "bg-champagne/30 text-midnight border-champagne/50",
  published: "bg-lake/15 text-lake border-lake/30",
  draft: "bg-charcoal/10 text-charcoal/60 border-charcoal/20",
  default: "bg-slate/10 text-slate border-slate/20",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = (status in variantStyles ? status : "default") as BadgeVariant;
  const display = label ?? status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        variantStyles[variant],
        className
      )}
    >
      {display}
    </span>
  );
}
