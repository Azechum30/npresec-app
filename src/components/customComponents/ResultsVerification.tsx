"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function ResultsVerification({
  isValid,
  grades,
  studentId,
  verificationDate,
}: {
  isValid: boolean;
  grades: any;
  studentId: string;
  verificationDate: Date;
}) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname().split("/")[1];

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state
      gsap.set(".verify-card", { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(".header-icon", { scale: 0, rotation: -180 });
      gsap.set(".info-row", { opacity: 0, x: -20 });
      gsap.set(".status-badge", { opacity: 0, y: 10 });
      gsap.set(".scan-line", { y: -10, opacity: 0 });

      tl.to(".verify-card", { opacity: 1, y: 0, scale: 1, duration: 0.8 })
        .to(
          ".header-icon",
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4",
        )
        // "Scanning" effect
        .fromTo(
          ".scan-line",
          { y: 0, opacity: 1 },
          { y: 250, opacity: 0, duration: 1.5, ease: "none" },
        )
        .to(".status-badge", { opacity: 1, y: 0, duration: 0.4 })
        .to(
          ".info-row",
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 },
          "-=0.2",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-background bg-gradient-to-tl from-primary/20 via-accent/15 to-accent/20 flex items-center justify-center p-4 overflow-hidden relative">
      <Card className="verify-card bg-gradient-to-br from-accent/10 via-primary/5 to-primary/10 max-w-md w-full shadow-4xl relative overflow-hidden">
        {/* Animated Scan Line */}
        <div className="scan-line absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20" />

        <CardHeader className="text-center pb-2">
          <div className="header-icon flex justify-center mb-4">
            {isValid ? (
              <div className="p-3 bg-gradient-to-r from-primary/15 to-secondary/20 rounded-full">
                <ShieldCheck className="size-12 text-primary" />
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="size-12 text-red-600" />
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className="status-badge mb-2 w-fit mx-auto border-primary text-accent-foreground bg-accent/50">
            Official Verification System
          </Badge>
          <CardTitle className="text-2xl font-bold text-primary">
            Result Authenticity
          </CardTitle>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Presbyterian SHTS, Nakpanduri
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {isValid ? (
            <>
              <div className="info-row bg-gradient-to-br from-primary/15 via-primary/20 to-secondary/15 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="text-primary size-6 shrink-0" />
                <div>
                  <p className="text-primary font-bold text-sm">
                    Document Verified
                  </p>
                  <p className="text-primary text-[10px]">
                    Digital record matches physical statement.
                  </p>
                </div>
              </div>

              <div className="space-y-3 px-1">
                {[
                  {
                    label: "Student",
                    value: `${grades.student.firstName} ${grades.student.lastName}`,
                  },
                  pathname === "verify-student-transcript"
                    ? {
                        label: "Academic Period",
                        value: `${new Intl.DateTimeFormat("en-GH", {
                          month: "short",
                          year: "numeric",
                        }).format(
                          grades.student.dateEnrolled,
                        )} - ${new Intl.DateTimeFormat("en-GH", {
                          month: "short",
                          year: "numeric",
                        }).format(grades.student.graduationDate)}`,
                      }
                    : {
                        label: "Academic Period",
                        value: `${grades.academicYear}, ${grades.semester} Semester`,
                      },
                  {
                    label:
                      pathname === "verify-student-transcript"
                        ? "CGPA"
                        : "SGPA",
                    value:
                      pathname === "verify-student-transcript"
                        ? grades.cgpa.toFixed(2)
                        : grades.gpa.toFixed(2),
                    highlight: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="info-row flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-tighter">
                      {item.label}
                    </span>
                    <span
                      className={`text-sm font-bold ${item.highlight ? "text-primary text-lg" : "text-accent-foreground"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="info-row bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <XCircle className="text-red-600 size-10 mx-auto mb-3" />
              <p className="text-red-900 font-bold">Verification Failed</p>
              <p className="text-red-700 text-xs mt-1">
                This record could not be found or is not yet published.
              </p>
            </div>
          )}

          <div className="info-row pt-4 flex flex-col items-center gap-2">
            <p className="text-[10px] text-center text-muted-foreground max-w-[200px]">
              Secure digital verification timestamp:
              <span className="block font-mono text-muted-foreground">
                {verificationDate?.toLocaleString()}
              </span>
            </p>
            <a
              href={`mailto:registrar@nakpanduripresec.org?subject=Discrepancy:${studentId}`}
              className="text-[10px] font-bold text-primary/80 hover:text-primary transition-colors uppercase tracking-tighter">
              Report Discrepancy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
