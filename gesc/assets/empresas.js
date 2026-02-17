/* ================================
   SIDEBAR
================================ */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* ================================
   DADOS MOCKADOS (LOCALSTORAGE)
================================ */
let empresas = JSON.parse(localStorage.getItem("empresas")) || [];

if (empresas.length === 0) {
  empresas = [
    { id: 1, nome: "Empresa Alpha", cnpj: "00.000.000/0001-00", status: "Ativa" },
    { id: 2, nome: "Empresa Beta", cnpj: "11.111.111/0001-11", status: "Inativa" }
  ];
  localStorage.setItem("empresas", JSON.stringify(empresas));
}

/* ================================
   TRADUÇÃO PT-BR
================================ */
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
  selectAll: 'Selecionar Tudo',
  searchOoo: 'Pesquisar...',
  blanks: 'Vazio',
  filterOoo: 'Filtrar...',
  equals: 'Igual',
  notEqual: 'Diferente',
  lessThan: 'Menor que',
  greaterThan: 'Maior que',
  contains: 'Contém',
  notContains: 'Não contém',
  startsWith: 'Começa com',
  endsWith: 'Termina com',
  applyFilter: 'Aplicar',
  resetFilter: 'Limpar',
  clearFilter: 'Limpar',
  noRowsToShow: 'Nenhum registro encontrado'
};

/* ================================
   COLUNAS
================================ */
const columnDefs = [
  { headerName: "ID", field: "id", width: 90 },

  { headerName: "Empresa", field: "nome", flex: 1 },

  { headerName: "CNPJ", field: "cnpj", flex: 1 },
  
  { headerName: "UF", field: "uf_equipe", flex: 1 },

    {
  headerName: "Status",
  field: "status_empresa-page",
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
    headerName: "Ações",
    colId: "acoes",
    width: 280,
    filter: false,
    sortable: false,
    floatingFilter: false,
    cellRenderer: (params) => {
      return `
        <div class="acoes-botoes">
          <button class="btn-acao btn-ver" onclick="visualizar(${params.data.id})">Ver</button>
          <button class="btn-acao btn-editar" onclick="editar(${params.data.id})">Editar</button>
          <button class="btn-acao btn-excluir" onclick="excluir(${params.data.id})">Excluir</button>
        </div>
      `;
    }
  }
];

/* ================================
   GRID OPTIONS
================================ */

const gridOptions = {

  // 🔥 CORREÇÃO DO ERRO 239 (AG Grid v33+)
  theme: "legacy",

  columnDefs: columnDefs,
  rowData: empresas,

  /* ================================
     PAGINAÇÃO
  ================================= */
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],

  /* ================================
     CONFIG GERAL
  ================================= */
  animateRows: true,
  localeText: localeText,

  /* ================================
     PADRÃO DAS COLUNAS
  ================================= */
  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter', // filtro texto
    floatingFilter: true,         // caixa abaixo do header
    resizable: true,
    menuTabs: []                  // 🔥 remove totalmente o menu/funil
  },

  /* ================================
     SELEÇÃO
  ================================= */


  /* ================================
     ESTILO MAIS LIMPO
  ================================= */
  suppressCellFocus: false,
  suppressDragLeaveHidesColumns: true,

  /* ================================
     ALTURA
  ================================= */
  rowHeight: 42,
  headerHeight: 45
};


/* ================================
   INICIALIZAÇÃO
================================ */
let gridApi = null;

document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#empresasGrid");

  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});

/* ================================
   FUNÇÕES CRUD
================================ */

function abrirCadastro() {
  window.location.href = "cadastro.html";
}

function visualizar(id) {
  const empresa = empresas.find(e => e.id === id);
  alert(
    `Empresa: ${empresa.nome}\nCNPJ: ${empresa.cnpj}\nStatus: ${empresa.status}`
  );
}

function editar(id) {
  const empresa = empresas.find(e => e.id === id);
  const novoNome = prompt("Novo nome:", empresa.nome);

  if (novoNome) {
    empresa.nome = novoNome;
    atualizarGrid();
  }
}

function excluir(id) {
  if (confirm("Deseja excluir esta empresa?")) {
    empresas = empresas.filter(e => e.id !== id);
    atualizarGrid();
  }
}

function adicionarEquipe(id) {
  alert("Modal de equipe será implementado no próximo passo.");
}

/* ================================
   ATUALIZAR GRID (CORRIGIDO v35)
================================ */
function atualizarGrid() {
  localStorage.setItem("empresas", JSON.stringify(empresas));

  if (gridApi) {
    gridApi.setGridOption("rowData", empresas);
  }
}

