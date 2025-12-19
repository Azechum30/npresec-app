import { buttonVariants } from "@/components/ui/button";
import { getAuthUser } from "@/lib/getAuthUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ForbiddenPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const url =
    user.role?.name === "admin"
      ? "/admin/dashboard"
      : user.role?.name === "staff"
        ? "/teachers"
        : user.role?.name === "student"
          ? "/students"
          : "/";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="bg-accent shadow-md rounded-lg p-8 max-w-lg text-center">
        <div className="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 12a9 9 0 110-18 9 9 0 010 18zm0 0v2m0-2h.01"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          403 - Forbidden
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You do not have the necessary permissions to access this page.
        </p>
        <Link
          href={url}
          className={buttonVariants({
            variant: "destructive",
            className: "w-full mt-3",
          })}>
          Continue to Dashboard
        </Link>
      </div>
    </div>
  );
}
