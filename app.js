const STORAGE_KEY = 'cargill-multiseed-fmeca';
const form = document.querySelector('#fmecaForm');
const rows = document.querySelector('#fmecaRows');
const template = document.querySelector('#rowTemplate');
const highestRpn = document.querySelector('#highestRpn');
const highestAsset = document.querySelector('#highestAsset');
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const fields = ['asset', 'function', 'failureMode', 'effect', 'severity', 'occurrence', 'detection', 'action'];
const examples = [
  {
    asset: 'Zaadtransportband naar voorbereiding',
    function: 'Continu en hygiënisch transport van multiseed grondstof',
    failureMode: 'Bandslip door vervuilde trommel',
    effect: 'Capaciteitsverlies, morsing en verhoogd reinigingswerk',
    severity: 6,
    occurrence: 6,
    detection: 4,
    action: 'Plan wekelijkse visuele inspectie en trend motorstroom in dashboard.',
  },
  {
    asset: 'Conditioner / toaster',
    function: 'Zaad conditioneren binnen procesvenster',
    failureMode: 'Temperatuursensor drift',
    effect: 'Afwijkende productkwaliteit en mogelijk energieverlies',
    severity: 8,
    occurrence: 4,
    detection: 6,
    action: 'Kalibratiefrequentie verhogen en alarmgrenzen valideren met productie.',
  },
  {
    asset: 'Perslijn lagering',
    function: 'Mechanische energie betrouwbaar overbrengen',
    failureMode: 'Lagervet degradatie door hoge belasting',
    effect: 'Ongeplande stop, gevolgschade aan as en veiligheidsrisico bij heet oppervlak',
    severity: 9,
    occurrence: 5,
    detection: 5,
    action: 'Voeg trillingsmeting en vetanalyse toe aan preventief onderhoudsplan.',
  },
];

function fillScoreOptions() {
  ['severity', 'occurrence', 'detection'].forEach((id) => {
    const select = document.querySelector(`#${id}`);
    select.innerHTML = Array.from({ length: 10 }, (_, index) => {
      const value = index + 1;
      return `<option value="${value}">${value}</option>`;
    }).join('');
  });
}

function getCriticality(rpn) {
  if (rpn >= 200) return { label: 'Hoog', className: 'badge-hoog' };
  if (rpn >= 80) return { label: 'Middel', className: 'badge-middel' };
  return { label: 'Laag', className: 'badge-laag' };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render() {
  rows.innerHTML = '';
  const sorted = [...entries].sort((a, b) => b.rpn - a.rpn);
  sorted.forEach((entry) => {
    const row = template.content.firstElementChild.cloneNode(true);
    Object.entries(entry).forEach(([key, value]) => {
      const cell = row.querySelector(`[data-field="${key}"]`);
      if (cell) cell.textContent = value;
    });
    const criticality = getCriticality(entry.rpn);
    const badge = row.querySelector('[data-field="criticality"]');
    badge.textContent = criticality.label;
    badge.className = `badge ${criticality.className}`;
    row.querySelector('[data-action="delete"]').addEventListener('click', () => {
      entries = entries.filter((item) => item.id !== entry.id);
      save();
      render();
    });
    rows.appendChild(row);
  });

  const top = sorted[0];
  highestRpn.textContent = top ? top.rpn : 0;
  highestAsset.textContent = top ? `${top.asset} — ${top.failureMode}` : 'Nog geen faalwijzen ingevoerd';
}

function readForm() {
  const entry = Object.fromEntries(fields.map((field) => [field, document.querySelector(`#${field}`).value.trim()]));
  entry.severity = Number(entry.severity);
  entry.occurrence = Number(entry.occurrence);
  entry.detection = Number(entry.detection);
  entry.rpn = entry.severity * entry.occurrence * entry.detection;
  entry.id = crypto.randomUUID();
  return entry;
}

function toCsv() {
  const headers = ['Asset', 'Functie', 'Faalwijze', 'Effect', 'Ernst', 'Voorkomen', 'Detectie', 'RPN', 'Klasse', 'Actie'];
  const body = entries.map((entry) => [
    entry.asset,
    entry.function,
    entry.failureMode,
    entry.effect,
    entry.severity,
    entry.occurrence,
    entry.detection,
    entry.rpn,
    getCriticality(entry.rpn).label,
    entry.action,
  ]);
  return [headers, ...body].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  entries.push(readForm());
  save();
  render();
  form.reset();
});

document.querySelector('#loadExample').addEventListener('click', () => {
  entries = examples.map((entry) => ({ ...entry, id: crypto.randomUUID(), rpn: entry.severity * entry.occurrence * entry.detection }));
  save();
  render();
});

document.querySelector('#clearAll').addEventListener('click', () => {
  if (confirm('Weet je zeker dat je alle FMECA-regels wilt wissen?')) {
    entries = [];
    save();
    render();
  }
});

document.querySelector('#exportCsv').addEventListener('click', () => {
  const blob = new Blob([toCsv()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cargill-multiseed-fmeca.csv';
  link.click();
  URL.revokeObjectURL(url);
});

fillScoreOptions();
render();