/* ================================
   QUICK FILTER GLOBAL
================================ */
function onQuickFilterChanged() {
  const value = document.getElementById("quickFilter").value;

  if (gridApi) {
    gridApi.setGridOption("quickFilterText", value);
  }
}
function visualizar(id) {
  const empresa = empresas.find(e => e.id === id);

  if (!empresa) return;

  const modalBody = document.getElementById("modalEmpresaBody");

  modalBody.innerHTML = `
    <div class="modal-body-item"><label>ID:</label> ${empresa.id || ''}</div>
    <div class="modal-body-item"><label>Nome:</label> ${empresa.nome || ''}</div>
    <div class="modal-body-item"><label>CNPJ:</label> ${empresa.cnpj || ''}</div>
    <div class="modal-body-item"><label>Data de Abertura:</label> ${empresa.data_abertura || ''}</div>
    <div class="modal-body-item"><label>Situação Empresarial:</label> ${empresa.situacao_empresarial || ''}</div>
    <div class="modal-body-item"><label>Tipo:</label> ${empresa.tipo || ''}</div>
    <div class="modal-body-item"><label>Nome Fantasia:</label> ${empresa.nome_fantasia || ''}</div>
    <div class="modal-body-item"><label>Porte:</label> ${empresa.porte || ''}</div>
    <div class="modal-body-item"><label>Natureza Jurídica:</label> ${empresa.natureza_juridica || ''}</div>
    <div class="modal-body-item"><label>Atividade Principal:</label> ${empresa.atividade_principal || ''}</div>
    <div class="modal-body-item"><label>Atividade Secundária:</label> ${empresa.atividade_secundaria || ''}</div>
    <div class="modal-body-item"><label>Logradouro:</label> ${empresa.logradouro || ''}</div>
    <div class="modal-body-item"><label>Número:</label> ${empresa.numero || ''}</div>
    <div class="modal-body-item"><label>Município:</label> ${empresa.municipio || ''}</div>
    <div class="modal-body-item"><label>Bairro:</label> ${empresa.bairro || ''}</div>
    <div class="modal-body-item"><label>UF:</label> ${empresa.uf || ''}</div>
    <div class="modal-body-item"><label>CEP:</label> ${empresa.cep || ''}</div>
    <div class="modal-body-item"><label>E-mail:</label> ${empresa.email_empresa || ''}</div>
    <div class="modal-body-item"><label>Telefone:</label> ${empresa.telefone || ''}</div>
    <div class="modal-body-item"><label>Capital Social:</label> ${empresa.capital_social || ''}</div>
    <div class="modal-body-item"><label>QSA:</label> ${empresa.qsa || ''}</div>
    <div class="modal-body-item"><label>EFR:</label> ${empresa.efr || ''}</div>
    <div class="modal-body-item"><label>Data Início Contrato:</label> ${empresa.data_inicio_contrato || ''}</div>
    <div class="modal-body-item"><label>Status:</label> ${empresa.status || ''}</div>
  `;

  document.getElementById("modalEmpresa").classList.remove("hidden");
}

function fecharModalEmpresa() {
  document.getElementById("modalEmpresa").classList.add("hidden");
}

let empresaSelecionada = null; // armazenará a empresa sendo editada

