/* ================================
   SIDEBAR
================================ */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* ================================
   DADOS DO LOCALSTORAGE
================================ */
let colaboradores = JSON.parse(localStorage.getItem("colaboradores")) || [];

/* ================================
   TRANSFORMAR COLABORADORES PARA EXIBIÇÃO
   REGRA:
   PJ  → mostra empresa + cnpj
   CLT → empresa vazio + cnpj vazio
================================ */
let empresas = colaboradores.map((col, index) => {

  return {
    id: col.id || index + 1,
    nome: col.contrato === "PJ" ? (col.empresa || "") : "",
    cnpj: col.contrato === "PJ" ? (col.cnpj || "") : "",
    contrato: col.contrato || "",
    equipe: col.equipe || "",
    uf_equipe: col.uf_equipe || "",
    status_equipe: col.status_equipe || "Ativo",
    nome_colaborador: col.nome || ""
  };

});

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
   COLUNAS (MANTIDAS)
================================ */
const columnDefs = [
  { headerName: "ID", field: "id", width: 90 },

  { headerName: "Empresa", field: "nome", flex: 1 },

  { headerName: "CNPJ", field: "cnpj", flex: 1 },

  {
    headerName: "Modalidade",
    field: "contrato",
    editable: true,
    minWidth: 140,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["CLT", "PJ"]
    }
  },

  { headerName: "Equipe", field: "equipe", flex: 1 },

  { headerName: "UF", field: "uf_equipe", flex: 1 },

  {
    headerName: "Status Equipe",
    field: "status_equipe",
    editable: true,
    minWidth: 190,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Ativo", "Inativo", "Em Homologação"]
    },
    cellStyle: params => {
      if (params.value === "Ativo") return { color: "green", fontWeight: "bold" };
      if (params.value === "Inativo") return { color: "red", fontWeight: "bold" };
      if (params.value === "Em Homologação") return { color: "#f59e0b", fontWeight: "bold" };
      return null;
    }
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
          <button class="btn-acao btn-equipe" onclick="adicionarEquipe(${params.data.id})">Equipe</button>
          <button onclick="editarEquipe(${params.data.id})">Editar</button>
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
  theme: "legacy",
  columnDefs: columnDefs,
  rowData: empresas, // 🔥 AGORA CORRETO

  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],

  animateRows: true,
  localeText: localeText,

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    menuTabs: []
  },

  suppressCellFocus: false,
  suppressDragLeaveHidesColumns: true,

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
   FUNÇÕES CRUD (MANTIDAS)
================================ */

function abrirCadastro() {
  window.location.href = "/cadastro.html";
}

function visualizar(id) {
  const empresa = empresas.find(e => e.id === id);
  alert(
    `Empresa: ${empresa.nome}\nCNPJ: ${empresa.cnpj}`
  );
}

function excluir(id) {
  if (confirm("Deseja excluir esta empresa?")) {
    empresas = empresas.filter(e => e.id !== id);
    atualizarGrid();
  }
}

let equipeAtualId = null;

function adicionarEquipe(id) {

  equipeAtualId = id;

  let html = "";

  for (let i = 1; i <= 6; i++) {
    html += `
      <div class="membro-bloco">
        <h3>Membro ${i}</h3>

        <div class="form-grid">
          <div class="form-group"><label>Nome</label><input type="text" id="m${i}_nome"></div>
          <div class="form-group"><label>Função</label><input type="text" id="m${i}_funcao"></div>
          <div class="form-group"><label>Contrato</label><input type="text" id="m${i}_contrato"></div>
          <div class="form-group"><label>RG</label><input type="text" id="m${i}_rg"></div>
          <div class="form-group"><label>CPF</label><input type="text" id="m${i}_cpf"></div>
          <div class="form-group"><label>Login Huawei</label><input type="text" id="m${i}_login"></div>
          <div class="form-group"><label>Contato</label><input type="text" id="m${i}_contato"></div>
        </div>

        <hr>
      </div>
    `;
  }

  document.getElementById("modalTitulo").innerText = "Adicionar Membros à Equipe";
  document.getElementById("modalBody").innerHTML = html;

  document.getElementById("modalEquipe").classList.remove("hidden");
}


/* ================================
   ATUALIZAR GRID
================================ */
function atualizarGrid() {
  if (gridApi) {
    gridApi.setGridOption("rowData", empresas);
  }
}

/* ================================
   QUICK FILTER
================================ */
function onQuickFilterChanged() {
  const value = document.getElementById("quickFilter").value;

  if (gridApi) {
    gridApi.setGridOption("quickFilterText", value);
  }

  

  equipes.forEach(equipe => {

    const card = document.createElement("div");
    card.classList.add("card-equipe");

    card.innerHTML = `
      <h3>${equipe.nome_equipe}</h3>
      <p><strong>Empresa:</strong> ${equipe.empresa || "Não informado"}</p>
      <p><strong>CNPJ:</strong> ${equipe.cnpj || "Não informado"}</p>
      <p><strong>Modalidade:</strong> ${equipe.modalidade}</p>
      <p><strong>Líder ID:</strong> ${equipe.lider_id}</p>
    `;

    container.appendChild(card);
  });
}

