import { cn } from "@/lib/utils";

interface StatusBarProps {
  value: number;
  colorVariant?: "good" | "warning" | "critical";
  color?: "primary" | "secondary" | "accent";
}

export const StatusBar = ({ value, colorVariant, color }: StatusBarProps) => {
  // Ensure value is between 0 and 100
  const safeValue = Math.max(0, Math.min(100, value));
  
  const getStatusColor = () => {
    if (color) {
      switch (color) {
        case "primary":
          return "bg-primary";
        case "secondary":
          return "bg-secondary";
        case "accent":
          return "bg-accent";
        default:
          return "bg-primary";
      }
    }
    
    if (colorVariant) {
      switch (colorVariant) {
        case "good":
          return "bg-status-good";
        case "warning":
          return "bg-status-warning";
        case "critical":
          return "bg-status-critical";
        default:
          return "bg-status-good";
      }
    }

    if (safeValue > 80) {
      return "bg-status-critical";
    } else if (safeValue > 60) {
      return "bg-status-warning";
    } else {
      return "bg-status-good";
    }
  };

  return (
    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full", getStatusColor())}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export default StatusBar;
