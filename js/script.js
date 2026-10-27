/*
    Projeto: Site institucional - Escola Evolução (São José dos Pinhais - PR)
    Disciplina: Desenvolvimento Front-End para Web - Universidade Positivo
    Arquivo: script.js
    Descrição: funcionalidades em JavaScript puro usadas nas páginas do site.
    - Menu hambúrguer das páginas feitas com CSS puro (sobre.html e estrutura.html).
    - Formulário de contato que salva as mensagens no localStorage (contato.html).
*/

const menuBotao = document.getElementById("menu-botao");
const menuLista = document.getElementById("menu-lista");

function alternarMenu() {
    menuLista.classList.toggle("aberto");
}

if (menuBotao) {
    menuBotao.addEventListener("click", alternarMenu);
}

const formContato = document.getElementById("form-contato");
const listaMensagens = document.getElementById("lista-mensagens");
const alertaSucesso = document.getElementById("alerta-sucesso");

let mensagens = [];

function carregarMensagens() {
    const mensagensSalvas = localStorage.getItem("mensagens");

    if (mensagensSalvas) {
        mensagens = JSON.parse(mensagensSalvas);
    }
}

function salvarMensagens() {
    localStorage.setItem("mensagens", JSON.stringify(mensagens));
}

function mostrarMensagens() {
    listaMensagens.innerHTML = "";

    if (mensagens.length === 0) {
        listaMensagens.innerHTML = "<p>Nenhuma mensagem enviada ainda.</p>";
        return;
    }

    for (let i = 0; i < mensagens.length; i++) {
        const mensagem = mensagens[i];

        listaMensagens.innerHTML += `
            <article class="card card-escola mb-3">
                <div class="card-body">
                    <h3 class="card-title fs-5">${mensagem.assunto}</h3>
                    <p class="card-text">${mensagem.texto}</p>
                    <p class="small text-muted">${mensagem.nome} - ${mensagem.email} - ${mensagem.telefone} - ${mensagem.data}</p>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="excluirMensagem(${i})">Excluir</button>
                </div>
            </article>
        `;
    }
}

function excluirMensagem(indice) {
    mensagens.splice(indice, 1);
    salvarMensagens();
    mostrarMensagens();
}

function enviarMensagem(evento) {
    evento.preventDefault();

    const novaMensagem = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        assunto: document.getElementById("assunto").value,
        texto: document.getElementById("mensagem").value,
        data: new Date().toLocaleDateString("pt-BR")
    };

    mensagens.push(novaMensagem);
    salvarMensagens();
    mostrarMensagens();

    formContato.reset();
    alertaSucesso.classList.remove("d-none");
}

if (formContato) {
    carregarMensagens();
    mostrarMensagens();
    formContato.addEventListener("submit", enviarMensagem);
}
