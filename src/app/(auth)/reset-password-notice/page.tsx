import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordNoticePage() {
  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Password Reset Notice</CardTitle>
        <CardDescription>
          A Link has been sent to your email. Kindly visit your email and use
          that link to reset your password to continue.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
