function carregarLooks() {
  const galeria = document.getElementById("galeria");

  const req = indexedDB.open("LookDB", 1);

  req.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("looks", "readonly");
    const store = tx.objectStore("looks");

    const cursor = store.openCursor();
    galeria.innerHTML = "";

    cursor.onsuccess = (e) => {
      const result = e.target.result;
      if (result) {
        const look = result.value;
        
        const card = `
          <div class="card bg-base-100 shadow-sm look-card">
            <figure>
              <img
                src=${look.imagem}
                alt="Shoes" />
            </figure>
            <span class="card-title p-2">Image.jpg</span>
            <div class="p-2 pb-6 flex gap-1 w-48">
              <button class="btn btn-xs btn-soft btn-info p-4 w-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b85fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button class="btn btn-xs btn-soft btn-warning p-4 w-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fec158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-plus-icon lucide-folder-plus"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>              </button>
              <button class="btn btn-xs btn-soft btn-error p-4 w-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fc3b3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `
        galeria.innerHTML += card;
        
        // const btn = document.createElement("button");
        // btn.className = "remover";
        // btn.textContent = "Remover";
        // btn.addEventListener("click", () => removerLook(result.key));


        // card.appendChild(img);
        // card.appendChild(data);
        // card.appendChild(btn);
        // galeria.appendChild(card);

        result.continue();
      } else if (!galeria.children.length) {
        galeria.innerHTML = "<p>Nenhum look salvo ainda 😢</p>";
      }
    };
  };
}

function removerLook(id) {
  const req = indexedDB.open("LookDB", 1);

  req.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("looks", "readwrite");
    const store = tx.objectStore("looks");

    const deleteRequest = store.delete(id);
    deleteRequest.onsuccess = () => {
      alert("Look removido com sucesso!");
      carregarLooks();
    };
  };
}

carregarLooks();
