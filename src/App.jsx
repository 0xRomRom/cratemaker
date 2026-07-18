import { useEffect, useState } from "react";
import CrateHeader from "./components/CrateHeader";
import ItemSelect from "./components/ItemSelect";
import SelectedItems from "./components/SelectedItems";

const STORAGE_KEY = "crateItems";

function App() {
  const [crateDetails, setCrateDetails] = useState({
    name: "",
    price: "",
    risk: "",
  });
  const [items, setItems] = useState([]);

  // Load saved items
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save items
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-screen p-10 flex-col gap-4 min-h-screen overflow-x-hidden bg-[#080a1f] text-white flex justify-center items-center font-bold">
      <div className="max-w-[1000px] flex flex-col gap-4 w-full items-center justify-center">
        <CrateHeader
          crateDetails={crateDetails}
          setCrateDetails={setCrateDetails}
        />
        <SelectedItems items={items} removeItem={removeItem} />
        <ItemSelect addItem={addItem} />
      </div>
    </div>
  );
}

export default App;
