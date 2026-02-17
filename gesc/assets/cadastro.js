/* ==========================================
   CONTROLE DO WIZARD
========================================== */

let etapaAtual = 0;

function selecionarTipo(tipo) {
  document.getElementById("escolha").classList.add("hidden");
  document.getElementById("wizard-" + tipo).classList.remove("hidden");

  etapaAtual = 0;

  const wizard = document.querySelector("#wizard-" + tipo);
  const steps = wizard.querySelectorAll(".step");

  steps.forEach((step, i) => {
    step.classList.remove("active");
    if (i === 0) step.classList.add("active");
  });
}

/* ==========================================
   NAVEGAÇÃO ENTRE ETAPAS
========================================== */

function proximaEtapa() {
  const wizard = document.querySelector(".wizard:not(.hidden)");
  if (!wizard) return;

  const steps = wizard.querySelectorAll(".step");
  const atual = wizard.querySelector(".step.active");

  let index = Array.from(steps).indexOf(atual);

  //  VALIDAR STATUS DA ETAPA (OBRIGATÓRIO)
  const statusSelect = atual.querySelector(".etapa-status-box select");

  if (statusSelect && statusSelect.value === "") {
    mostrarToast("Selecione o Status da Etapa antes de continuar.");
    statusSelect.focus();
    return;
  }

  // Validação específica da etapa 1 (se existir)
  if (index === 0) {
    if (!validarEtapa1()) return;
  }

  if (index < steps.length - 1) {
    atual.classList.remove("active");
    steps[index + 1].classList.add("active");
  } else {
    mostrarToast("Cadastro finalizado");
  }

  scrollTopo();
}



function voltarEtapa() {
  const wizard = document.querySelector(".wizard:not(.hidden)");
  if (!wizard) return;

  const steps = wizard.querySelectorAll(".step");
  const atual = wizard.querySelector(".step.active");

  let index = Array.from(steps).indexOf(atual);

  if (index > 0) {
    atual.classList.remove("active");
    steps[index - 1].classList.add("active");
    etapaAtual = index - 1;
  }

  scrollTopo();
}

function pular() {
  const wizard = document.querySelector(".wizard:not(.hidden)");
  const atual = wizard.querySelector(".step.active");
  const index = Array.from(wizard.querySelectorAll(".step")).indexOf(atual);

  if (index === 0 && !validarEtapa1()) return;

  proximaEtapa();
}


/* ==========================================
   SALVAR (SEM MUDAR ETAPA)
========================================== */

function salvar() {
  mostrarToast("Etapa " + (etapaAtual + 1) + " salva com sucesso");
}

/* ==========================================
   STATUS DAS ETAPAS (COM CORES)
========================================== */

function setStatus(select) {

  const container = select.closest(".form-group");
  if (!container) return;

  const badge = container.querySelector(".status-badge");
  if (!badge) return;

  badge.classList.remove(
    "hidden",
    "status-ativo",
    "status-inativo"
  );

  if (select.value === "ativo") {
    badge.textContent = "Ativo";
    badge.classList.add("status-ativo");
  } 
  else if (select.value === "inativo") {
    badge.textContent = "Inativo";
    badge.classList.add("status-inativo");
  } 
  else {
    badge.classList.add("hidden");
  }
}

/* ==========================================
   EMPRESA
========================================== */

function Pesquisar() {
  mostrarToast("Consulta de CNPJ simulada");
}

function cadastrarEmpresa() {
  mostrarToast("Empresa cadastrada com sucesso");
}

/* ==========================================
   COLABORADOR
========================================== */

function cadastrarColaborador() {
  mostrarToast("Colaborador cadastrado com sucesso");
}

/* ==========================================
   UTILITÁRIOS
========================================== */

