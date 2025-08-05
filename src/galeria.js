import { novaPasta } from './db.js';

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
            <span class="card-title p-2">${look.name}</span>
            ${
              look.folder != "" ? `<div class="badge badge-soft badge-warning m-2">${look.folder}</div>` : ``
            }
            <div class="p-2 pb-6 flex gap-1 w-48">
              <button class="btn btn-xs btn-soft btn-info p-4 w-12" title="Editar" onClick="renameLook(${look.id}, '${look.name}')">
                <!-- SVG do lápis -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#3b85fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button class="btn btn-xs btn-soft btn-warning p-4 w-12" title="Adicionar" onClick="folderLook(${look.id}, '${look.name}', '${look.folder}')">
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

window.folderLook = async function(id, oldName, folderName) {
  let modal = document.getElementById("folderModal");
  let btnSalvarFolderLook = document.getElementById("btnSalvarFolderLook");
  let btnAddFolderLook = document.getElementById("btnAddFolderLook");
  let containerFolder = document.getElementById("container-folder");

  let folder = `<div class="folder">
            <input type="radio" name="radio-8" class="radio radio-warning" checked="${folderName == "" ? `false` : `true`}" />
            <span class="nameFolder" contenteditable="true">${folderName == "" ? `` : folderName}</span>
        </div>`

  modal.showModal();

  let el = null;

  btnAddFolderLook.onclick = async () => {
    containerFolder.innerHTML += folder;
    let els = document.querySelectorAll(".nameFolder");
    el = els[els.length - 1];
    el.focus();
    document.getSelection().collapse(el, 1);
    await novaPasta()
  };

  btnSalvarFolderLook.onclick = () => {
    const selectedRadio = document.querySelector('.folder input[type="radio"]:checked');

    if (selectedRadio) {
      const folderDiv = selectedRadio.closest('.folder');
      const folderName = folderDiv.querySelector('.nameFolder').textContent.trim();

      atualizarLook(id, oldName, folderName);
    } else {
      console.warn('Nenhuma pasta selecionada.');
    }
  };

}

window.renameLook = function(id, oldName) {
  let modal = document.getElementById("renameModal");
  let inputName = document.getElementById("txtRenameImage");
  let btnSalvarRenameLook = document.getElementById("btnSalvarRenameLook");

  modal.showModal();
  inputName.value = oldName;

  btnSalvarRenameLook.onclick = () =>  atualizarLook(id, inputName.value);
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

window.atualizarLook = function(id, newName = "", folder = "") {
  const req = indexedDB.open("LookDB", 1);

  req.onerror = (event) => {
    console.error("Erro ao abrir IndexedDB para editar:", event);
  }

  req.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("looks", "readwrite");
    const store = tx.objectStore("looks");

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const data = getRequest.result;

      if (!data){
        console.warn(`Look com ID ${id} não foi encontrado.`);
        return;
      }

      data.name = newName;
      data.folder = folder;

      const updateRequest = store.put(data);

      updateRequest.onsuccess = () => {
        carregarLooks();
      }

      updateRequest.onerror = (event) => {
        console.error(`Problemas ao tentar atualizar o look. ${event}`);
      }

    }

    getRequest.onerror = (event) => {
      console.error(`Problemas ao tentar fazer requisição de buscar o look. ${event}`)
    }
  }
}

carregarLooks();
