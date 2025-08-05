export function salvarLook(base64Image) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("LookDB", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("looks", { keyPath: "id", autoIncrement: true });
    };

    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("looks", "readwrite");
      const store = tx.objectStore("looks");

      const look = {
        name: "Image.jpg",
        imagem: base64Image,
        data: new Date().toISOString(),
        folder: ""
      };

      store.add(look);
      tx.oncomplete = () => resolve();
    };

    req.onerror = (e) => reject(e.target.error);
  });
}

export function novaPasta() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("FolderDB", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("folders", { keyPath: "id", autoIncrement: true });
    };

    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("folders", "readwrite");
      const store = tx.objectStore("folders");

      const folder = {
        name: "Nova Pasta",
      };

      store.add(folder);
      tx.oncomplete = () => resolve();
    };

    req.onerror = (e) => reject(e.target.error);
  });
}
