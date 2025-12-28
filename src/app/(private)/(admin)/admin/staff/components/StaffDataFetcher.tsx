"use client";

import { useEffect, useState } from "react";
import { fetchStaffData } from "@/app/actions/staff-actions";
import RenderStaffData from "./Render-staff-data";

export default function StaffDataFetcher() {
  const [staffData, setStaffData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const result = await fetchStaffData();

        if (result.error) {
          setError(result.error);
        } else {
          setStaffData(result);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return <RenderStaffData initialData={staffData} />;
}
