// =============================================
// DADOS — carregados do localStorage
// =============================================
let gastos  = JSON.parse(localStorage.getItem('ft_gastos')  || '[]');
let dividas = JSON.parse(localStorage.getItem('ft_dividas') || '[]');

// Filtro de categoria ativo na aba Gastos
let catFilter = 'all';

// Cores para o gráfico de categorias
const CAT_COLORS = {
  'Alimentação': '#4ade80',
  'Transporte':  '#60a5fa',
  'Saúde':       '#f472b6',
  'Lazer':       '#a78bfa',
  'Moradia':     '#fbbf24',
  'Outros':      '#94a3b8',
  'Receita':     '#34d399',
};


// =============================================
// INICIALIZAÇÃO
// =============================================
populateMonthSelector();
setTodayAsDefault();
render();


// =============================================
// SELETOR DE MÊS
// =============================================

// Popula o <select> com os últimos 12 meses
function populateMonthSelector() {
  const sel = document.getElementById('sel-month');
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    if (i === 0) opt.selected = true;
    sel.appendChild(opt);
  }
}

// Retorna o mês selecionado no formato "YYYY-MM"
function getSelectedMonth() {
  return document.getElementById('sel-month').value;
}

// Filtra gastos pelo mês selecionado
function gastosDoMes() {
  const m = getSelectedMonth();
  return gastos.filter(g => g.data.startsWith(m));
}


// =============================================
// SALVAR NO LOCALSTORAGE
// =============================================
function save() {
  localStorage.setItem('ft_gastos',  JSON.stringify(gastos));
  localStorage.setItem('ft_dividas', JSON.stringify(dividas));
}


// =============================================
// NAVEGAÇÃO ENTRE ABAS
// =============================================
function switchTab(tab, btn) {
  // Esconde todos os conteúdos
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Ativa o selecionado
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');

  // Atualiza título e subtítulo do topbar
  const titles = {
    dashboard: ['Dashboard', 'Visão geral do seu mês'],
    gastos:    ['Lançamentos', 'Receitas e gastos detalhados'],
    dividas:   ['Dívidas & Parcelas', 'Controle do que ainda deve'],
  };
  document.getElementById('page-title').textContent = titles[tab][0];
  document.getElementById('page-sub').textContent   = titles[tab][1];

  render();
}


// =============================================
// MODAL
// =============================================
function openModal() {
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Fecha ao clicar fora do box
function closeModalOutside(e) {
  if (e.target.id === 'modal') closeModal();
}

// Alterna entre o form de gasto e o form de dívida
function switchModalTab(tipo, btn) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('form-gasto').style.display  = tipo === 'gasto'  ? 'block' : 'none';
  document.getElementById('form-divida').style.display = tipo === 'divida' ? 'block' : 'none';
}

// Define data padrão do formulário como hoje
function setTodayAsDefault() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('g-data').value = today;
}


// =============================================
// ADICIONAR GASTO / RECEITA
// =============================================
function addGasto() {
  const desc  = document.getElementById('g-desc').value.trim();
  const valor = parseFloat(document.getElementById('g-valor').value);

  if (!desc || isNaN(valor) || valor <= 0) {
    highlight(['g-desc', 'g-valor']);
    return;
  }

  const g = {
    id:   Date.now(),
    desc,
    valor,
    tipo: document.getElementById('g-tipo').value,    // 'gasto' ou 'receita'
    cat:  document.getElementById('g-cat').value,
    data: document.getElementById('g-data').value,
    obs:  document.getElementById('g-obs').value.trim(),
  };

  gastos.unshift(g);
  save();
  closeModal();
  clearGastoForm();
  render();
}

function clearGastoForm() {
  ['g-desc', 'g-valor', 'g-obs'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('g-tipo').value = 'gasto';
  document.getElementById('g-cat').value  = 'Alimentação';
  setTodayAsDefault();
}

// Remove um gasto
function deleteGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  save();
  render();
}


// =============================================
// ADICIONAR DÍVIDA
// =============================================
function addDivida() {
  const nome  = document.getElementById('d-nome').value.trim();
  const total = parseFloat(document.getElementById('d-total').value);

  if (!nome || isNaN(total) || total <= 0) {
    highlight(['d-nome', 'd-total']);
    return;
  }

  const parcelas = parseInt(document.getElementById('d-parcelas').value) || 1;
  const pagas    = parseInt(document.getElementById('d-pagas').value)    || 0;

  const d = {
    id:       Date.now(),
    nome,
    total,
    parcelas,
    pagas:    Math.min(pagas, parcelas),   // nunca mais que o total
    venc:     parseInt(document.getElementById('d-venc').value) || null,
    obs:      document.getElementById('d-obs').value.trim(),
  };

  dividas.unshift(d);
  save();
  closeModal();
  clearDividaForm();
  render();
}