function salvarMembrosEquipe() {

  let equipes = JSON.parse(localStorage.getItem("equipes")) || [];

  const equipeIndex = equipes.findIndex(e => e.id === equipeAtualId);
  if (equipeIndex === -1) {
    alert("Equipe não encontrada.");
    return;
  }

  let membros = [];

  for (let i = 1; i <= 6; i++) {

    const nome = document.getElementById(`m${i}_nome`).value;

    if (nome.trim() !== "") {
      membros.push({
        nome: nome,
        funcao: document.getElementById(`m${i}_funcao`).value,
        rg: document.getElementById(`m${i}_rg`).value,
        cpf: document.getElementById(`m${i}_cpf`).value,
        login: document.getElementById(`m${i}_login`).value,
        contato: document.getElementById(`m${i}_contato`).value
      });
    }
  }

  equipes[equipeIndex].membros_detalhes = membros;

  localStorage.setItem("equipes", JSON.stringify(equipes));

  alert("Membros salvos com sucesso!");

  document.getElementById("modalEquipe").classList.remove("hidden");

}
function fecharModal() {
  document.getElementById("modalEquipe").classList.add("hidden");
}

function adicionarEquipe(id) {

  equipeAtualId = id;

  let equipes = JSON.parse(localStorage.getItem("equipes")) || [];

  // 🔥 Verifica se já existe equipe para esse ID
  let equipeExistente = equipes.find(e => e.id === id);

  // 🔥 Se não existir, cria uma nova estrutura base
  if (!equipeExistente) {
    equipes.push({
      id: id,
      membros_detalhes: []
    });

    localStorage.setItem("equipes", JSON.stringify(equipes));
  }

  let html = "";

  for (let i = 1; i <= 6; i++) {
    html += `
      <div class="membro-bloco">
        <h3>Membro ${i}</h3>

        <div class="form-grid">
          <div class="form-group"><label>Nome</label><input type="text" id="m${i}_nome"></div>
          <div class="form-group"><label>Função</label><input type="text" id="m${i}_funcao"></div>
          <div class="form-group"><label>Contrato</label><input type="text" id="m${i}_contrato"></div>
          <div class="form-group"><label>RG</label><input type="text" id="m${i}_rg"></div>
          <div class="form-group"><label>CPF</label><input type="text" id="m${i}_cpf"></div>
          <div class="form-group"><label>Login Huawei</label><input type="text" id="m${i}_login"></div>
          <div class="form-group"><label>Contato</label><input type="text" id="m${i}_contato"></div>
        </div>

        <hr>
      </div>
    `;
  }

  document.getElementById("modalTitulo").innerText = "Adicionar Membros à Equipe";
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("modalEquipe").classList.remove("hidden");
}
let equipeEditandoId = null;

function editarEquipe(id) {

  let equipes = JSON.parse(localStorage.getItem("equipes")) || [];

  const equipe = equipes.find(e => e.id === id);

  if (!equipe) {
    alert("Equipe não encontrada.");
    return;
  }

  equipeEditandoId = id;

  document.getElementById("editEmpresa").value = equipe.empresa || "";
  document.getElementById("editCnpj").value = equipe.cnpj || "";
  document.getElementById("editModalidade").value = equipe.modalidade || "";
  document.getElementById("editNomeEquipe").value = equipe.nome_equipe || "";
  document.getElementById("editUf").value = equipe.uf || "";

  document.getElementById("modalEditarEquipe").classList.remove("hidden");
}
function salvarEdicaoEquipe() {

  let equipes = JSON.parse(localStorage.getItem("equipes")) || [];

  const index = equipes.findIndex(e => e.id === equipeEditandoId);

  if (index === -1) {
    alert("Equipe não encontrada.");
    return;
  }

  equipes[index].empresa = document.getElementById("editEmpresa").value;
  equipes[index].cnpj = document.getElementById("editCnpj").value;
  equipes[index].modalidade = document.getElementById("editModalidade").value;
  equipes[index].nome_equipe = document.getElementById("editNomeEquipe").value;
  equipes[index].uf = document.getElementById("editUf").value;

  localStorage.setItem("equipes", JSON.stringify(equipes));

  alert("Equipe atualizada com sucesso!");

  fecharModalEditar();
}
function fecharModalEditar() {
  document.getElementById("modalEditarEquipe").classList.add("hidden");
}

/* ================================
   FUNÇÕES CRUD
================================ */

function abrirCadastro() {
  window.location.href = "colaborador.html";
}