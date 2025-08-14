// Importa Firebase (usando ES Modules no navegador)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração Firebase (use a sua)
const firebaseConfig = {
    apiKey: "AZaSyB6X2y9gtMIiUHK0_vmBYp_WdGv-x8HXnc",
    authDomain: "tasksmachinepay.firebaseapp.com",
    databaseURL: "https://tasksmachinepay-default-rtdb.firebaseio.com",
    projectId: "tasksmachinepay",
    storageBucket: "tasksmachinepay.appspot.com",
    messagingSenderId: "198790348949",
    appId: "1:198790348949:web:292cb1292c39ceb86c9b9c",
    measurementId: "G-MGG7VCPXDH"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.onload = function () {
    mostrarPosts();
    document.querySelector("#postForm").addEventListener('submit', addPost);
};

function addPost(event) {
    event.preventDefault();

    const textPost = document.querySelector("#postText").value;
    const categoriaPost = document.querySelector("#postCategory").value;
    const imagePost = document.querySelector("#postImage").value;
    const statusPost = document.querySelector("#statusPost").value;

    const novoPost = {
        text: textPost,
        category: categoriaPost,
        image: imagePost,
        date: new Date().toLocaleString(),
        status: statusPost
    };

    // Salva no Firebase
    push(ref(db, "tasks"), novoPost);

    document.querySelector("#postForm").reset();
}

function mostrarPosts() {
    const listaPosts = document.querySelector("#postList");
    listaPosts.innerHTML = "";

    // Escuta mudanças no Firebase em tempo real
    onValue(ref(db, "tasks"), (snapshot) => {
        listaPosts.innerHTML = ""; // limpa antes de renderizar
        snapshot.forEach((childSnapshot) => {
            const pegaItem = childSnapshot.val();
            const id = childSnapshot.key;

            const cardPost = document.createElement("div");
            cardPost.innerHTML = `
                <h2>${pegaItem.text}</h2>
                ${pegaItem.image ? `<img src="${pegaItem.image}" style="max-width:200px;">` : ""}
                <p>Categoria: ${pegaItem.category}</p>
                <p>Data e Hora: ${pegaItem.date}</p>
                <p>Status: ${pegaItem.status}</p>
                <button onclick="editarPost('${id}', '${pegaItem.status}')">Editar</button>
                <button onclick="apagarPost('${id}')">Apagar</button>
            `;
            listaPosts.append(cardPost);
        });
    });
}

window.apagarPost = function (id) {
    remove(ref(db, "tasks/" + id));
};

window.editarPost = function (id, statusAtual) {
    const select = document.createElement("select");

    const opcaoPendente = document.createElement("option");
    opcaoPendente.value = "⏳ Pendente";
    opcaoPendente.textContent = "⏳ Pendente";

    const opcaoConcluida = document.createElement("option");
    opcaoConcluida.value = "✅ Concluída";
    opcaoConcluida.textContent = "✅ Concluída";

    select.appendChild(opcaoPendente);
    select.appendChild(opcaoConcluida);

    select.value = statusAtual;

    const confirmacao = confirm("Quer mudar o status? Se sim, escolha na lista que aparecer.");
    if (confirmacao) {
        document.body.appendChild(select);
        select.focus();

        select.addEventListener("change", function () {
            update(ref(db, "tasks/" + id), { status: select.value });
            document.body.removeChild(select);
        });
    }
};
