import { Download } from "lucide-react";
import { Button } from "../ui/button";

type ExportToCSVButtonProps = {
  exportFunc: () => void;
};

export default function ExportToCSVButton({
  exportFunc,
}: ExportToCSVButtonProps) {
  return (
    <Button variant="outline" onClick={exportFunc}>
      <Download className="size-5" />
      Export to XLSX
    </Button>
  );
}
