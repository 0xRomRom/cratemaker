import React from "react";
import GoldImg from "../assets/Gold.webp";

const SelectedItems = ({
  items = [],
  removeItem,
  onEdit,
  duplicateItem,
  editingId,
}) => {
  console.log(items);

  const totalOdds = items.reduce((a, v) => a + v.odds, 0).toFixed(2);

  return (
    <div className="mb-2 w-full">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-white select-none text-[14px]">Selected Items</h3>
        <h3 className="text-white select-none text-[14px]">
          Total Odds: {totalOdds}% /<span className="text-[#323763]">100%</span>
        </h3>
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items
          .sort((a, b) => b.price - a.price)
          .map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-lg border border-white/8 bg-[#0d1027] px-2 py-4 flex flex-col items-center gap-1.5 transition-colors ${
                editingId === item.id ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b"
                style={{ background: item.color }}
              />

              {/* Dot grid background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-18"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "9px 9px",
                  maskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                }}
              />

              {/* Radial glow */}
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 w-full h-35 rounded-full opacity-18 blur-2xl pointer-events-none"
                style={{ background: item.price === 0 ? "#555" : item.color }}
              />

              {/* Odds badge */}
              <span className="absolute top-1.5 right-1.5 text-[10px] text-white/45 bg-black/30 rounded px-1.5 py-0.5 z-10">
                {item.odds}%
              </span>

              {/* Controls */}
              <div className="absolute top-2 left-1.5 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item.id)}
                    className="text-[10px] leading-none text-indigo-300 bg-blue-500/30 cursor-pointer rounded p-1.5 hover:text-indigo-200"
                  >
                    Edit
                  </button>
                )}

                {duplicateItem && (
                  <button
                    onClick={() => duplicateItem(item)}
                    className="text-[10px] leading-none text-green-300 bg-green-500/30 cursor-pointer rounded p-1.5 hover:text-green-200"
                  >
                    Duplicate
                  </button>
                )}

                {removeItem && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] leading-none text-red-400 bg-red-500/30 cursor-pointer rounded p-1.5 px-2 hover:text-red-300"
                  >
                    X
                  </button>
                )}
              </div>

              {/* Image */}
              <div className="relative z-10 w-[80px] h-[80px] flex items-center justify-center mt-4">
                {item.img ? (
                  <img
                    draggable="false"
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>

              <div className="flex flex-col mt-0 gap-1 items-center w-full">
                <span
                  className="relative z-10 text-[12px] max-w-[95%] font-medium text-center w-full px-1 truncate"
                  style={{ color: item.color }}
                >
                  {item.name}
                </span>

                {item.price > 0 ? (
                  <div className="relative z-10 flex items-center justify-center text-[12px] text-white">
                    <img src={GoldImg} alt="Token" className="w-5 h-5" />
                    <span>{item.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="relative z-10 text-[11px] text-gray-600">
                    Ouch...
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectedItems;
