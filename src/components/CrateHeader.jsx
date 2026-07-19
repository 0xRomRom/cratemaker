import React, { useEffect, useState } from "react";
import { IoTrashBin } from "react-icons/io5";

const STORAGE_KEY = "crateDetails";

const getRiskColor = (risk) => {
  const value = Number(risk) || 0;

  if (value < 25) return "#0cf";
  if (value < 50) return "#0aff7c";
  if (value < 75) return "#f5a623";
  return "#eb4043";
};

const CrateHeader = ({
  crateDetails,
  setCrateDetails,
  imagePreview,
  setImagePreview,
}) => {
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      setCrateDetails((prev) => ({
        ...prev,
        ...parsed,
      }));

      if (parsed.image) {
        setImagePreview(parsed.image);
      }
    }
  }, [setCrateDetails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crateDetails));

    if (crateDetails.image) {
      setImagePreview(crateDetails.image);
    }
  }, [crateDetails]);

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "risk") {
      value = Math.min(Math.max(Number(value), 0), 100);
    }

    setCrateDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const isWebp =
      file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");

    if (!isWebp) {
      setImageError("Only .webp images are allowed");
      setImagePreview(null);
      e.target.value = "";
      return;
    }

    setImageError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      setImagePreview(base64);

      setCrateDetails((prev) => ({
        ...prev,
        image: base64,
      }));
    };

    reader.readAsDataURL(file);
  };

  // DELETE IMAGE
  const handleDeleteImage = () => {
    setImagePreview(null);

    setCrateDetails((prev) => {
      const updated = { ...prev };
      delete updated.image;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });

    setImageError("");
  };

  const risk = Number(crateDetails.risk) || 0;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[#10132b] rounded-xl w-full">
      <div className="flex gap-6">
        {/* IMAGE */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="min-w-48 border rounded-md border-[#201b4b] min-h-48">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Crate preview"
                  className="w-48 h-48 object-cover rounded-lg border border-white/10"
                />
              )}
            </div>
            {/* DELETE BUTTON */}
            {imagePreview && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 cursor-pointer flex items-center justify-center 
            w-9 h-9 rounded-full bg-red-600/50 hover:bg-red-500 
            text-white transition"
                title="Delete image"
              >
                <IoTrashBin size={20} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              id="crate-image"
              type="file"
              accept=".webp,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="relative mt-4 px-1">
              <div className="relative flex h-2 gap-1">
                {[
                  { min: 0, max: 25, color: "#0cf" },
                  { min: 25, max: 50, color: "#0aff7c" },
                  { min: 50, max: 75, color: "#f5a623" },
                  { min: 75, max: 101, color: "#eb4043" },
                ].map((seg) => {
                  const active = risk >= seg.min && risk < seg.max;

                  return (
                    <div
                      key={seg.min}
                      className="flex-1 rounded-full transition-all"
                      style={{
                        backgroundColor: active ? seg.color : "#1e2a3a",
                      }}
                    />
                  );
                })}

                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{
                    left: `${risk}%`,
                  }}
                >
                  <div
                    className="h-5 w-1 rounded-full shadow-lg"
                    style={{
                      backgroundColor: getRiskColor(risk),
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 bg-[#191641] p-2 rounded-md">
              <span
                onClick={() => window.open("https://remove.bg", "_blank")}
                className="cursor-pointer text-yellow-500 text-[12px] border rounded-md p-1 hover:bg-yellow-500/20"
              >
                1. Remove Background
              </span>
              <span
                onClick={() => windo9w.open("https://towebp.io/", "_blank")}
                className="cursor-pointer text-yellow-500 text-[12px] border rounded-md p-1 hover:bg-yellow-500/20"
              >
                2. Convert To Webp
              </span>
              <label
                htmlFor="crate-image"
                className="cursor-pointer flex items-center justify-center mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                3. Choose Image
              </label>
            </div>

            {imageError && (
              <span className="text-xs text-red-400">{imageError}</span>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-4 flex-1 max-w-50">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Name</label>

            <input
              type="text"
              value={crateDetails.name || ""}
              onChange={handleChange("name")}
              placeholder="Crate name"
              className="bg-[#080a1f] rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Price</label>

            <input
              type="number"
              value={crateDetails.price || ""}
              onChange={handleChange("price")}
              placeholder="0.00"
              className="bg-[#080a1f] rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Risk</label>

            <input
              type="number"
              min="0"
              max="100"
              value={crateDetails.risk ?? ""}
              onChange={handleChange("risk")}
              placeholder="1-100"
              className="bg-[#080a1f] rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrateHeader;
