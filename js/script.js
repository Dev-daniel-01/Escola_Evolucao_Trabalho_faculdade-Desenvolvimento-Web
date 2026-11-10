/*
    Projeto: Site institucional - Escola Evolução (São José dos Pinhais - PR)
    Disciplina: Desenvolvimento Front-End para Web - Universidade Positivo
    Arquivo: script.js
    Descrição: funcionalidades em JavaScript puro usadas nas páginas do site.
    - Menu hambúrguer das páginas feitas com CSS puro (sobre.html e estrutura.html).
    - Formulário de contato que cadastra, edita e exclui mensagens salvas no localStorage (contato.html).
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
const botaoEnviar = document.getElementById("botao-enviar");

let mensagens = [];
let indiceEdicao = -1;


function formatarTelefone(valor) {
    let numeros = valor.replace(/\D/g, "");

    // Depois do DDD, o número precisa começar com 9
    if (numeros.length > 2 && numeros[2] !== "9") {
        numeros = numeros.slice(0, 2) + numeros.slice(3);
    }

    numeros = numeros.slice(0, 11);

    if (numeros.length === 0) {
        return "";
    }
    if (numeros.length <= 2) {
        return "(" + numeros;
    }
    if (numeros.length <= 7) {
        return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
    }
    return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
}

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
                    <button type="button" class="btn btn-outline-secondary btn-sm me-2" onclick="editarMensagem(${i})">Editar</button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="excluirMensagem(${i})">Excluir</button>
                </div>
            </article>
        `;
    }
}

function editarMensagem(indice) {
    const mensagem = mensagens[indice];

    document.getElementById("nome").value = mensagem.nome;
    document.getElementById("email").value = mensagem.email;
    document.getElementById("telefone").value = mensagem.telefone;
    document.getElementById("assunto").value = mensagem.assunto;
    document.getElementById("mensagem").value = mensagem.texto;

    indiceEdicao = indice;
    botaoEnviar.value = "Salvar alteração";
    alertaSucesso.classList.add("d-none");
    formContato.scrollIntoView();
}

function cancelarEdicao() {
    indiceEdicao = -1;
    botaoEnviar.value = "Enviar mensagem";
    formContato.reset();
}

function excluirMensagem(indice) {
    mensagens.splice(indice, 1);
    salvarMensagens();
    mostrarMensagens();
    cancelarEdicao();
}

function enviarMensagem(evento) {
    evento.preventDefault();

    const novaMensagem = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: formatarTelefone(document.getElementById("telefone").value),
        assunto: document.getElementById("assunto").value,
        texto: document.getElementById("mensagem").value,
        data: new Date().toLocaleDateString("pt-BR")
    };

    if (indiceEdicao === -1) {
        mensagens.push(novaMensagem);
        alertaSucesso.textContent = "Mensagem enviada com sucesso! Ela foi salva na lista abaixo.";
    } else {
        mensagens[indiceEdicao] = novaMensagem;
        alertaSucesso.textContent = "Mensagem alterada com sucesso!";
    }

    salvarMensagens();
    mostrarMensagens();
    cancelarEdicao();
    alertaSucesso.classList.remove("d-none");
}

if (formContato) {
    carregarMensagens();
    mostrarMensagens();
    formContato.addEventListener("submit", enviarMensagem);

    const campoTelefone = document.getElementById("telefone");
    campoTelefone.addEventListener("input", function () {
        campoTelefone.value = formatarTelefone(campoTelefone.value);
    });
}
