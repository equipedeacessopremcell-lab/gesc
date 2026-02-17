let etapaSelecionada = null;
let colaboradorSelecionado = null;
/* =====================================================
   DADOS INICIAIS
===================================================== */

let colaboradores = JSON.parse(localStorage.getItem("colaboradores")) || [];

if (colaboradores.length === 0) {
  colaboradores = [
    {
      id: 1,
      nome: "João Silva Da Ferreira",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      telefone: "(11) 99999-9999",
      contrato: "CLT",
      funcao: "Técnico",
      status: "Ativo",
      homologacao: "Homologado",
      etapa1: "concluida",
      etapa2: "tratativa",
      etapa3: "nao",
      etapa4: "nao",
      etapa5: "concluida",
      etapa6: "tratativa",
      etapa7: "nao"
    }
  ];

  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));
}

/* =====================================================
   LOCALE PT-BR
===================================================== */

const localeText = {
  page: 'Página',
  more: 'Mais',
  to: 'até',
  of: 'de',
  next: 'Próxima',
  last: 'Última',
  first: 'Primeira',
  previous: 'Anterior',
  loadingOoo: 'Carregando...',
  noRowsToShow: 'Nenhum registro encontrado'
};

/* =====================================================
   STATUS COLORIDO ETAPAS
===================================================== */

function renderStatus(status) {

  let cor = "#dc2626";
  let texto = "Não Concluída";

  if (status === "concluida") {
    cor = "#16a34a";
    texto = "Concluída";
  }

  if (status === "tratativa") {
    cor = "#f59e0b";
    texto = "Em Tratativa";
  }

  return `<span style="font-weight:600;color:${cor}">${texto}</span>`;
}

/* =====================================================
   COLUNA ETAPA
===================================================== */

