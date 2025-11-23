import { Quote, TextQuote } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-primary font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:justify-center after:items-center">
          Our Vision
        </h2>
        <p className="max-w-prose md:text-justify">
          To be a center of academic excellence and discipline, committed to
          nurturing holistically developed students who are well-prepared for
          the job market, adult life, and higher education.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-primary font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:justify-center after:items-center">
          Our Mission
        </h2>
        <p className="max-w-prose md:text-justify">
          To deliver quality instruction, effective guidance and counselling,
          and a conducive learning environment rooted in Christian
          values—holistically preparing learners for the world of work, adult
          life, and further education.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-primary font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:justify-center after:items-center">
          Core Values
        </h2>
        <ul className="list-disc ml-5">
          <li>Discipline</li>
          <li>Honesty</li>
          <li>Integrity</li>
          <li>Hardwork</li>
          <li>Compassion</li>
          <li>Fear of God</li>
          <li>And Love for God and Country</li>
        </ul>
      </div>
    </div>
  );
}
