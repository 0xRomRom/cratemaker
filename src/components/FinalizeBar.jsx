import React from "react";

const FinalizeBar = ({ onRestart, onSaveCrate }) => {
  return (
    <div className="flex gap-10 items-center bg-[#150f2b] p-2 rounded-xl mt-8 justify-center">
      <button
        onClick={onRestart}
        className="px-6 py-2 rounded-lg border-gray-300 bg-[#333] text-white font-medium cursor-pointer transition"
      >
        Restart
      </button>

      <button
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm cursor-pointer"
        onClick={onSaveCrate}
      >
        Save Crate
      </button>
    </div>
  );
};

export default FinalizeBar;
