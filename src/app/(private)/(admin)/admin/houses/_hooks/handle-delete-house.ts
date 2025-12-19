import { client } from "@/lib/orpc";
import { safe, isDefinedError } from "@orpc/client";
import { useState, useTransition } from "react";

export const useHandleHouseDelete = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHouseDelete = async (houseId: string) => {
    startTransition(async () => {
      setError(null);
      setSuccess(false);

      const { error } = await safe(client.house.deleteHouse({ id: houseId }));

      if (isDefinedError(error)) {
        setError("Failed to delete house. Please try again.");
        setSuccess(false);
        return;
      } else if (error) {
        console.log(error);
        setError(
          error.message || "An unexpected error occurred. Please try again."
        );
        setSuccess(false);
        return;
      } else {
        setSuccess(true);
        setError(null);
      }
    });
  };

  return {
    handleHouseDelete,
    isPending,
    success,
    error,
  };
};
