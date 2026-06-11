"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toProperCase } from "@/utils/string-transformer";
import { HeartHandshake } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

export const PrintComponent = ({
  payment,
  qrCodeUrl,
  url,
}: {
  payment: any;
  qrCodeUrl: string;
  url: string;
}) => {
  if (!payment) return null;

  const studentDetails =
    payment.metadata === null
      ? null
      : typeof payment.metadata === "string"
        ? JSON.parse(payment.metadata)
        : payment.metadata;

  const formattedAmount = `${String(payment.amount)}.00`;
  const paymentMethod = toProperCase(
    (payment.channel as string).split("_").join(" "),
  );
  const paidAt = new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(payment.paidAt as Date);
  return (
    <Card className="relative w-full max-w-3xl mx-auto print:shadow-none print:rounded-none shadow-xl border print:bg-transparent print:border-black">
      <style jsx>{`
        /* Print friendly rules */
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
        /* Paper texture and subtle drop */
        .receipt-paper {
          background: linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%);
          box-shadow: 0 6px 18px rgba(20, 24, 40, 0.08);
        }
        /* Logo placeholder */
        .logo-box {
          width: 72px;
          height: 72px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.08),
            rgba(16, 185, 129, 0.04)
          );
        }
        /* Thin separators for print */
        .sep {
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.06),
            rgba(0, 0, 0, 0.02)
          );
        }
        /* Receipt details table */
        .details-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.5rem 1rem;
          align-items: center;
        }
      `}</style>

      <CardHeader className=" z-50 receipt-paper p-6 print:p-6 rounded-t-lg border-b print:border-b-black">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="logo-box border print:border-black">
              <Image
                src={"/logo.png"}
                width={100}
                height={100}
                alt="School Logo"
              />
            </div>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">
                {/* Placeholder for school name */}
                PRESBY SHTS, NAKPANDURI
              </h2>
              <p className="text-sm print:text-xs text-muted-foreground mt-0.5">
                P.O Box 22 • Napanduri, North East
              </p>
              <p className="text-sm print:text-xs text-muted-foreground">
                Phone: +223540649355 • Email: admin@nakpanduripresec.org
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
              <HeartHandshake className="mr-2" />
              Receipt
            </div>
            <div className="mt-3 print:mt-1 text-xs text-muted-foreground">
              Receipt No.
              <div className="font-mono text-sm text-muted-foreground">
                {payment.transactionId}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="z-50 px-6 print:px-6">
        <div className="mt-4 text-sm text-muted-foreground text-center mb-4 pb-4 print:pb-4 border-b print:border-b-black">
          <em>Receipt as proof of payment. Keep this for your records.</em>
        </div>
        <section className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-muted-foreground">Student</div>
              <div className="text-lg font-semibold">
                {studentDetails?.name ?? "Student Name"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ID:{" "}
                <span className="font-medium">
                  {studentDetails?.studentId ?? "—"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted">Date</div>
              <div className="text-lg font-semibold">{paidAt}</div>
            </div>
          </div>
        </section>

        <section className="mb-6 border rounded-lg p-4 print:border-black">
          <div className="details-grid">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-sm text-muted-foreground text-right">
              Amount
            </div>

            <div className="font-medium text-muted-foreground">
              {studentDetails.serviceName}
            </div>
            <div className="font-semibold text-muted-foreground text-right">
              {formattedAmount}
            </div>

            <div className="text-sm text-muted-foreground">Payment Method</div>
            <div className="text-sm font-medium text-muted-foreground text-right">
              {paymentMethod}
            </div>

            <div className="text-sm text-muted-foreground">Bank</div>
            <div className="text-sm font-medium text-muted-foreground text-right">
              {payment.bank ?? "—"}
            </div>

            <div className="text-sm text-muted-foreground">Currency</div>
            <div className="text-sm font-medium text-muted-foreground text-right">
              {payment.currency}
            </div>
          </div>

          <Separator className="w-full mt-3 print:border-black print:hidden" />

          <div className="flex justify-between items-center mt-4 print:border-t print:border-t-black print:pt-2 print:mt-2">
            <div className="text-sm text-muted-foreground">
              Total Paid Amount
            </div>
            <div className="text-xl font-bold">{formattedAmount}</div>
          </div>
        </section>

        <section className="mb-6 print:hidden">
          <div className="text-sm font-bold">Note:</div>
          <div className="text-sm bg-primary/20 border border-primary rounded-md p-2 mt-1">
            To download the receipt without page headers or footers, you need to
            turn off <em className="font-bold">Print Headers and Footers</em> in
            your print dialog before going head to print or save the document.
          </div>
        </section>

        <div className="flex justify-between items-center space-x-4">
          <div className="text-xs text-muted-foreground">
            Issued by <strong>Presby SHTS</strong>
          </div>

          <div className=" hidden print:inline-flex flex-col">
            <span className="text-sm text-muted-foreground uppercase">
              Scan to Verify
            </span>
            <Link className="border-2 border-black p-1.5" href={url as Route}>
              <Image src={qrCodeUrl} alt="QR code" width={100} height={100} />
            </Link>
          </div>

          <Button
            onClick={() => window.print()}
            className="z-50 w-1/4 print:hidden">
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
