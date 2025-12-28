import { useEffect, useRef } from "react";

type Props = {
  missingIds: string[];
};

export const NotFoundIds = ({ missingIds }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!missingIds || missingIds.length === 0) {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      return;
    }

    if (containerRef.current) {
      containerRef.current.style.display = "block";
    }

    // auto-hide after 5s
    timerRef.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [missingIds]);

  return (
    <div
      ref={containerRef}
      style={{ display: "none" }}
      className="shadow-2xl bg-accent border rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2xl flex flex-col gap-2">
      <h1>Missing IDs</h1>
      <ul className="list-disc ml-4">
        {missingIds.map((id) => (
          <li key={id} className="ps-4">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
};
