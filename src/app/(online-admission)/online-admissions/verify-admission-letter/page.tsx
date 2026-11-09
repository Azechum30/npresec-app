/**biome-ignore-all assist/source/organizeImports:reason */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyAdmissionLetterHash } from "@/lib/hash-utils";
import { getStudentAdmissionData } from "@/utils/get-student-admission-data";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Verify Admission Letter",
  description:
    "A secure, cryptographic way to verify the authenticity of an admission letter",
  applicationName: "NPRESEC MIS",
  authors: [{ name: "NPRESEC MIS" }],
  robots: {
    follow: false,
    googleBot: {
      index: false,
      noarchive: true,
      follow: false,
      nosnippet: true,
    },
    index: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default async function VerifyAdmissionLetterPage({
  searchParams,
}: Props) {
  const queryParams = await searchParams;
  const admissionId = queryParams.admissionId ?? "";
  const token = queryParams.token ?? "";

  // 1. INVALID REQUEST STATE (Missing URL params)
  if (!admissionId && !token) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-accent bg-accent/10 shadow-lg rounded-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <AlertTriangle className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-xl font-bold font-serif text-foreground">
              Invalid Request
            </CardTitle>
            <CardDescription className="text-accent-foreground/80">
              The verification parameters are missing or corrupted.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground font-sans">
            Please re-scan the QR code printed on the official admission
            document or contact technical support.
          </CardContent>
          <CardFooter>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
              <ArrowLeft className="h-4 w-4" /> Back to Portal
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 2. INVALID TOKEN STATE (Tampered or unsigned payload)
  const isValidToken = verifyAdmissionLetterHash(admissionId, token);
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive bg-destructive/10 shadow-xl rounded-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold font-serif text-foreground">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-destructive font-semibold">
              Digital Signature Mismatch
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground space-y-4">
            <p>
              This code could not be verified by the school ledger
              infrastructure. The security tokens are unrecognized.
            </p>
          </CardContent>
          {/* <CardFooter>
            <Link
              href={`/report-discrepancy?admissionId=${admissionId}&type=failed_hash`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground shadow-md hover:opacity-95 transition-all">
              <AlertOctagon className="h-4 w-4" /> Report Forgery
            </Link>
          </CardFooter> */}
        </Card>
      </div>
    );
  }

  // 3. SUCCESS / VERIFIED STATE (Token verified successfully)
  const verifiedLetter = await getStudentAdmissionData(admissionId);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4 antialiased">
      <Card className="w-full max-w-lg border-border bg-card shadow-2xl rounded-xl overflow-hidden">
        {/* Dynamic Header Box via Primary Theme Tokens */}
        <div className="bg-primary text-primary-foreground px-6 py-8 text-center relative border-b border-border">
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-0.5 text-xs font-semibold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED RECORD
          </div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10 shadow-xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold font-serif tracking-tight">
            Admission Letter Validated
          </h1>
          <p className="mt-0.5 opacity-80 text-sm">
            Official Institutional Verification Successful
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Information Grid Container */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Student Name:
                </p>
                <p className="text-base font-bold truncate">
                  {verifiedLetter.lastName} {verifiedLetter.firstName}{" "}
                  {verifiedLetter.middleName ?? ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Student ID:
                  </p>
                  <p className="text-sm font-mono font-bold text-foreground">
                    {verifiedLetter.studentNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Enrollment
                  </p>
                  <span className="inline-flex items-center rounded-sm bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent-foreground ring-1 ring-accent/30">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Verification Timestamp
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {new Date().toLocaleString("en-GH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Notice Box using Muted system classes */}
          <div className="rounded-md bg-muted border border-border p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">
              Notice for Security / Verifying Officer:
            </p>
            <p className="leading-relaxed">
              Verify that the name and ID on this screen correspond exactly with
              the physical paper credentials presented by the candidate.
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          {/* Main Download Route */}
          <Link
            href={`/api/online-admissions/downloads/admission-letter?admissionId=${admissionId}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
            <FileText className="h-4 w-4" /> Download PDF Letter
          </Link>

          {/* Discrepancy Reporting Hook */}
          {/* <Link
            href={`/report-discrepancy?admissionId=${admissionId}&name=${encodeURIComponent(`${verifiedLetter.firstName} ${verifiedLetter.lastName}`)}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground shadow-xs hover:bg-muted/80 transition-colors">
            <AlertTriangle className="h-4 w-4" /> Flag Discrepancy
          </Link> */}
        </CardFooter>
      </Card>
    </div>
  );
}
