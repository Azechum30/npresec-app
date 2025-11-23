"use client";

export default function AdminBoardOfGovernorsError(error: Error) {
  return (
    <div className="flex justify-center items-center w-full full">
      {error.message}
    </div>
  );
}
