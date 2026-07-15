import { Progress } from "@/components/ui/progress";

type ProgressBarProps = {
  value: number;
};
export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="shadow-sm border border-primary h-3" />
      <span>{value}%</span>
    </div>
  );
};