function editar(id) {
  empresaSelecionada = empresas.find(e => e.id === id);

  if (!empresaSelecionada) return;

  const modalBody = document.getElementById("modalEditarBody");

  modalBody.innerHTML = `
    <div class="modal-body-item"><label>Nome:</label> <input type="text" id="edit_nome" value="${empresaSelecionada.nome}"></div>
    <div class="modal-body-item"><label>CNPJ:</label> <input type="text" id="edit_cnpj" value="${empresaSelecionada.cnpj}"></div>
    <div class="modal-body-item"><label>Status:</label>
      <select id="edit_status">
        <option value="Ativa" ${empresaSelecionada.status === "Ativa" ? "selected" : ""}>Ativa</option>
        <option value="Inativa" ${empresaSelecionada.status === "Inativa" ? "selected" : ""}>Inativa</option>
      </select>
    </div>
    <div class="modal-body-item"><label>Data de Abertura:</label> <input type="date" id="edit_data_abertura" value="${empresaSelecionada.data_abertura}"></div>
    <div class="modal-body-item"><label>Situação Empresarial:</label> <input type="text" id="edit_situacao_empresarial" value="${empresaSelecionada.situacao_empresarial}"></div>
    <div class="modal-body-item"><label>Tipo:</label> <input type="text" id="edit_tipo" value="${empresaSelecionada.tipo}"></div>
    <div class="modal-body-item"><label>Nome Fantasia:</label> <input type="text" id="edit_nome_fantasia" value="${empresaSelecionada.nome_fantasia}"></div>
    <div class="modal-body-item"><label>Porte:</label> <input type="text" id="edit_porte" value="${empresaSelecionada.porte}"></div>
    <div class="modal-body-item"><label>Natureza Jurídica:</label> <input type="text" id="edit_natureza_juridica" value="${empresaSelecionada.natureza_juridica}"></div>
    <div class="modal-body-item"><label>Atividade Principal:</label> <input type="text" id="edit_atividade_principal" value="${empresaSelecionada.atividade_principal}"></div>
    <div class="modal-body-item"><label>Atividade Secundária:</label> <input type="text" id="edit_atividade_secundaria" value="${empresaSelecionada.atividade_secundaria}"></div>
    <div class="modal-body-item"><label>Logradouro:</label> <input type="text" id="edit_logradouro" value="${empresaSelecionada.logradouro}"></div>
    <div class="modal-body-item"><label>Número:</label> <input type="text" id="edit_numero" value="${empresaSelecionada.numero}"></div>
    <div class="modal-body-item"><label>Município:</label> <input type="text" id="edit_municipio" value="${empresaSelecionada.municipio}"></div>
    <div class="modal-body-item"><label>Bairro:</label> <input type="text" id="edit_bairro" value="${empresaSelecionada.bairro}"></div>
    <div class="modal-body-item"><label>UF:</label> <input type="text" id="edit_uf" value="${empresaSelecionada.uf}"></div>
    <div class="modal-body-item"><label>CEP:</label> <input type="text" id="edit_cep" value="${empresaSelecionada.cep}"></div>
    <div class="modal-body-item"><label>E-mail:</label> <input type="email" id="edit_email_empresa" value="${empresaSelecionada.email_empresa}"></div>
    <div class="modal-body-item"><label>Telefone:</label> <input type="text" id="edit_telefone" value="${empresaSelecionada.telefone}"></div>
    <div class="modal-body-item"><label>Capital Social:</label> <input type="text" id="edit_capital_social" value="${empresaSelecionada.capital_social}"></div>
    <div class="modal-body-item"><label>QSA:</label> <input type="text" id="edit_qsa" value="${empresaSelecionada.qsa}"></div>
    <div class="modal-body-item"><label>EFR:</label> <input type="text" id="edit_efr" value="${empresaSelecionada.efr}"></div>
    <div class="modal-body-item"><label>Data Início Contrato:</label> <input type="date" id="edit_data_inicio_contrato" value="${empresaSelecionada.data_inicio_contrato}"></div>
  `;

  document.getElementById("modalEditarEmpresa").classList.remove("hidden");
}

function fecharModalEditar() {
  document.getElementById("modalEditarEmpresa").classList.add("hidden");
}

function salvarEdicao() {
  if (!empresaSelecionada) return;

  // Atualiza os campos
  empresaSelecionada.nome = document.getElementById("edit_nome").value;
  empresaSelecionada.cnpj = document.getElementById("edit_cnpj").value;
  empresaSelecionada.status = document.getElementById("edit_status").value;
  empresaSelecionada.data_abertura = document.getElementById("edit_data_abertura").value;
  empresaSelecionada.situacao_empresarial = document.getElementById("edit_situacao_empresarial").value;
  empresaSelecionada.tipo = document.getElementById("edit_tipo").value;
  empresaSelecionada.nome_fantasia = document.getElementById("edit_nome_fantasia").value;
  empresaSelecionada.porte = document.getElementById("edit_porte").value;
  empresaSelecionada.natureza_juridica = document.getElementById("edit_natureza_juridica").value;
  empresaSelecionada.atividade_principal = document.getElementById("edit_atividade_principal").value;
  empresaSelecionada.atividade_secundaria = document.getElementById("edit_atividade_secundaria").value;
  empresaSelecionada.logradouro = document.getElementById("edit_logradouro").value;
  empresaSelecionada.numero = document.getElementById("edit_numero").value;
  empresaSelecionada.municipio = document.getElementById("edit_municipio").value;
  empresaSelecionada.bairro = document.getElementById("edit_bairro").value;
  empresaSelecionada.uf = document.getElementById("edit_uf").value;
  empresaSelecionada.cep = document.getElementById("edit_cep").value;
  empresaSelecionada.email_empresa = document.getElementById("edit_email_empresa").value;
  empresaSelecionada.telefone = document.getElementById("edit_telefone").value;
  empresaSelecionada.capital_social = document.getElementById("edit_capital_social").value;
  empresaSelecionada.qsa = document.getElementById("edit_qsa").value;
  empresaSelecionada.efr = document.getElementById("edit_efr").value;
  empresaSelecionada.data_inicio_contrato = document.getElementById("edit_data_inicio_contrato").value;

  // Salva no localStorage
  localStorage.setItem("empresas", JSON.stringify(empresas));

  // Atualiza grid
  if (gridApi) gridApi.setGridOption("rowData", empresas);

  fecharModalEditar();
  empresaSelecionada = null;
}