"use client";

export default function ErrorPage(error: any) {
  return (
    <div className="flex justify-center items-center w-full full">
      <h1 className="text-2xl text-red-500 font-bold">{error.error.message}</h1>
    </div>
  );
}