function scrollTopo() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* Toast minimalista */
function mostrarToast(mensagem) {
  const toast = document.createElement("div");
  toast.innerText = mensagem;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#2E4770";
  toast.style.color = "#fff";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
// Alias para evitar erro no HTML
function setStatusEtapa(select) {
  const box = select.closest(".etapa-status-box");
  const badge = box.querySelector(".etapa-badge");

  badge.classList.remove("hidden", "concluida", "nao", "tratativa");

  if (!select.value) {
    badge.classList.add("hidden");
    return;
  }

  badge.textContent = select.options[select.selectedIndex].text;
  badge.classList.add(select.value);
}

function voltar() {
  voltarEtapa();
}
function validarEtapa1() {
  const etapa = document.querySelector(".step.active");
  const nome = etapa.querySelector('input[name="nome"]');
  const rg = etapa.querySelector('input[name="rg"]');
  const cpf = etapa.querySelector('input[name="cpf"]');

  if (!nome.value.trim() || !rg.value.trim() || !cpf.value.trim()) {
    mostrarToast("Preencha Nome, RG e CPF para continuar");
    return false;
  }

  return true;
}

function toggleTipoContratacao(select) {
  const ctps = document.getElementById("campo-ctps");
  const cnpj = document.getElementById("campo-cnpj");

  const inputCtps = ctps.querySelector("input");
  const inputCnpj = cnpj.querySelector("input");

  // Resetar campos
  inputCtps.value = "";
  inputCnpj.value = "";

  if (select.value === "clt") {
    ctps.classList.remove("hidden");
    cnpj.classList.add("hidden");
  } 
  else if (select.value === "pj") {
    cnpj.classList.remove("hidden");
    ctps.classList.add("hidden");
  } 
  else {
    ctps.classList.add("hidden");
    cnpj.classList.add("hidden");
  }
}
async function buscarCNPJ() {

  const cnpjInput = document.getElementById("cnpj");
  let cnpj = cnpjInput.value.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    showToast("CNPJ inválido", "error");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/cnpj/${cnpj}`);

    if (!response.ok) {
      showToast("Erro ao consultar API", "error");
      return;
    }

    const data = await response.json();

    if (data.erro) {
      showToast("CNPJ não encontrado", "error");
      return;
    }

    preencherEmpresa(data);
    showToast("Empresa encontrada com sucesso!", "success");

  } catch (error) {
    console.error("Erro ao buscar CNPJ:", error);
    showToast("Erro ao buscar CNPJ", "error");
  }
}

function preencherEmpresa(data) {

  document.querySelector('[name="data_abertura"]').value =
    formatarDataReceita(data.abertura);

  document.querySelector('[name="situacao_empresarial"]').value =
    data.situacao || "";

  document.querySelector('[name="tipo"]').value =
    data.tipo || "";

  document.querySelector('[name="nome_empresa"]').value =
    data.nome || "";

  document.querySelector('[name="nome_fantasia"]').value =
    data.fantasia || "";

  document.querySelector('[name="porte"]').value =
    data.porte || "";

  document.querySelector('[name="natureza_juridica"]').value =
    data.natureza_juridica || "";

  document.querySelector('[name="atividade_principal"]').value =
    data.atividade_principal?.[0]?.text || "";

  document.querySelector('[name="atividade_secundaria"]').value =
    data.atividades_secundarias?.map(a => a.text).join(", ") || "";

  document.querySelector('[name="logradouro"]').value =
    data.logradouro || "";

  document.querySelector('[name="numero"]').value =
    data.numero || "";

  document.querySelector('[name="municipio"]').value =
    data.municipio || "";

  document.querySelector('[name="bairro"]').value =
    data.bairro || "";

  document.querySelector('[name="uf"]').value =
    data.uf || "";

  document.querySelector('[name="cep"]').value =
    data.cep || "";

  document.querySelector('[name="email_empresa"]').value =
    data.email || "";

  document.querySelector('[name="telefone"]').value =
    data.telefone || "";

  document.querySelector('[name="capital_social"]').value =
    data.capital_social || "";

  document.querySelector('[name="qsa"]').value =
    data.qsa?.map(socio => `${socio.nome} - ${socio.qual}`).join(" | ") || "";

  document.querySelector('[name="efr"]').value =
    data.efr || "";

}

function formatarData(data) {
  return data || "";
}

function formatarDataReceita(data) {
  if (!data) return "";
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes}-${dia}`;
}

function mostrarLoading(status) {

  let cnpjInput = document.getElementById("cnpj");

  if (status) {
    cnpjInput.style.background = "#f0f9ff";
    cnpjInput.style.borderColor = "#2563eb";
  } else {
    cnpjInput.style.background = "";
    cnpjInput.style.borderColor = "";
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  if (!container) {
    console.error("Toast container não encontrado.");
    return;
  }

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}


function cadastrarColaborador() {

  const wizard = document.getElementById("wizard-colaborador");
  const inputs = wizard.querySelectorAll("input, select");

  let colaborador = {
    id: Date.now()
  };

  inputs.forEach(input => {
    if (input.name) {
      colaborador[input.name] = input.value;
    }
  });

  let lista = JSON.parse(localStorage.getItem("colaboradores")) || [];

  lista.push(colaborador);

  localStorage.setItem("colaboradores", JSON.stringify(lista));

  showToast("Colaborador cadastrado com sucesso!", "success");

  setTimeout(() => {
    window.location.href = "/colaborador.html";
  }, 1000);
}