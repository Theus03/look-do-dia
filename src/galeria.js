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

        const card = document.createElement("div");
        card.className = "look-card";

        const img = document.createElement("img");
        img.src = look.imagem;

        const data = document.createElement("div");
        data.className = "data";
        data.textContent = new Date(look.data).toLocaleString("pt-BR");

        const btn = document.createElement("button");
        btn.className = "remover";
        btn.textContent = "Remover";
        btn.addEventListener("click", () => removerLook(result.key));


        card.appendChild(img);
        card.appendChild(data);
        card.appendChild(btn);
        galeria.appendChild(card);

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