function clearDividaForm() {
  ['d-nome', 'd-total', 'd-parcelas', 'd-pagas', 'd-venc', 'd-obs']
    .forEach(id => document.getElementById(id).value = '');
}

// Marca mais uma parcela como paga
function pagarParcela(id) {
  const d = dividas.find(x => x.id === id);
  if (d && d.pagas < d.parcelas) {
    d.pagas++;
    save();
    render();
  }
}

// Remove uma dívida
function deleteDivida(id) {
  dividas = dividas.filter(d => d.id !== id);
  save();
  render();
}


// =============================================
// FILTRO DE CATEGORIA (aba Gastos)
// =============================================
function filterCat(cat, el) {
  catFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderGastos();
}


// =============================================
// RENDERIZAÇÃO PRINCIPAL
// =============================================
function render() {
  renderDashboard();
  renderGastos();
  renderDividas();
}

// --- DASHBOARD ---
function renderDashboard() {
  const mes    = gastosDoMes();
  const income = mes.filter(g => g.tipo === 'receita').reduce((s, g) => s + g.valor, 0);
  const expense= mes.filter(g => g.tipo === 'gasto').reduce((s, g) => s + g.valor, 0);
  const balance= income - expense;

  // Total de dívidas em aberto
  const debtTotal = dividas
    .filter(d => d.pagas < d.parcelas)
    .reduce((s, d) => {
      const valorParcela = d.total / d.parcelas;
      return s + valorParcela * (d.parcelas - d.pagas);
    }, 0);

  document.getElementById('card-income').textContent   = fmt(income);
  document.getElementById('card-expense').textContent  = fmt(expense);
  document.getElementById('card-balance').textContent  = fmt(balance);
  document.getElementById('card-debt').textContent     = fmt(debtTotal);

  document.getElementById('card-income-sub').textContent  = `${mes.filter(g => g.tipo === 'receita').length} lançamento(s)`;
  document.getElementById('card-expense-sub').textContent = `${mes.filter(g => g.tipo === 'gasto').length} lançamento(s)`;
  document.getElementById('card-balance-sub').textContent = balance >= 0 ? '✓ Positivo' : '⚠ Negativo';
  document.getElementById('card-debt-sub').textContent    = `${dividas.filter(d => d.pagas < d.parcelas).length} dívida(s) ativa(s)`;

  renderChart(mes);
  renderRecent(mes);
}

