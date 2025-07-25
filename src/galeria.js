function carregarLooks() {
  const galeria = document.getElementById("galeria");

  const req = indexedDB.open("LookDB", 1);

  req.onerror = (event) => {
    console.error("Erro ao abrir IndexedDB:", event);
    galeria.innerHTML = "<p>Erro ao acessar banco de dados.</p>";
  };

  req.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("looks")) {
      db.createObjectStore("looks", { keyPath: "id", autoIncrement: true });
      console.log("ObjectStore 'looks' criada");
    }
  };

  req.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("looks", "readonly");
    const store = tx.objectStore("looks");
    const cursorRequest = store.openCursor();

    cursorRequest.onerror = (event) => {
      console.error("Erro ao abrir cursor:", event);
      galeria.innerHTML = "<p>Erro ao ler dados do banco.</p>";
    };

    galeria.innerHTML = "";

    let temLooks = false;

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        temLooks = true;
        const look = cursor.value;

        const card = `
          <div class="card bg-base-100 shadow-sm look-card">
            <figure>
              <img src="${look.imagem}" alt="Look Image" />
            </figure>
            <span class="card-title p-2">Image.jpg</span>
            <div class="p-2 pb-6 flex gap-1 w-48">
              <button class="btn btn-xs btn-soft btn-info p-4 w-12" title="Editar">
                <!-- SVG do lápis -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#3b85fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button class="btn btn-xs btn-soft btn-warning p-4 w-12" title="Adicionar">
                <!-- SVG da pasta com + -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fec158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
              </button>
              <button class="btn btn-xs btn-soft btn-error p-4 w-12" title="Remover" onClick="removerLook(${look.id})">
                <!-- SVG da lixeira -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fc3b3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;

        galeria.insertAdjacentHTML("beforeend", card);

        cursor.continue();
      } else {
        if (!temLooks) {
          galeria.innerHTML = `
            <div role="alert" class="alert alert-vertical sm:alert-horizontal">
              <span class="text-lg">⚠️</span>
              <span>Nenhum look foi salvo ainda.</span>
            </div>
          `;
        }
      }
    };
  };
}

window.removerLook = function(id) {
  const req = indexedDB.open("LookDB", 1);

  req.onerror = (event) => {
    console.error("Erro ao abrir IndexedDB para remover:", event);
  };

  req.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("looks", "readwrite");
    const store = tx.objectStore("looks");
    let alertSuccess = document.getElementById("alertSuccess");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      alertSuccess.style.display = 'flex';
      setTimeout(() => alertSuccess.style.display = 'none', 3000);
      carregarLooks();
    };

    deleteRequest.onerror = (event) => {
      console.error("Erro ao remover look:", event);
      alert("Erro ao remover look.");
    };
  };
}

carregarLooks();
