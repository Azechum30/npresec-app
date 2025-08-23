"use client";

export default function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md text-center">
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
          Permission Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You do not have the necessary permissions to access this page.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
