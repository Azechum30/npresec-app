import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>401 - Unauthorized</CardTitle>
        <CardDescription>Kindly login to access this page</CardDescription>
      </CardHeader>
      <Link href="/sign-in">
        <Button asChild>Click to Login</Button>
      </Link>
    </Card>
  );
}
