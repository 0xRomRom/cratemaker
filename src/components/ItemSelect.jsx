import React, { useState } from "react";
// All unique colors pulled from the crate data, labeled by rarity/name
const COLOR_OPTIONS = [
  { name: "Gray (Trash)", value: "#7f7f7f" },
  { name: "Dark Gray (Trash)", value: "#555555" },
  { name: "White (Common)", value: "#dddddd" },
  { name: "Silver (Common)", value: "#d2dae2" },
  { name: "Pale Blue (Consumer)", value: "#b0c3d9" },
  { name: "Sky Blue (Uncommon)", value: "#82ccdd" },
  { name: "Blue (Uncommon)", value: "#35a3f1" },
  { name: "Steel Blue (Restricted)", value: "#5e98d9" },
  { name: "Royal Blue (Mil-Spec)", value: "#4b69ff" },
  { name: "Mint Green (Rare)", value: "#7bed9f" },
  { name: "Lime Green (Rare)", value: "#a7ec2e" },
  { name: "Tan (Rare)", value: "#c8a96e" },
  { name: "Purple (Epic)", value: "#ae6eee" },
  { name: "Violet (Classified)", value: "#8847ff" },
  { name: "Pink (Covert)", value: "#d32ce6" },
  { name: "Orange (Epic)", value: "#e08b2c" },
  { name: "Orange Red (Epic)", value: "#f15840" },
  { name: "Red (Epic)", value: "#eb4d4b" },
  { name: "Gold (Legendary)", value: "#ffdd59" },
];
const emptyItem = {
  img: "",
  gradient: "",
  price: "",
  odds: "",
  color: COLOR_OPTIONS[0].value,
  name: "",
};

const ItemSelect = ({ addItem }) => {
  const [item, setItem] = useState(emptyItem);
  const [imgError, setImgError] = useState(false);

  const handleChange = (field) => (e) => {
    if (field === "img") {
      setImgError(false);
    }
    setItem((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!item.name) return;
    addItem({
      ...item,
      price: parseFloat(item.price) || 0,
      odds: parseFloat(item.odds) || 0,
      id: crypto.randomUUID(),
    });
    setItem(emptyItem);
    setImgError(false);
  };

  const previewPrice = parseFloat(item.price) || 0;
  const previewOdds = parseFloat(item.odds) || 0;

  return (
    <div className="bg-[#10132b] rounded-xl p-6 w-full max-w-4xl text-white">
      <h2 className="text-xl mb-4">Create Items</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Form */}
        <div className="flex flex-col gap-3 flex-1">
          <input
            placeholder="Image URL"
            value={item.img}
            onChange={handleChange("img")}
            className="bg-[#080a1f] p-2 rounded"
          />
          <input
            placeholder="Gradient (e.g. radial-gradient(circle at top,#7bed9f 25%,transparent 80%))"
            value={item.gradient}
            onChange={handleChange("gradient")}
            className="bg-[#080a1f] p-2 rounded"
          />
          <input
            placeholder="Item name"
            value={item.name}
            onChange={handleChange("name")}
            className="bg-[#080a1f] p-2 rounded"
          />
          <div className="flex gap-3 items-center">
            <label className="shrink-0">Color</label>
            <select
              value={item.color}
              onChange={handleChange("color")}
              className="bg-[#080a1f] p-2 rounded flex-1"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name}
                </option>
              ))}
            </select>
            <div
              className="w-6 h-6 rounded-full shrink-0 border border-white/20"
              style={{ backgroundColor: item.color }}
            />
          </div>
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={handleChange("price")}
            className="bg-[#080a1f] p-2 rounded"
          />
          <input
            type="number"
            placeholder="Odds %"
            value={item.odds}
            onChange={handleChange("odds")}
            className="bg-[#080a1f] p-2 rounded"
          />
          <button
            onClick={handleAdd}
            disabled={!item.name}
            className="bg-indigo-600 rounded-lg py-2 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>

        {/* Live preview, next to the form */}
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-gray-400 mb-2">Preview</p>
          <div className="bg-[#080a1f] rounded-lg p-4 flex flex-col items-center gap-3 flex-1 justify-center">
            <div
              className="w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden"
              style={{
                background: item.gradient || "#10132b",
              }}
            >
              {item.img && !imgError ? (
                <img
                  src={item.img}
                  onError={() => setImgError(true)}
                  className="w-20 h-20 object-contain"
                  alt="item preview"
                />
              ) : (
                <span className="text-xs text-gray-500 px-2 text-center">
                  {item.img ? "Failed to load" : "No image"}
                </span>
              )}
            </div>
            <div className="text-center">
              <p>{item.name || "Unnamed item"}</p>
              <p className="text-sm text-gray-400">
                ${previewPrice} • {previewOdds}%
              </p>
            </div>
            <div
              className="w-6 h-6 rounded-full shrink-0 border border-white/20"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSelect;
