
const API_URL = "https://sua-api.onrender.com";

const lista = document.getElementById("lista-alunos");
const total = document.getElementById("total-alunos");
const pesquisa = document.getElementById("pesquisa");
const mensagem = document.getElementById("mensagem-lista");
const btnAtualizar = document.getElementById("btn-atualizar");

let alunos = [];

async function buscarAlunos() {
  const resposta = await fetch(`${API_URL}/alunos`);

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();
  const registros = Array.isArray(dados) ? dados : dados.alunos;

  if (!Array.isArray(registros)) {
    throw new Error("A API não retornou uma lista válida.");
  }

  return registros;
}

function formatarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não lançada";
  }

  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      })
    : "Não lançada";
}

function obterNota(aluno, campo) {
  return aluno[campo] ?? aluno.notas?.[campo] ?? null;
}

function renderizarAlunos() {
  lista.replaceChildren();

  const termo = pesquisa.value.trim().toLocaleLowerCase("pt-BR");

  const filtrados = alunos.filter(aluno =>
    String(aluno.nome || "")
      .toLocaleLowerCase("pt-BR")
      .includes(termo)
  );

  if (filtrados.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = 4;
    celula.className = "vazio";
    celula.textContent = alunos.length
      ? "Nenhum aluno encontrado."
      : "Nenhum aluno cadastrado.";

    linha.appendChild(celula);
    lista.appendChild(linha);
    return;
  }

  filtrados.forEach(aluno => {
    const linha = document.createElement("tr");

    const nome = document.createElement("td");
    nome.className = "nome-aluno";
    nome.textContent = aluno.nome;

    const nota1 = document.createElement("td");
    nota1.textContent = formatarNota(
      obterNota(aluno, "primeiroBimestre")
    );

    const nota2 = document.createElement("td");
    nota2.textContent = formatarNota(
      obterNota(aluno, "segundoBimestre")
    );

    const acao = document.createElement("td");
    const link = document.createElement("a");

    link.className = "botao-editar";
    link.textContent = "Consultar / editar";
    link.href = `notas.html?id=${encodeURIComponent(aluno.id)}`;

    acao.appendChild(link);
    linha.append(nome, nota1, nota2, acao);
    lista.appendChild(linha);
  });
}

async function carregarAlunos() {
  btnAtualizar.disabled = true;
  mensagem.className = "mensagem";
  mensagem.textContent = "Carregando alunos...";

  try {
    alunos = await buscarAlunos();
    total.textContent = alunos.length;
    renderizarAlunos();
    mensagem.textContent = "";
  } catch (erro) {
    alunos = [];
    total.textContent = "—";
    renderizarAlunos();
    mensagem.className = "mensagem erro";
    mensagem.textContent =
      `Não foi possível carregar os alunos. ${erro.message}`;
  } finally {
    btnAtualizar.disabled = false;
  }
}

pesquisa.addEventListener("input", renderizarAlunos);
btnAtualizar.addEventListener("click", carregarAlunos);

carregarAlunos();