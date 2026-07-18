import React from "react";

const SelectedItems = ({ items = [], removeItem }) => {
  if (!items.length) {
    return (
      <div className="bg-[#10132b] rounded-xl p-6 w-full max-w-4xl text-white">
        <h2 className="text-xl mb-2">Selected Items</h2>
        <p className="text-sm text-gray-400">
          No items yet — add one below to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#10132b] rounded-xl p-6 w-full max-w-4xl text-white">
      <h2 className="text-xl mb-4">Selected Items</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="relative flex flex-col items-center gap-2 bg-[#080a1f] p-3 rounded-lg w-28"
          >
            {removeItem && (
              <button
                onClick={() => removeItem(i.id)}
                className="absolute top-1 right-1 text-red-400 text-xs leading-none"
              >
                X
              </button>
            )}
            <div
              className="w-16 h-16 rounded flex items-center justify-center overflow-hidden shrink-0"
              style={{
                background: i.gradient || "#10132b",
              }}
            >
              {i.img && (
                <img
                  src={i.img}
                  className="w-14 h-14 object-contain"
                  alt={i.name}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
            <p className="text-sm text-center truncate w-full">{i.name}</p>
            <p className="text-xs text-gray-400">
              ${i.price} • {i.odds}%
            </p>
            <div
              className="w-5 h-5 rounded-full shrink-0"
              style={{
                backgroundColor: i.color,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedItems;
