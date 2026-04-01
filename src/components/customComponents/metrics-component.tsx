import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CountUpComponent } from "./CountUpComponent";

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "stable";
};

export function MetricCard({
  title,
  value,
  description,
  icon,
  className,
  trend = "stable",
}: MetricCardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-blue-500",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow dark:bg-accent ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <CountUpComponent countTo={value} />
          {trend && (
            <span
              className={`text-sm font-medium ${trendColors[trend]} flex items-center`}>
              {trendIcons[trend]}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
