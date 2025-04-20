import { StudentResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import {
  Mail,
  Phone,
  User,
  GraduationCap,
  School,
  BadgeCheck,
  Calendar,
  MapPin,
  UserCircle2,
  Landmark,
  BookOpen,
} from "lucide-react";

type StudentRowDetailProps = {
  row: Row<StudentResponseType>;
};

export default function StudentRowDetail({ row }: StudentRowDetailProps) {
  const { original } = row;

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-blue-950 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg border-4 border-white dark:border-neutral-900">
          {original.firstName[0]}
          {original.lastName[0]}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {original.lastName} {original.firstName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <User className="w-5 h-5 text-blue-500" />
            <span className="text-base text-gray-600 dark:text-gray-300 font-mono">
              {original.studentNumber}
            </span>
          </div>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold shadow ${
              original.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
            {original.status}
          </span>
          <span className="text-xs text-gray-400 mt-2">
            Enrolled:{" "}
            {original.dateEnrolled &&
              new Date(original.dateEnrolled).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Academic Info Card */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-blue-100 dark:border-neutral-800 p-6 mb-4 md:mb-0">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2 text-lg">
            <GraduationCap className="w-6 h-6 text-indigo-500" /> Academic Info
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <School className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Class:</span>
              <span>{original.currentClass?.name ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-green-400" />
              <span className="font-medium">Department:</span>
              <span>{original.department?.name ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Level:</span>
              <span>{original.currentLevel}</span>
            </li>
            <li className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Graduation:</span>
              <span>
                {original.graduationDate
                  ? new Date(original.graduationDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <BadgeCheck className="w-5 h-5 text-pink-400" />
              <span className="font-medium">Status:</span>
              <span>{original.status}</span>
            </li>
          </ul>
        </div>
        {/* Personal Info Card */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-blue-100 dark:border-neutral-800 p-6 mb-4 md:mb-0">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2 text-lg">
            <UserCircle2 className="w-6 h-6 text-blue-500" /> Personal Info
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-400" />
              <span className="font-medium">Email:</span>
              <span>{original.user?.email ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="font-medium">Phone:</span>
              <span>{original.phone ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Address:</span>
              <span>{original.address ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-medium">Nationality:</span>
              <span>{original.nationality ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-medium">Religion:</span>
              <span>{original.religion ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-medium">Gender:</span>
              <span>{original.gender ?? "N/A"}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-medium">Birth Date:</span>
              <span>
                {original.birthDate
                  ? new Date(original.birthDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </li>
          </ul>
        </div>
        {/* Guardian Info Card */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-blue-100 dark:border-neutral-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2 text-lg">
            <User className="w-6 h-6 text-indigo-500" /> Guardian Info
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <span className="font-medium">Name:</span>{" "}
              <span>{original.guardianName ?? "N/A"}</span>
            </li>
            <li>
              <span className="font-medium">Relation:</span>{" "}
              <span>{original.guardianRelation ?? "N/A"}</span>
            </li>
            <li>
              <span className="font-medium">Phone:</span>{" "}
              <span>{original.guardianPhone ?? "N/A"}</span>
            </li>
            <li>
              <span className="font-medium">Email:</span>{" "}
              <span>{original.guardianEmail ?? "N/A"}</span>
            </li>
            <li>
              <span className="font-medium">Address:</span>{" "}
              <span>{original.guardianAddress ?? "N/A"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
