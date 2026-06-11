"use client";

import { Button } from "@/components/ui/button";
import { PrinterCheck } from "lucide-react";

export const PrintReceiptButton = () => {
  return (
    <Button
      className="print:hidden"
      onClick={() => window.print()}
      variant="outline"
      size="lg">
      <PrinterCheck className="size-4" />
      Print Payment Receipt
    </Button>
  );
};
