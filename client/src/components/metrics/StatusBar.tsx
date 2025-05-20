import { cn } from "@/lib/utils";

interface StatusBarProps {
  value: number;
  colorVariant?: "good" | "warning" | "critical";
  color?: "primary" | "secondary" | "accent";
}

export const StatusBar = ({ value, colorVariant, color }: StatusBarProps) => {
  const getStatusColor = () => {
    if (color) {
      return `bg-${color}`;
    }
    
    if (colorVariant) {
      return `bg-status-${colorVariant}`;
    }

    if (value > 80) {
      return "bg-status-critical";
    } else if (value > 60) {
      return "bg-status-warning";
    } else {
      return "bg-status-good";
    }
  };

  return (
    <div className="status-bar">
      <div
        className={cn("status-bar-fill", getStatusColor())}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default StatusBar;
