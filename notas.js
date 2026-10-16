
const API_URL = "https://apiofc.onrender.com/";

const parametros = new URLSearchParams(window.location.search);
const idAluno = parametros.get("id");

const titulo = document.getElementById("titulo-aluno");
const subtitulo = document.getElementById("subtitulo-aluno");
const mensagem = document.getElementById("mensagem-pagina");
const formulario = document.getElementById("form-notas");
const nota1 = document.getElementById("nota1");
const nota2 = document.getElementById("nota2");
const btnSalvar = document.getElementById("btn-salvar");

let alunoAtual = null;

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers
    }
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(detalhe || `Erro HTTP ${resposta.status}`);
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function obterNota(aluno, campo) {
  return aluno[campo] ?? aluno.notas?.[campo] ?? null;
}

function preencherCampo(campo, valor) {
  campo.value =
    valor === null || valor === undefined || valor === ""
      ? ""
      : String(valor).replace(",", ".");
}

function mostrarMensagem(texto, tipo = "") {
  mensagem.className = tipo ? `mensagem ${tipo}` : "mensagem";
  mensagem.textContent = texto;
}

function ativarFormulario(ativo) {
  nota1.disabled = !ativo;
  nota2.disabled = !ativo;
  btnSalvar.disabled = !ativo;
}

async function carregarAluno() {
  ativarFormulario(false);

  if (!idAluno) {
    titulo.textContent = "Aluno não informado";
    subtitulo.textContent = "Volte à lista e selecione um aluno.";
    mostrarMensagem("O endereço da página não contém um ID válido.", "erro");
    return;
  }

  try {
    const dados = await requisicao("/alunos");
    const alunos = Array.isArray(dados) ? dados : dados.alunos;

    if (!Array.isArray(alunos)) {
      throw new Error("A API não retornou uma lista válida.");
    }

    alunoAtual = alunos.find(
      aluno => String(aluno.id) === idAluno
    );

    if (!alunoAtual) {
      titulo.textContent = "Aluno não encontrado";
      subtitulo.textContent = "Confira o cadastro na lista de alunos.";
      mostrarMensagem("Não encontramos um aluno com esse ID.", "erro");
      return;
    }

    titulo.textContent = alunoAtual.nome;
    subtitulo.textContent = `Cadastro do aluno · ID ${alunoAtual.id}`;

    preencherCampo(nota1, obterNota(alunoAtual, "primeiroBimestre"));
    preencherCampo(nota2, obterNota(alunoAtual, "segundoBimestre"));

    ativarFormulario(true);
    mostrarMensagem("");
  } catch (erro) {
    titulo.textContent = "Erro ao carregar aluno";
    subtitulo.textContent = "Não foi possível buscar os dados.";
    mostrarMensagem(
      `Verifique a conexão com a API. ${erro.message}`,
      "erro"
    );
  }
}

formulario.addEventListener("submit", async evento => {
  evento.preventDefault();

  if (!alunoAtual) return;

  const valor1 = nota1.value.trim();
  const valor2 = nota2.value.trim();

  if (valor1 === "" || valor2 === "") {
    mostrarMensagem("Preencha as duas notas.", "erro");
    return;
  }

  const primeiroBimestre = Number(valor1.replace(",", "."));
  const segundoBimestre = Number(valor2.replace(",", "."));

  if (
    !Number.isFinite(primeiroBimestre) ||
    !Number.isFinite(segundoBimestre) ||
    primeiroBimestre < 0 ||
    primeiroBimestre > 10 ||
    segundoBimestre < 0 ||
    segundoBimestre > 10
  ) {
    mostrarMensagem("As notas devem estar entre 0 e 10.", "erro");
    return;
  }

  ativarFormulario(false);
  btnSalvar.textContent = "Salvando...";
  mostrarMensagem("Enviando alterações...");

  try {
    await requisicao(
      `/alunos/${encodeURIComponent(alunoAtual.id)}/notas`,
      {
        method: "PATCH",
        body: JSON.stringify({
          primeiroBimestre,
          segundoBimestre
        })
      }
    );

    // Busca os dados novamente para confirmar o estado no servidor.
    await carregarAluno();
    mostrarMensagem("Notas salvas com sucesso!", "sucesso");
  } catch (erro) {
    mostrarMensagem(
      `Não foi possível salvar as notas. ${erro.message}`,
      "erro"
    );
    ativarFormulario(true);
  } finally {
    btnSalvar.textContent = "Salvar notas";
  }
});

carregarAluno();
