// Dados de exemplo dos posts
let posts = [
];

window.onload = function (){
    mostrarPosts();

    document.querySelector("#postForm").addEventListener('submit', addPost)
}
function addPost(infosDoEvento){
    infosDoEvento.preventDefault();

    const textPost = document.querySelector("#postText").value;
    const categoriaPost = document.querySelector("#postCategory").value;
    const imagePost = document.querySelector("#postImage").value;
    const statusPost = document.querySelector("#statusPost").value;

    const novoPost = {
        text: textPost,
        category: categoriaPost,
        image: imagePost,
        date: new Date().toLocaleDateString(),
        status: statusPost,
    }

    posts.push(novoPost);

    mostrarPosts();

    document.querySelector("#postForm").reset();
}
function mostrarPosts(){
    const listaPosts = document.querySelector("#postList");
    listaPosts.innerHTML = "";

    posts.forEach((pegaItem, index) => {

        const cardPost = document.createElement("div");

        cardPost.innerHTML = `
            <h2>${pegaItem.text}</h2>
            ${pegaItem.image? `<img src= ${pegaItem.image} />` : ""}
            <p>Categoria: ${pegaItem.category}</p>
            <p>Data e Hora: ${pegaItem.date}</p>
            <p>Status: ${pegaItem.status}</p>
            <button onclick="editarPost(${index})">Editar</button>
            <button onclick="apagarPost(${index})">Apagar</button>
            `;
        
    listaPosts.append(cardPost);
    });
}
function apagarPost(indice) {
    posts.splice(indice, 1); 
    mostrarPosts();
}

function editarPost(indice) {
    
    const select = document.createElement("select");

    const opcaoPendente = document.createElement("option");
    opcaoPendente.value = "⏳ Pendente";
    opcaoPendente.textContent = "⏳ Pendente";

    const opcaoConcluida = document.createElement("option");
    opcaoConcluida.value = "✅ Concluída";
    opcaoConcluida.textContent = "✅ Concluída";

    select.appendChild(opcaoPendente);
    select.appendChild(opcaoConcluida);

    
    select.value = posts[indice].status;

    
    const confirmacao = confirm("Quer mudar o status? Se sim, escolha na lista que aparecer.");
    if (confirmacao) {
        document.body.appendChild(select);
        select.focus();

        select.addEventListener("change", function () {
            posts[indice].status = select.value;
            mostrarPosts();
            document.body.removeChild(select); 
        });
    }
}