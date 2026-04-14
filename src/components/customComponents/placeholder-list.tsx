import { forwardRef, useImperativeHandle, useState } from "react";

export const PlaceholderList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item });
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length,
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-white border rounded-md shadow-lg overflow-hidden min-w-37.5 z-50">
      {props.items.length ? (
        props.items.map((item: string, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={`block w-full hover:cursor-pointer text-left px-3 py-2 text-sm ${
              index === selectedIndex
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}>
            {`{{${item}}}`}
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-500">No matches found</div>
      )}
    </div>
  );
});

PlaceholderList.displayName = "PlaceholderList";