// --- GRÁFICO DE BARRAS POR CATEGORIA ---
function renderChart(mes) {
  const canvas = document.getElementById('chart-cat');
  const ctx    = canvas.getContext('2d');

  // Agrupa gastos por categoria
  const cats = {};
  mes.filter(g => g.tipo === 'gasto').forEach(g => {
    cats[g.cat] = (cats[g.cat] || 0) + g.valor;
  });

  const labels = Object.keys(cats);
  const values = Object.values(cats);
  const total  = values.reduce((s, v) => s + v, 0);

  const W = canvas.offsetWidth || 340;
  const H = 220;
  canvas.width  = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // Estado vazio
  if (labels.length === 0) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum gasto no mês', W / 2, H / 2);
    document.getElementById('chart-legend').innerHTML = '';
    return;
  }

  // Desenha barras horizontais
  const barH    = 22;
  const gap     = 10;
  const labelW  = 90;
  const padding = 16;
  const maxBarW = W - labelW - padding * 2 - 50;

  labels.forEach((cat, i) => {
    const y      = padding + i * (barH + gap);
    const barW   = total > 0 ? (values[i] / total) * maxBarW : 0;
    const color  = CAT_COLORS[cat] || '#94a3b8';

    // Label da categoria
    ctx.fillStyle = '#9ca3af';
    ctx.font      = '11px Syne, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(cat, labelW, y + barH / 2 + 4);

    // Barra de fundo
    ctx.fillStyle = '#1c2030';
    roundRect(ctx, labelW + 6, y, maxBarW, barH, 4);
    ctx.fill();

    // Barra de valor
    ctx.fillStyle = color;
    roundRect(ctx, labelW + 6, y, Math.max(barW, 4), barH, 4);
    ctx.fill();

    // Valor em reais
    ctx.fillStyle = '#e8eaf0';
    ctx.font      = '500 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(fmt(values[i]), labelW + 6 + maxBarW + 8, y + barH / 2 + 4);
  });

  // Legenda abaixo
  const legend = document.getElementById('chart-legend');
  legend.innerHTML = labels.map(cat => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${CAT_COLORS[cat] || '#94a3b8'}"></div>
      ${cat}
    </div>`).join('');
}

// Função auxiliar para retângulo arredondado no canvas
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// --- LANÇAMENTOS RECENTES ---
function renderRecent(mes) {
  const el   = document.getElementById('recent-list');
  const list = mes.slice(0, 8); // últimos 8

  if (list.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;text-align:center;padding:20px">Sem lançamentos este mês.</p>';
    return;
  }

  el.innerHTML = list.map(g => `
    <div class="recent-item">
      <div>
        <div class="recent-desc">${escHtml(g.desc)}</div>
        <div class="recent-cat">${g.cat} · ${formatDate(g.data)}</div>
      </div>
      <div class="recent-val ${g.tipo}">
        ${g.tipo === 'gasto' ? '−' : '+'}${fmt(g.valor)}
      </div>
    </div>`).join('');
}

// --- ABA GASTOS ---
function renderGastos() {
  const mes      = gastosDoMes();
  const filtered = catFilter === 'all' ? mes : mes.filter(g =>
    catFilter === 'Receita' ? g.tipo === 'receita' : g.cat === catFilter
  );

  const tbody = document.getElementById('gastos-body');
  const empty = document.getElementById('gastos-empty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = filtered.map(g => `
    <tr>
      <td>${formatDate(g.data)}</td>
      <td>
        <div style="font-weight:600">${escHtml(g.desc)}</div>
        ${g.obs ? `<div style="font-size:0.75rem;color:var(--muted)">${escHtml(g.obs)}</div>` : ''}
      </td>
      <td><span class="cat-badge">${g.cat}</span></td>
      <td class="val-${g.tipo}">${g.tipo === 'gasto' ? '−' : '+'}${fmt(g.valor)}</td>
      <td><button class="btn-del" onclick="deleteGasto(${g.id})">✕</button></td>
    </tr>`).join('');
}

// --- ABA DÍVIDAS ---
function renderDividas() {
  const el    = document.getElementById('dividas-list');
  const empty = document.getElementById('dividas-empty');

  if (dividas.length === 0) {
    el.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  el.innerHTML = dividas.map(d => {
    const pct         = Math.round((d.pagas / d.parcelas) * 100);
    const valorParc   = d.total / d.parcelas;
    const restante    = valorParc * (d.parcelas - d.pagas);
    const quitado     = d.pagas >= d.parcelas;

    return `
      <div class="divida-card" style="${quitado ? 'opacity:0.5' : ''}">
        <div class="divida-header">
          <div>
            <div class="divida-nome">${escHtml(d.nome)}</div>
            <div class="divida-venc">${d.venc ? `Vence dia ${d.venc}` : ''}${d.obs ? ` · ${escHtml(d.obs)}` : ''}</div>
          </div>
          <button class="btn-del" onclick="deleteDivida(${d.id})">✕</button>
        </div>

        <div class="divida-total">${fmt(d.total)}</div>

        <div class="progress-label">
          <span>${d.pagas} de ${d.parcelas} parcelas pagas</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="divida-footer">
          <div class="divida-restante">
            Restam <strong>${fmt(restante)}</strong>
            (${d.parcelas - d.pagas}x de ${fmt(valorParc)})
          </div>
          <div class="divida-actions">
            <button class="btn-pagar" onclick="pagarParcela(${d.id})" ${quitado ? 'disabled' : ''}>
              ${quitado ? '✓ Quitado' : '+ Pagar parcela'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}


// =============================================
// HELPERS
// =============================================

// Formata valor como moeda brasileira
function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata data "YYYY-MM-DD" → "DD/MM/YYYY"
function formatDate(s) {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

// Escapa HTML para evitar XSS
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Destaca campos inválidos em vermelho
function highlight(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim() || el.value <= 0) {
      el.style.borderColor = '#f87171';
      el.focus();
      setTimeout(() => el.style.borderColor = '', 1500);
    }
  });
}

// Re-renderiza o gráfico quando a janela é redimensionada
window.addEventListener('resize', () => renderChart(gastosDoMes()));