import { TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ErrorComponent } from "./ErrorComponent";

export const CardLikeErrorComponent = ({ error }: { error: string }) => {
  return (
    <Card className="w-full md:max-w-lg border-t-primary border-t-4 shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="flex space-x-2 items-center">
          <span className="flex justify-center items-center size-12 rounded-full bg-destructive/15 p-3">
            <TriangleAlert className="size-6 text-destructive" />
          </span>
          <h1 className="text-xl font-bold bg-linear-120 from-destructive to-primary text-transparent bg-clip-text">
            An Error Ocurred!
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorComponent error={error} />
      </CardContent>
    </Card>
  );
};
