import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  status?: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  subtitle?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  unit, 
  icon, 
  status = "normal", 
  trend,
  subtitle,
  className 
}: StatCardProps) {
  const statusStyles = {
    normal: "bg-white border-border",
    warning: "bg-amber-50 border-amber-200 shadow-amber-100",
    critical: "bg-red-50 border-red-200 shadow-red-100 animate-pulse",
  };

  const textStyles = {
    normal: "text-foreground",
    warning: "text-amber-700",
    critical: "text-red-700",
  };

  const iconStyles = {
    normal: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-600",
    critical: "bg-red-100 text-red-600",
  };

  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md",
      statusStyles[status],
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl", iconStyles[status])}>
          {icon}
        </div>
        {status !== "normal" && (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            status === "warning" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          )}>
            {status}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-3xl font-bold tracking-tight", textStyles[status])}>
            {value}
          </span>
          {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
