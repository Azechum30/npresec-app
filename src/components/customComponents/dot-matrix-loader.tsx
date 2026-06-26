import { DotmSquare3 } from "@/components/ui/dotm-square-3";

export function DotMatrixLoader() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <DotmSquare3 size={32} dotSize={4} speed={1.2} bloom />
    </div>
  );
}
