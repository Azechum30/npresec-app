import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students",
};

export const dynamic = "force-dynamic";

export default function StudentsPage() {
  return <div>Students view their reports here!</div>;
}
