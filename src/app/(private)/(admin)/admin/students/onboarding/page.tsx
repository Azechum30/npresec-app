import type { Metadata } from "next";
import { StudentOnboarding } from "./_components/render-onboarding";

export const metadata: Metadata = {
  title: "Student Onboarding",
  description:
    "Complete a student profile registration and onboarding seamlessly",
  keywords: [
    "Students",
    "Onboarding",
    "Registration",
    "Presby SHTS Nakpanduri",
  ],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate", url: "https://nakpanduripresec.org" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function StudentOnboardingPage() {
  return <StudentOnboarding />;
}
