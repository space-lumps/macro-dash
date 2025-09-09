// helper functon
//async function loadJSON(p){ const r = await fetch(p, {cache:'no-cache'}); return r.json(); }

// Neutral dark theme for axes/grids
Chart.defaults.color = '#d0d0d0';          // axis/label text
Chart.defaults.borderColor = '#2a2a2a';    // grid/borders
Chart.defaults.font.family = 'system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif';

// Vibrant palette for charts
const PALETTE = ['#60a5fa','#a78bfa','#34d399','#f59e0b','#f472b6','#22d3ee']; // blue, violet, green, amber, pink, cyan

// Map each chart to its source label + link
const SOURCES = {
  m2:       { label: 'Source: FRED (M2SL)', url: 'https://fred.stlouisfed.org/series/M2SL' },
  usd:      { label: 'Source: FRED (DTWEXBGS)', url: 'https://fred.stlouisfed.org/series/DTWEXBGS' },
  yields:   { label: 'Source: FRED (DGS2, DGS10)', url: 'https://fred.stlouisfed.org' },
  spread:   { label: 'Source: FRED (T10Y2Y)', url: 'https://fred.stlouisfed.org/series/T10Y2Y' },
  vix:      { label: 'Source: FRED — VIXCLS', url: 'https://fred.stlouisfed.org/series/VIXCLS' },
  cpi:      { label: 'Source: FRED — CPIAUCSL', url: 'https://fred.stlouisfed.org/series/CPIAUCSL' },
  fedfunds: { label: 'Source: FRED — FEDFUNDS', url: 'https://fred.stlouisfed.org/series/FEDFUNDS' },

  // defi sources:
  // stablecoins: { label: 'Source: DefiLlama (Stablecoins)', url: 'https://defillama.com/stablecoins' },
  // dex30d:     { label: 'Source: DefiLlama (DEX Volume)', url: 'https://defillama.com/dexs' },
  // funding:    { label: 'Source: CoinGlass (Funding)', url: 'https://coinglass.com' },
  // oi:         { label: 'Source: CoinGlass (Open Interest)', url: 'https://coinglass.com' },
};

// Helper to set source + last-updated from a JSON payload
function setMeta(idBase, jsonOrIso){
  const src = SOURCES[idBase];
  const s = document.getElementById(`src-${idBase}`);
  const u = document.getElementById(`upd-${idBase}`);
  if (s && src) s.innerHTML = `<a href="${src.url}" target="_blank" rel="noopener">${src.label}</a>`;
  // Try _meta.generated_utc; fallback to updated_at if present
  const ts = typeof jsonOrIso === 'string'
    ? jsonOrIso
    : (jsonOrIso?._meta?.generated_utc || jsonOrIso?.updated_at);
  if (u && ts) u.textContent = `Updated: ${ts}`;
}

// Helper: make a line dataset that pops
function lineDS(label, data, color){
  return {
    label, data,
    borderColor: color,
    backgroundColor: color,
    pointRadius: 2,
    pointHoverRadius: 4,
    tension: 0.25,    // slight smoothing
    fill: false
  };
}

// M2
(async () => {
  const m2 = await (await fetch('data/m2.json',{cache:'no-cache'})).json();
  setMeta('m2', m2);
  const labels = m2.points.map(p=>p.date);
  const values = m2.points.map(p=>p.value);
  new Chart(document.getElementById('m2'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('M2 (FRED:M2SL)', values, PALETTE[0]) ] },
    options: { responsive: true, plugins:{legend:{display:true}} }
  });
})();

// USD Index (DTWEXBGS)
(async () => {
  const usd = await (await fetch('data/usd_index.json',{cache:'no-cache'})).json();
  setMeta('usd', usd);
  const labels = usd.points.map(p=>p.date);
  const values = usd.points.map(p=>p.value);
  new Chart(document.getElementById('usd'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('USD Broad Index (FRED:DTWEXBGS)', values, PALETTE[2]) ] },
    options: { responsive: true }
  });
})();

// Yields: 2Y vs 10Y
(async () => {
  const y2  = await (await fetch('data/yield_2y.json',{cache:'no-cache'})).json();
  const y10 = await (await fetch('data/yield_10y.json',{cache:'no-cache'})).json();
  // choose newest updated time across both
  const upd = [y2?._meta?.generated_utc || y2?.updated_at, y10?._meta?.generated_utc || y10?.updated_at]
  .filter(Boolean).sort().slice(-1)[0];
  setMeta('yields', upd);
  const labels = y10.points.map(p=>p.date);
  const twoY   = y2.points.map(p=>p.value);
  const tenY   = y10.points.map(p=>p.value);
  new Chart(document.getElementById('yields'), {
    type: 'line',
    data: { labels, datasets: [
      lineDS('2Y (DGS2)', twoY,  PALETTE[5]),   // cyan
      lineDS('10Y (DGS10)', tenY, PALETTE[1])   // violet
    ]},
    options: { responsive: true }
  });
})();

// 10s–2s spread
(async () => {
  const sp = await (await fetch('data/spread_10y_2y.json',{cache:'no-cache'})).json();
  setMeta('spread', sp);
  const labels = sp.points.map(p=>p.date);
  const vals   = sp.points.map(p=>p.value);
  new Chart(document.getElementById('spread'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('10Y–2Y (T10Y2Y)', vals, PALETTE[4]) ] }, // pink
    options: { responsive: true }
  });
})();

// vix
(async () => {
  const vix = await (await fetch('data/vix.json', {cache:'no-cache'})).json();
  setMeta('vix', vix);
  const labels = vix.points.map(p=>p.date);
  const vals   = vix.points.map(p=>p.value);
  new Chart(document.getElementById('vix'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('VIX (FRED:VIXCLS)', vals, '#a78bfa') ] } // violet
  });
})();

// CPI
(async () => {
  const data = await loadJSON('data/cpi.json');
  if (!data) return;
  setMeta('cpi', data);
  const labels = data.points.map(p=>p.date);
  const vals   = data.points.map(p=>p.value);
  new Chart(document.getElementById('cpi'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('CPI (CPIAUCSL)', vals, '#f87171') ] } // red
  });
})();

// Fed Funds
(async () => {
  const data = await loadJSON('data/fedfunds.json');
  if (!data) return;
  setMeta('fedfunds', data);
  const labels = data.points.map(p=>p.date);
  const vals   = data.points.map(p=>p.value);
  new Chart(document.getElementById('fedfunds'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('Fed Funds Rate (FEDFUNDS)', vals, '#facc15') ] } // yellow
  });
})();