function criarColunaEtapa(nome, numero) {
  return {
    headerName: nome, // Aqui usamos o nome passado
    field: `etapa${numero}`,
    minWidth: 220,
    filter: false,
    cellRenderer: (params) => {
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          ${renderStatus(params.value)}
          <button 
            class="btn-grid btn-editar"
            onclick="abrirModal(${numero}, ${params.data.id})">
            Editar
          </button>
        </div>
      `;
    }
  };
}

/* =====================================================
   COLUNAS
===================================================== */

const columnDefs = [

  { headerName: "ID", field: "id", width: 80 },

  { headerName: "Nome", field: "nome", minWidth: 220 },

  { headerName: "CPF", field: "cpf", minWidth: 160 },

  { headerName: "RG", field: "rg", minWidth: 150 },

  { headerName: "Telefone", field: "telefone", minWidth: 160 },

  {
    headerName: "Contrato",
    field: "contrato",
    editable: true,
    minWidth: 140,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["CLT", "PJ"]
    }
  },

  { headerName: "CNPJ", field: "cnpj", minWidth: 160 },

  { headerName: "Função", field: "funcao", minWidth: 160 },

  {
  headerName: "Status Colaborador",
  field: "status",
  editable: true,
  minWidth: 170,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: {
    values: ["Ativo", "Inativo"]
  },
  cellStyle: params => ({
    color: params.value === "Ativo" ? "#16a34a" : "#dc2626",
    fontWeight: "bold"
  })
},
  

 {
  headerName: "Status Homologação",
  field: "homologacao",
  editable: true,
  minWidth: 190,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: {
    values: ["Homologado", "Não Homologado", "Em Homologação"]
  },
  cellStyle: params => {
    if (params.value === "Homologado") return { color: "green", fontWeight: "bold" };
    if (params.value === "Não Homologado") return { color: "red", fontWeight: "bold" };
    if (params.value === "Em Homologação") return { color: "#f59e0b", fontWeight: "bold" }; // laranja
    return null;
  }
},

{
  headerName: "Ação",
  minWidth: 280,
  filter: false,
  sortable: false,
  cellRenderer: (params) => {
    return `
      <div class="acoes-grid-2x2">
        <button class="btn-grid btn-ver" data-id="${params.data.id}">Ver</button>
        <button class="btn-grid btn-excluir" data-id="${params.data.id}">Excluir</button>
        <button class="btn-grid btn-criar-equipe" data-id="${params.data.id}">Criar Equipe</button>
      </div>
    `;
  }
},

criarColunaEtapa("1 - Informações Pessoais", 1),
criarColunaEtapa("2 - Risco Patrimonial", 2),
criarColunaEtapa("3 - Risco Operacional", 3),
criarColunaEtapa("4 - Ficha de Segurança do Colaborador", 4),
criarColunaEtapa("5 - Relação Contratual", 5),
criarColunaEtapa("6 - Risco de Vida", 6),
criarColunaEtapa("7 - Disponibilidade", 7)
];

/* =====================================================
   GRID OPTIONS
===================================================== */

let gridApi = null;

const gridOptions = {
  theme: 'legacy',
  columnDefs,
  rowData: colaboradores,

  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],

  animateRows: true,
  localeText,

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true
  },

  rowHeight: 42,
  headerHeight: 45,
  floatingFiltersHeight: 45,

  rowClassRules: {
    'linha-par': params => params.node.rowIndex % 2 === 0,
    'linha-impar': params => params.node.rowIndex % 2 !== 0
  },

getRowStyle: (params) => {

  if (!params.data) return null;

  if (params.data.status === "Ativo") {
    return { backgroundColor: "#dcfce7" }; // verde suave
  }

  if (params.data.status === "Inativo") {
    return { backgroundColor: "#fee2e2" }; // vermelho suave
  }

  return null;
},

  onFirstDataRendered: (params) => {
  if (params.columnApi) {
    const allColumnIds = params.columnApi.getAllColumns()?.map(col => col.getId()) || [];
    if (allColumnIds.length) {
      params.columnApi.autoSizeColumns(allColumnIds);
    }
  }
},

onCellValueChanged: (params) => {
  const updatedData = [];
  params.api.forEachNode(node => updatedData.push(node.data));
  colaboradores = updatedData;
  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));
}

};

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#colaboradoresGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

/* =====================================================
   EVENTOS BOTÕES AÇÃO
===================================================== */

document.addEventListener("click", function(e) {
  const id = parseInt(e.target.dataset.id);

  if (e.target.classList.contains("btn-editar-acao")) {
    editarColaborador(id); // Edição
  }

  if (e.target.classList.contains("btn-excluir")) {
    if (confirm("Deseja realmente excluir?")) {
      colaboradores = colaboradores.filter(c => c.id !== id);
      localStorage.setItem("colaboradores", JSON.stringify(colaboradores));
      gridApi.setGridOption("rowData", colaboradores);
    }
  }

if (e.target.classList.contains("btn-criar-equipe")) {
  const colaborador = colaboradores.find(c => c.id === id);
  if (!colaborador) return;
  criarEquipe(colaborador);
  
  // Novo código: exporta para equipes
  const equipes = JSON.parse(localStorage.getItem("equipes")) || [];

  equipes.push({
    empresa: colaborador.empresa || "", // se tiver o campo empresa
    cnpj: colaborador.cnpj || "",
    contrato: colaborador.contrato || "",
    nome: colaborador.nome
  });

  localStorage.setItem("equipes", JSON.stringify(equipes));

}
});

// ABRIR MODAL VER COLABORADOR
function abrirModalVer(id) {
  // Busca o colaborador correto
  const colab = colaboradores.find(c => c.id === id);
  if (!colab) return;

  // Monta o conteúdo do modal com as informações solicitadas
  const modalBody = document.getElementById("modalVerBody");
  modalBody.innerHTML = `
    <div class="form-group"><label>Nome Completo</label><input type="text" value="${colab.nome || ''}" readonly></div>
    <div class="form-group"><label>RG</label><input type="text" value="${colab.rg || ''}" readonly></div>
    <div class="form-group"><label>CPF</label><input type="text" value="${colab.cpf || ''}" readonly></div>
    <div class="form-group"><label>Contato</label><input type="text" value="${colab.telefone || ''}" readonly></div>
    <div class="form-group"><label>E-mail</label><input type="email" value="${colab.email_colaborador || ''}" readonly></div>
    <div class="form-group"><label>Data de Nascimento</label><input type="date" value="${colab.data_nascimento || ''}" readonly></div>
    <div class="form-group"><label>Idade</label><input type="number" value="${colab.idade || ''}" readonly></div>
    <div class="form-group"><label>Efetivação</label><input type="text" value="${colab.efetivacao || ''}" readonly></div>
    <div class="form-group"><label>Tipo de Contratação</label><input type="text" value="${colab.tipo_contratacao || ''}" readonly></div>
    <div class="form-group"><label>Login Huawei</label><input type="text" value="${colab.login_huawei || ''}" readonly></div>
    <div class="form-group"><label>Função</label><input type="text" value="${colab.funcao || ''}" readonly></div>
    <div class="form-group"><label>Status do Colaborador</label><input type="text" value="${colab.status || ''}" readonly></div>
  `;

  // Abre o modal
  document.getElementById("modalVerColaborador").classList.remove("hidden");
}

function fecharModal() {
  const modais = document.querySelectorAll(".modal");
  modais.forEach(m => m.classList.add("hidden"));
}

// Evento do botão "Ver" atualizado
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-ver")) {
    const id = parseInt(e.target.dataset.id);
    abrirModalVer(id);
  }
});



/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirModal(etapa, id) {
  const colab = colaboradores.find(c => c.id === id);
  if (!colab) return;

  etapaSelecionada = etapa;
  colaboradorSelecionado = id;

  if (etapa === 1) {
    // Modal completo de edição da Etapa 1
    document.getElementById("modalTitulo").innerText = `Editar Informações Pessoais`;

    document.getElementById("modalBody").innerHTML = `
      <div class="form-grid">
        <div class="form-group"><label>Nome Completo</label><input type="text" id="editNome" value="${colab.nome || ''}"></div>
        <div class="form-group"><label>RG</label><input type="text" id="editRg" value="${colab.rg || ''}"></div>
        <div class="form-group"><label>CPF</label><input type="text" id="editCpf" value="${colab.cpf || ''}"></div>
        <div class="form-group"><label>Contato</label><input type="text" id="editContato" value="${colab.telefone || ''}"></div>
        <div class="form-group"><label>E-mail</label><input type="email" id="editEmail" value="${colab.email_colaborador || ''}"></div>
        <div class="form-group"><label>Data de Nascimento</label><input type="date" id="editDataNasc" value="${colab.data_nascimento || ''}"></div>
        <div class="form-group"><label>Idade</label><input type="number" id="editIdade" value="${colab.idade || ''}"></div>
        <div class="form-group"><label>Efetivação</label><input type="date" id="editEfetivacao" value="${colab.efetivacao || ''}"></div>
        
        <div class="form-group"><label>Login Huawei</label><input type="text" id="editLogin" value="${colab.login_huawei || ''}"></div>
      
        <div class="form-group">
  <label>Tipo de Contratação</label>
  <select id="editContrato">
    <option value="CLT" ${colab.contrato === "CLT" ? "selected" : ""}>CLT</option>
    <option value="PJ" ${colab.contrato === "PJ" ? "selected" : ""}>PJ</option>
  </select>
</div>

<div class="form-group">
  <label>Função</label>
  <select id="editFuncao">
    <option value="Lider" ${colab.funcao === "Lider" ? "selected" : ""}>Líder</option>
    <option value="Instalador" ${colab.funcao === "Instalador" ? "selected" : ""}>Instalador</option>
  </select>
</div>
        <div class="form-group">
          <label>Status do Colaborador</label>
          <select id="editStatus">
            <option value="Ativo" ${colab.status === "Ativo" ? "selected" : ""}>Ativo</option>
            <option value="Inativo" ${colab.status === "Inativo" ? "selected" : ""}>Inativo</option>
            <option value="Em Homologação" ${colab.status === "Em Homologação" ? "selected" : ""}>Em Homologação</option>
          </select>
        </div>

        <div class="form-group">
          ${gerarSelectStatusEtapa("statusEtapaModal")}
            
        </div>
      </div>
    `;
  } else if (etapa === 2) {

  document.getElementById("modalTitulo").innerText = `Editar Etapa 2 — Risco Patrimonial`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <div class="form-group">
        <label>AC</label>
        <select id="editAc">
          <option value="">Selecione</option>
          <option value="consta" ${colab.ac === "consta" ? "selected" : ""}>Consta</option>
          <option value="nao_consta" ${colab.ac === "nao_consta" ? "selected" : ""}>Não Consta</option>
          <option value="nada_consta" ${colab.ac === "nada_consta" ? "selected" : ""}>Nada Consta</option>
        </select>
      </div>

      <div class="form-group">
        <label>Análise AC</label>
        <input type="text" id="editAnaliseAc" value="${colab.analise_ac || ""}">
      </div>

      <div class="form-group">
        <label>JusBrasil AC</label>
        <input type="text" id="editJusAc" value="${colab.jusbrasil_ac || ""}">
      </div>

      <div class="form-group">
        <label>Análise Jus AC</label>
        <input type="text" id="editAnaliseJusAc" value="${colab.analise_jus_ac || ""}">
      </div>

      <div class="form-group">
        <label>Risco Patrimonial</label>
        <input type="text" id="editRiscoPatrimonial" value="${colab.risco_patrimonial || ""}">
      </div>

      <div class="form-group">
     ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
else if (etapa === 3) {

  document.getElementById("modalTitulo").innerText = `Editar Etapa 3 — Risco Operacional`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <div class="form-group">
        <label>Entrevistador Técnico</label>
        <input type="text" id="editEntrevistadorTecnico" 
          value="${colab.entrevistador_tecnico || ""}">
      </div>

      <div class="form-group">
        <label>Parecer Técnico</label>
        <select id="editParecerTecnico">
          <option value="">Selecione</option>
          <option value="apto" ${colab.parecer_tecnico === "apto" ? "selected" : ""}>Apto</option>
          <option value="nao_apto" ${colab.parecer_tecnico === "nao_apto" ? "selected" : ""}>Não Apto</option>
        </select>
      </div>

      <div class="form-group">
        <label>Risco Operacional</label>
        <input type="text" id="editRiscoOperacional" 
          value="${colab.risco_operacional || ""}">
      </div>

      <div class="form-group">
        ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
else if (etapa === 4) {

  document.getElementById("modalTitulo").innerText =
    `Editar Etapa 4 — Ficha de Segurança do Colaborador`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <!-- NR10 -->
      <div class="form-group">
        <label>NR10</label>
        <select id="editNr10">
          <option value="">Selecione</option>
          <option value="20h" ${colab.nr10 === "20h" ? "selected" : ""}>20 Horas</option>
          <option value="40h" ${colab.nr10 === "40h" ? "selected" : ""}>40 Horas</option>
          <option value="pendente" ${colab.nr10 === "pendente" ? "selected" : ""}>Pendente</option>
        </select>
      </div>

      <div class="form-group">
        <label>Data NR10</label>
        <input type="date" id="editDataNr10" value="${colab.data_nr10 || ""}">
      </div>

      <div class="form-group">
        <label>Validade NR10</label>
        <input type="date" id="editValidadeNr10" value="${colab.validade_nr10 || ""}">
      </div>

      <div class="form-group">
        <label>Status NR10</label>
        <select id="editStatusNr10">
          <option value="APROVADO" ${colab.status_nr10 === "APROVADO" ? "selected" : ""}>APROVADO</option>
          <option value="REPROVADO" ${colab.status_nr10 === "REPROVADO" ? "selected" : ""}>REPROVADO</option>
          <option value="VENCIDO" ${colab.status_nr10 === "VENCIDO" ? "selected" : ""}>VENCIDO</option>
        </select>
      </div>

      <!-- NR35 -->
      <div class="form-group">
        <label>NR35</label>
        <select id="editNr35">
          <option value="">Selecione</option>
          <option value="8h" ${colab.nr35 === "8h" ? "selected" : ""}>8 Horas</option>
          <option value="16h" ${colab.nr35 === "16h" ? "selected" : ""}>16 Horas</option>
          <option value="pendente" ${colab.nr35 === "pendente" ? "selected" : ""}>Pendente</option>
        </select>
      </div>

      <div class="form-group">
        <label>Data NR35</label>
        <input type="date" id="editDataNr35" value="${colab.data_nr35 || ""}">
      </div>

      <div class="form-group">
        <label>Validade NR35</label>
        <input type="date" id="editValidadeNr35" value="${colab.validade_nr35 || ""}">
      </div>

      <div class="form-group">
        <label>Status NR35</label>
        <select id="editStatusNr35">
          <option value="APROVADO" ${colab.status_nr35 === "APROVADO" ? "selected" : ""}>APROVADO</option>
          <option value="REPROVADO" ${colab.status_nr35 === "REPROVADO" ? "selected" : ""}>REPROVADO</option>
          <option value="VENCIDO" ${colab.status_nr35 === "VENCIDO" ? "selected" : ""}>VENCIDO</option>
        </select>
      </div>

      <!-- ASO -->
      <div class="form-group">
        <label>ASO</label>
        <input type="text" id="editAso" value="${colab.aso || ""}">
      </div>

      <div class="form-group">
        <label>Data ASO</label>
        <input type="date" id="editDataAso" value="${colab.data_aso || ""}">
      </div>

      <div class="form-group">
        <label>Status ASO</label>
        <select id="editStatusAso">
          <option value="APROVADO" ${colab.status_aso === "APROVADO" ? "selected" : ""}>APROVADO</option>
          <option value="REPROVADO" ${colab.status_aso === "REPROVADO" ? "selected" : ""}>REPROVADO</option>
          <option value="VENCIDO" ${colab.status_aso === "VENCIDO" ? "selected" : ""}>VENCIDO</option>
        </select>
      </div>

       <div class="form-group">
        <label>Verba Premcell</label>
        <input type="text" id="editVerbaPremcell" value="${colab.verba_premcell || ""}">
      </div>

      <!-- CAMPOS ADICIONAIS -->
      <div class="form-group">
        <label>Inspeção EPI</label>
        <input type="text" id="editInspecaoEpi" value="${colab.inspecao_epi || ""}">
      </div>

      <div class="form-group">
        <label>Inspeção Veicular</label>
        <input type="text" id="editInspecaoVeicular" value="${colab.inspecao_veicular || ""}">
      </div>

      <div class="form-group">
        <label>Ficha de EPI</label>
        <select id="editFichaEpi">
          <option value="APROVADO" ${colab.ficha_epi === "APROVADO" ? "selected" : ""}>APROVADO</option>
          <option value="REPROVADO" ${colab.ficha_epi === "REPROVADO" ? "selected" : ""}>REPROVADO</option>
          <option value="EM APROVAÇÃO" ${colab.ficha_epi === "EM APROVAÇÃO" ? "selected" : ""}>EM APROVAÇÃO</option>
        </select>
      </div>

      <div class="form-group">
        <label>OS</label>
        <input type="text" id="editOs" value="${colab.os || ""}">
      </div>

      <div class="form-group">
        <label>Risco de Segurança</label>
        <input type="text" id="editRiscoSeguranca" value="${colab.risco_seguranca || ""}">
      </div>

      <div class="form-group">
        ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
else if (etapa === 5) {

  document.getElementById("modalTitulo").innerText =
    `Editar Etapa 5 — Relação Contratual`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <div class="form-group">
        <label>Ex Funcionário</label>
        <select id="editExFuncionario">
          <option value="">Selecione</option>
          <option value="sim" ${colab.ex_funcionario === "sim" ? "selected" : ""}>SIM</option>
          <option value="nao" ${colab.ex_funcionario === "nao" ? "selected" : ""}>NÃO</option>
        </select>
      </div>

      <div class="form-group">
        <label>Data do Desligamento</label>
        <input type="date" id="editDataDesligamento"
          value="${colab.data_desligamento || ""}">
      </div>

      <div class="form-group">
        <label>Tempo do Desligamento</label>
        <input type="text" id="editTempoDesligamento"
          value="${colab.tempo_desligamento || ""}">
      </div>

      <div class="form-group">
        <label>Motivo</label>
        <input type="text" id="editMotivo"
          value="${colab.motivo || ""}">
      </div>

      <div class="form-group">
        <label>Tipo de Contratação</label>
        <select id="editTipoContratacao">
          <option value="">Selecione</option>
          <option value="formal" ${colab.tipo_contratacao === "formal" ? "selected" : ""}>Formal</option>
          <option value="informal" ${colab.tipo_contratacao === "informal" ? "selected" : ""}>Informal</option>
        </select>
      </div>

      <div class="form-group">
        <label>Data de Contrato</label>
        <input type="date" id="editDataContrato"
          value="${colab.data_contrato || ""}">
      </div>

      <div class="form-group">
        <label>Tempo de Contrato</label>
        <input type="text" id="editTempoContrato"
          value="${colab.tempo_contrato || ""}">
      </div>

      <div class="form-group">
        <label>Forma de Pagamento</label>
        <input type="text" id="editFormaPagamento"
          value="${colab.forma_pagamento || ""}">
      </div>

      <div class="form-group">
        <label>JUSBRASIL TRT</label>
        <input type="text" id="editJusbrasilTrt"
          value="${colab.jusbrasil_trt || ""}">
      </div>

      <div class="form-group">
        <label>Análise JUS TRT</label>
        <input type="text" id="editAnaliseJusTrt"
          value="${colab.analise_jus_trt || ""}">
      </div>

      <div class="form-group">
        <label>Risco Trabalhista</label>
        <input type="text" id="editRiscoTrabalhista"
          value="${colab.risco_trabalhista || ""}">
      </div>

      <div class="form-group">
        ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
else if (etapa === 6) {

  document.getElementById("modalTitulo").innerText =
    `Editar Etapa 6 — Risco de Vida`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <div class="form-group">
        <label>Contrato CSE</label>
        <select id="editContratoCse">
          <option value="">Selecione</option>
          <option value="aprovado" ${colab.contrato_cse === "aprovado" ? "selected" : ""}>Aprovado</option>
          <option value="nao_aprovado" ${colab.contrato_cse === "nao_aprovado" ? "selected" : ""}>Não Aprovado</option>
          <option value="tratativa" ${colab.contrato_cse === "tratativa" ? "selected" : ""}>Em Tratativa</option>
        </select>
      </div>

      <div class="form-group">
        <label>Data CSE</label>
        <input type="date" id="editDataCse"
          value="${colab.data_cse || ""}">
      </div>

      <div class="form-group">
        <label>Data de Vencimento</label>
        <input type="date" id="editDataVencimentoCse"
          value="${colab.data_vencimento_cse || ""}">
      </div>

      <div class="form-group">
        <label>Anexo CSE</label>
        <input type="text" id="editAnexoCse"
          value="${colab.anexo_cse || ""}">
      </div>

      <div class="form-group">
        <label>Risco de Vida</label>
        <input type="text" id="editRiscoVida"
          value="${colab.risco_vida || ""}">
      </div>

      <div class="form-group">
        ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
else if (etapa === 7) {

  document.getElementById("modalTitulo").innerText =
    `Editar Etapa 7 — Disponibilidade`;

  document.getElementById("modalBody").innerHTML = `
    <div class="form-grid">

      <div class="form-group">
        <label>Disponibilidade</label>
        <input type="date" id="editDisponibilidade"
          value="${colab.disponibilidade || ""}">
      </div>

      <div class="form-group">
        <label>Observações</label>
        <input type="text" id="editObservacoes"
          value="${colab.observacoes || ""}">
      </div>

      <div class="form-group">
        ${gerarSelectStatusEtapa("statusEtapaModal")}

      </div>

    </div>
  `;
}
  document.getElementById("modalEtapa").classList.remove("hidden");
}

/* =====================================================
   SALVAR EDIÇÃO
===================================================== */

function salvarEdicao() {

  const colab = colaboradores.find(c => c.id === colaboradorSelecionado);
  if (!colab) return;
  const statusSelecionado = document.getElementById("statusEtapaModal")?.value;

if (!statusSelecionado) {
  mostrarToast("Selecione o Status da Etapa antes de salvar.", "aviso");
  return;
}

  /* ================= ETAPA 1 ================= */
  if (etapaSelecionada === 1) {

    colab.nome = document.getElementById("editNome").value;
    colab.rg = document.getElementById("editRg").value;
    colab.cpf = document.getElementById("editCpf").value;
    colab.telefone = document.getElementById("editContato").value;
    colab.email_colaborador = document.getElementById("editEmail").value;
    colab.data_nascimento = document.getElementById("editDataNasc").value;
    colab.idade = document.getElementById("editIdade").value;
    colab.efetivacao = document.getElementById("editEfetivacao").value;
    colab.contrato = document.getElementById("editContrato").value;
    colab.login_huawei = document.getElementById("editLogin").value;
    colab.funcao = document.getElementById("editFuncao").value;
    colab.status = document.getElementById("editStatus").value;

    colab.etapa1 = document.getElementById("statusEtapaModal").value;
  }

  /* ================= ETAPA 2 ================= */
  else if (etapaSelecionada === 2) {

    colab.ac = document.getElementById("editAc").value;
    colab.analise_ac = document.getElementById("editAnaliseAc").value;
    colab.jusbrasil_ac = document.getElementById("editJusAc").value;
    colab.analise_jus_ac = document.getElementById("editAnaliseJusAc").value;
    colab.risco_patrimonial = document.getElementById("editRiscoPatrimonial").value;

    colab.etapa2 = document.getElementById("statusEtapaModal").value;
  }

  /* ================= ETAPA 3 ================= */
  else if (etapaSelecionada === 3) {

    colab.entrevistador_tecnico =
      document.getElementById("editEntrevistadorTecnico").value;

    colab.parecer_tecnico =
      document.getElementById("editParecerTecnico").value;

    colab.risco_operacional =
      document.getElementById("editRiscoOperacional").value;

    colab.etapa3 =
      document.getElementById("statusEtapaModal").value;
  }

  /* ================= ETAPA 4 ================= */
  else if (etapaSelecionada === 4) {

    colab.nr10 = document.getElementById("editNr10").value;
    colab.data_nr10 = document.getElementById("editDataNr10").value;
    colab.validade_nr10 = document.getElementById("editValidadeNr10").value;
    colab.status_nr10 = document.getElementById("editStatusNr10").value;

    colab.nr35 = document.getElementById("editNr35").value;
    colab.data_nr35 = document.getElementById("editDataNr35").value;
    colab.validade_nr35 = document.getElementById("editValidadeNr35").value;
    colab.status_nr35 = document.getElementById("editStatusNr35").value;

    colab.aso = document.getElementById("editAso").value;
    colab.data_aso = document.getElementById("editDataAso").value;
    colab.status_aso = document.getElementById("editStatusAso").value;

    colab.risco_seguranca =
      document.getElementById("editRiscoSeguranca").value;

    colab.etapa4 =
      document.getElementById("statusEtapaModal").value;
  }

  /* ================= OUTRAS ETAPAS ================= */

else if (etapaSelecionada === 5) {

  colab.ex_funcionario = document.getElementById("editExFuncionario").value;
  colab.data_desligamento = document.getElementById("editDataDesligamento").value;
  colab.tempo_desligamento = document.getElementById("editTempoDesligamento").value;
  colab.motivo = document.getElementById("editMotivo").value;

  colab.tipo_contratacao = document.getElementById("editTipoContratacao").value;
  colab.data_contrato = document.getElementById("editDataContrato").value;
  colab.tempo_contrato = document.getElementById("editTempoContrato").value;
  colab.forma_pagamento = document.getElementById("editFormaPagamento").value;

  colab.jusbrasil_trt = document.getElementById("editJusbrasilTrt").value;
  colab.analise_jus_trt = document.getElementById("editAnaliseJusTrt").value;
  colab.risco_trabalhista = document.getElementById("editRiscoTrabalhista").value;

  colab.etapa5 = document.getElementById("statusEtapaModal").value;
}
else if (etapaSelecionada === 6) {

  colab.contrato_cse = document.getElementById("editContratoCse").value;
  colab.data_cse = document.getElementById("editDataCse").value;
  colab.data_vencimento_cse = document.getElementById("editDataVencimentoCse").value;
  colab.anexo_cse = document.getElementById("editAnexoCse").value;
  colab.risco_vida = document.getElementById("editRiscoVida").value;

  colab.etapa6 = document.getElementById("statusEtapaModal").value;
}else if (etapaSelecionada === 7) {

  colab.disponibilidade =
    document.getElementById("editDisponibilidade").value;

  colab.observacoes =
    document.getElementById("editObservacoes").value;

  colab.etapa7 =
    document.getElementById("statusEtapaModal").value;
}
  else {


    colab[`etapa${etapaSelecionada}`] =
      document.getElementById("statusEtapaModal").value;
  }
  

  // Salva no localStorage
  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));

  // Atualiza grid
gridApi.applyTransaction({ update: [colab] });


fecharModal();
mostrarToast("Etapa salva com sucesso!", "sucesso");
}

function fecharModalVer() {
  const modal = document.getElementById("modalVerColaborador");
  if (modal) {
    modal.classList.add("hidden");
  }
}  
function gerarSelectStatusEtapa(idSelect, valorAtual = "") {
  return `
    <div class="form-group">
      <label>Status da Etapa</label>
      <select id="${idSelect}" required>
        <option value="" disabled ${!valorAtual ? "selected" : ""}>Selecione</option>
        <option value="concluida" ${valorAtual === "concluida" ? "selected" : ""}>Concluída</option>
        <option value="nao" ${valorAtual === "nao" ? "selected" : ""}>Não Concluída</option>
        <option value="tratativa" ${valorAtual === "tratativa" ? "selected" : ""}>Em Tratativa</option>
      </select>
    </div>
  `;
}


function mostrarToast(mensagem, tipo = "erro") {
  const toast = document.getElementById("toastAviso");

  toast.textContent = mensagem;

  // Reset classes
  toast.className = "toast";

  if (tipo === "sucesso") {
    toast.classList.add("toast-sucesso");
  } else if (tipo === "aviso") {
    toast.classList.add("toast-aviso");
  } else {
    toast.classList.add("toast-erro");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

  /* ================= CRIAÇÃO DE EQUIPE ================= */


function criarEquipe(colaborador) {

  let equipes = JSON.parse(localStorage.getItem("equipes")) || [];
  let colaboradores = JSON.parse(localStorage.getItem("colaboradores")) || [];

  // 🔥 Verifica se já existe equipe para esse colaborador
  const jaTemEquipe = equipes.some(eq => eq.lider_id === colaborador.id);

  if (jaTemEquipe) {
    alert("Este colaborador já possui uma equipe criada.");
    return;
  }

  // 🔥 Cria nova equipe
  const novaEquipe = {
    id: Date.now(),
    empresa_id: colaborador.empresa_id || null,
    empresa: colaborador.empresa || "",
    cnpj: colaborador.cnpj || "",
    modalidade: colaborador.contrato,
    nome_equipe: `Equipe ${colaborador.nome}`,
    lider_id: colaborador.id,
    membros: [colaborador.id],
    created_at: new Date().toISOString()
  };

  equipes.push(novaEquipe);

  // 🔥 Atualiza colaborador com o nome da equipe
  const indexColaborador = colaboradores.findIndex(c => c.id === colaborador.id);

  if (indexColaborador !== -1) {
    colaboradores[indexColaborador].equipe = novaEquipe.nome_equipe;
    colaboradores[indexColaborador].status_equipe = "Ativo";
  }

  // 🔥 Salva tudo novamente
  localStorage.setItem("equipes", JSON.stringify(equipes));
  localStorage.setItem("colaboradores", JSON.stringify(colaboradores));

  alert(`Equipe criada com ${colaborador.nome} como líder.`);

  // 🔥 Se estiver usando AG Grid, atualiza automaticamente
  if (typeof atualizarGrid === "function") {
    atualizarGrid();
  }
}

/* ================================
   FUNÇÕES CRUD
================================ */

function abrirCadastro() {
  window.location.href = "cadastro.html";
}


