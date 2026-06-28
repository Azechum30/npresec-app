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
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentOnboardingPage() {
  return <StudentOnboarding />;
}
