import { useEffect, useState } from "react";

type Props = {
  missingIds: string[];
};

export const NotFoundIds = ({ missingIds }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!missingIds || missingIds.length === 0) return;

    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 5000);

    return () => clearTimeout(timer);
  }, [missingIds]);

  if (!visible) return null;

  return (
    <div className="shadow-2xl bg-accent border rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2xl flex flex-col gap-2">
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
