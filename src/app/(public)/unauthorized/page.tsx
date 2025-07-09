export const metadata = {
  title: "Unauthorized",
  description: "You are not authorized to view this page",
  keywords: "unauthorized, access denied, 403",
};

export default function UnauthorizedPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <h1 className="text-red-500 font-semibold text-2xl">403: Forbidden</h1>
    </div>
  );
}
