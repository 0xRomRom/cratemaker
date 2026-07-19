import React, { useEffect, useState } from "react";
import Landmine from "../assets/Landmine.webp";
const COLOR_OPTIONS = [
  { name: "Gray", value: "#7f7f7f" },
  { name: "Dark Gray", value: "#555555" },
  { name: "Light Gray", value: "#d2dae2" },
  { name: "White", value: "#dddddd" },
  { name: "Sky Blue", value: "#82ccdd" },
  { name: "Blue", value: "#35a3f1" },
  { name: "Green", value: "#7bed9f" },
  { name: "Lime Green", value: "#a7ec2e" },
  { name: "Purple", value: "#ae6eee" },
  { name: "Crimson", value: "#eb4d4b" },
  { name: "Bronze", value: "#c8a96e" },
  { name: "Gold", value: "#ffdd59" },
];

const emptyItem = {
  img: "",
  gradient: "",
  price: "",
  odds: "",
  color: COLOR_OPTIONS[0].value,
  name: "",
};

const ColorDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selected =
    COLOR_OPTIONS.find((c) => c.value === value) || COLOR_OPTIONS[0];

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#080a1f] p-2 rounded flex items-center gap-2 text-left"
      >
        <span
          className="w-5 h-5 rounded-full border border-white/20"
          style={{ backgroundColor: selected.value }}
        />
        <span>{selected.name}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#080a1f] rounded-lg border border-white/10 overflow-hidden shadow-xl max-h-60 overflow-y-auto">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                onChange(c.value);
                setOpen(false);
              }}
              className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/10 text-left"
            >
              <span
                className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: c.value }}
              />

              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ItemSelect = ({ addItem, updateItem, editingItem, onCancelEdit }) => {
  const [item, setItem] = useState(emptyItem);
  const [imgError, setImgError] = useState(false);
  // Holds an actual image asset (e.g. the bundled Landmine image) that should
  // be used as the preview/payload image WITHOUT being written into the
  // visible "Image URL" text input.
  const [presetImg, setPresetImg] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setItem({
        img: editingItem.img || "",
        gradient: editingItem.gradient || "",
        price: String(editingItem.price ?? ""),
        odds: String(editingItem.odds ?? ""),
        color: editingItem.color || COLOR_OPTIONS[0].value,
        name: editingItem.name || "",
      });

      setPresetImg(null);
      setImgError(false);
    }
  }, [editingItem]);

  const handleChange = (field) => (e) => {
    if (field === "img") {
      setImgError(false);
      // Manually editing the URL field overrides any preset image.
      setPresetImg(null);
    }

    setItem((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const resetForm = () => {
    setItem(emptyItem);
    setPresetImg(null);
    setImgError(false);
  };

  const handleSubmit = () => {
    if (!item.name) return;

    const payload = {
      ...item,
      img: presetImg || item.img,
      price: parseFloat(item.price) || 0,
      odds: parseFloat(item.odds) || 0,
    };

    if (editingItem) {
      updateItem(editingItem.id, payload);
    } else {
      addItem({
        ...payload,
        id: crypto.randomUUID(),
      });
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  const prefillLandmine = () => {
    setItem((prev) => ({
      ...prev,
      img: "",
      gradient: "",
      price: "0",
      color: "#555555",
      name: "Landmine",
    }));
    setPresetImg(Landmine);
    setImgError(false);
  };

  useEffect(() => {
    if (presetImg && item.name !== "Landmine") {
      setPresetImg(null);
    }
  }, [item.name, presetImg]);

  const previewPrice = parseFloat(item.price) || 0;
  const previewOdds = parseFloat(item.odds) || 0;
  const previewImgSrc = presetImg || item.img;
  const isEditing = Boolean(editingItem);

  return (
    <div className="bg-[#10132b] rounded-xl p-6 w-full text-white">
      <h2 className="text-xl mb-4">
        {isEditing ? "Edit Item" : "Create Item"}
      </h2>

      <button
        type="button"
        onClick={prefillLandmine}
        className="mb-4 px-4 py-2 rounded-lg border flex items-center gap-1 border-red-500/40 text-red-300 hover:bg-red-500/10"
      >
        <img src={Landmine} alt="Landmine" className="w-4 h-4" /> Landmine
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#363c49] whitespace-nowrap">
              Image URL
            </span>
            <input
              placeholder="Enter image URL"
              value={item.img}
              onChange={handleChange("img")}
              className="bg-[#080a1f] p-2 rounded placeholder:text-[12px] w-full "
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#363c49] whitespace-nowrap">
              Item Name
            </span>
            <input
              placeholder="Enter item name"
              value={item.name}
              onChange={handleChange("name")}
              className="bg-[#080a1f] p-2 rounded placeholder:text-[12px] w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#363c49]">Color</span>

            <ColorDropdown
              value={item.color}
              onChange={(color) =>
                setItem((prev) => ({
                  ...prev,
                  color,
                }))
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#363c49]">Price</span>
            <input
              type="number"
              placeholder="Enter price"
              value={item.price}
              onChange={handleChange("price")}
              className="bg-[#080a1f] p-2 rounded placeholder:text-[12px] w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#363c49] whitespace-nowrap">
              Odds %
            </span>
            <input
              type="number"
              placeholder="Enter odds"
              value={item.odds}
              onChange={handleChange("odds")}
              className="bg-[#080a1f] p-2 rounded placeholder:text-[12px] w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!item.name}
              className="flex-1 bg-indigo-600 rounded-lg py-2 cursor-pointer hover:bg-indigo-500 disabled:opacity-40"
            >
              {isEditing ? "Save Changes" : "Add Item"}
            </button>

            {isEditing && (
              <button
                onClick={handleCancel}
                className="px-4 rounded-lg border border-white/20 hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-sm text-gray-400 mb-2">Preview</p>

          <div className="bg-[#080a1f] rounded-lg p-4 flex flex-col items-center gap-3 flex-1 justify-center">
            <div
              className="w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden"
              style={{
                background: item.gradient || "#10132b",
              }}
            >
              {previewImgSrc && !imgError ? (
                <img
                  src={previewImgSrc}
                  onError={() => setImgError(true)}
                  className="w-20 h-20 object-contain"
                  alt="item preview"
                />
              ) : (
                <span className="text-xs text-gray-500">
                  {previewImgSrc ? "Failed to load" : "No image"}
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
              className="w-6 h-6 rounded-full border border-white/20"
              style={{
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSelect;
