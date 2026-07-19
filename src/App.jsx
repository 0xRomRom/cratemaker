import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import CrateHeader from "./components/CrateHeader";
import ItemSelect from "./components/ItemSelect";
import SelectedItems from "./components/SelectedItems";
import FinalizeBar from "./components/FinalizeBar";

const STORAGE_KEY = "crateItems";

function App() {
  const [imagePreview, setImagePreview] = useState(null);

  const [crateDetails, setCrateDetails] = useState({
    name: "",
    price: "",
    risk: "",
  });

  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    setEditingId(null);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const duplicateItem = (item) => {
    const copy = {
      ...item,
      id: Date.now(),
      price: Math.max(0, item.price - 0.01),
    };

    setItems((prev) => [...prev, copy]);
  };

  const resetCrate = () => {
    setCrateDetails({
      name: "",
      price: "",
      risk: "",
    });

    setItems([]);
    setEditingId(null);
    setImagePreview(null);

    localStorage.removeItem(STORAGE_KEY);
  };

  async function downloadImage(url) {
    try {
      const response = await fetch(url);

      const blob = await response.blob();

      return blob;
    } catch (err) {
      console.log("Image failed:", url);
      return null;
    }
  }

  const saveCrate = async () => {
    const totalOdds = items.reduce((a, v) => a + Number(v.odds), 0).toFixed(2);

    if (+totalOdds !== 100) {
      return alert("Total odds isn't 100");
    }

    if (!crateDetails.name) {
      return alert("Add crate name");
    }
    if (!crateDetails.price) {
      return alert("Add crate price");
    }
    if (!crateDetails.risk) {
      return alert("Add crate risk");
    }

    const zip = new JSZip();

    const folderName = crateDetails.name || "Unnamed Crate";

    const crateFolder = zip.folder(folderName);

    // remove spaces for image filename
    const imageName = crateDetails.name.replace(" ", "");
    const imageFileName = `${imageName}.webp`;

    /*
    SAVE CRATE IMAGE
  */

    if (imagePreview) {
      try {
        const response = await fetch(imagePreview);

        const imageBlob = await response.blob();

        crateFolder.file(imageFileName, imageBlob);
      } catch (err) {
        console.log("Failed saving crate image", err);
      }
    }

    /*
    FORMAT 1
    crate.json
  */

    const crateJSON = {
      name: crateDetails.name,
      img: imageName,
      price: Number(crateDetails.price),

      gradient:
        "conic-gradient(from 180deg, rgb(35 33 119), rgb(31 44 143), rgb(91 56 159), rgb(31 45 143), rgb(96 75 177))",

      risk: Number(crateDetails.risk),

      slug: crateDetails.name.toLowerCase().replace(/\s+/g, "-"),
    };

    crateFolder.file("crate.json", JSON.stringify(crateJSON, null, 2));

    /*
    FORMAT 2
    items.json
  */

    const itemsJSON = {
      [crateDetails.name]: items.map(({ id, ...item }) => item),
    };

    crateFolder.file("crateContent.json", JSON.stringify(itemsJSON, null, 2));

    /*
    CREATE ZIP
  */

    const content = await zip.generateAsync({
      type: "blob",
    });

    saveAs(content, `${folderName}.zip`);
  };

  const editingItem = items.find((i) => i.id === editingId) || null;

  return (
    <div className="max-w-screen flex-col gap-4 min-h-screen overflow-x-hidden bg-[#080a1f] text-white flex justify-center items-center font-bold">
      <div className="max-w-[1000px] py-5 flex flex-col gap-4 w-full">
        <CrateHeader
          crateDetails={crateDetails}
          setCrateDetails={setCrateDetails}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        <SelectedItems
          items={items}
          removeItem={removeItem}
          onEdit={(id) => setEditingId(id)}
          duplicateItem={duplicateItem}
        />

        <ItemSelect
          addItem={addItem}
          updateItem={updateItem}
          editingItem={editingItem}
          onCancelEdit={() => setEditingId(null)}
        />

        <FinalizeBar onRestart={resetCrate} onSaveCrate={saveCrate} />
      </div>
    </div>
  );
}

export default App;
