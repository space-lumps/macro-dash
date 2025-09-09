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

// M2 (M2SL)
(async () => {
  try {
    const r = await fetch('data/m2.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`m2.json ${r.status}`);
    const data = await r.json();
    setMeta('m2', data);
    const labels = data.points.map(p => p.date);
    const vals   = data.points.map(p => p.value);
    new Chart(document.getElementById('m2'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('M2 (FRED:M2SL)', vals, '#60a5fa') ] },
      options: { responsive: true }
    });
  } catch (e) { console.error('Failed to load M2:', e); }
})();

// USD Broad Index (DTWEXBGS)
(async () => {
  try {
    const r = await fetch('data/usd_index.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`usd_index.json ${r.status}`);
    const data = await r.json();
    setMeta('usd', data);
    const labels = data.points.map(p => p.date);
    const vals   = data.points.map(p => p.value);
    new Chart(document.getElementById('usd'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('USD Broad Index (DTWEXBGS)', vals, '#34d399') ] },
      options: { responsive: true }
    });
  } catch (e) { console.error('Failed to load USD index:', e); }
})();

// UST 2Y (DGS2) vs 10Y (DGS10)
(async () => {
  try {
    const r2  = await fetch('data/yield_2y.json',  { cache: 'no-cache' });
    const r10 = await fetch('data/yield_10y.json', { cache: 'no-cache' });
    if (!r2.ok)  throw new Error(`yield_2y.json ${r2.status}`);
    if (!r10.ok) throw new Error(`yield_10y.json ${r10.status}`);
    const y2  = await r2.json();
    const y10 = await r10.json();
    const upd = [y2?._meta?.generated_utc||y2?.updated_at, y10?._meta?.generated_utc||y10?.updated_at]
      .filter(Boolean).sort().slice(-1)[0];
    setMeta('yields', upd);
    const labels = y10.points.map(p=>p.date);
    new Chart(document.getElementById('yields'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          lineDS('2Y (DGS2)',  y2.points.map(p=>p.value),  '#22d3ee'),
          lineDS('10Y (DGS10)',y10.points.map(p=>p.value), '#a78bfa')
        ]
      },
      options: { responsive: true }
    });
  } catch (e) { console.error('Failed to load 2Y/10Y:', e); }
})();

// 10Y–2Y Spread (T10Y2Y)
(async () => {
  try {
    const r = await fetch('data/spread_10y_2y.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`spread_10y_2y.json ${r.status}`);
    const data = await r.json();
    setMeta('spread', data);
    const labels = data.points.map(p=>p.date);
    const vals   = data.points.map(p=>p.value);
    new Chart(document.getElementById('spread'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('10Y–2Y (T10Y2Y)', vals, '#f472b6') ] },
      options: { responsive: true }
    });
  } catch (e) { console.error('Failed to load spread:', e); }
})();

// VIX (VIXCLS)
(async () => {
  try {
    const r = await fetch('data/vix.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`vix.json ${r.status}`);
    const data = await r.json();
    setMeta('vix', data);
    const labels = data.points.map(p=>p.date);
    const vals   = data.points.map(p=>p.value);
    new Chart(document.getElementById('vix'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('VIX (VIXCLS)', vals, '#a78bfa') ] },
      options: { responsive: true }
    });
  } catch (e) { console.error('Failed to load VIX:', e); }
})();

// CPI (CPIAUCSL)
(async () => {
  try {
    const r = await fetch('data/cpi.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`cpi.json ${r.status}`);
    const data = await r.json();
    setMeta('cpi', data);  // uses SOURCES.cpi
    const labels = data.points.map(p => p.date);
    const vals   = data.points.map(p => p.value);
    new Chart(document.getElementById('cpi'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('CPI (CPIAUCSL)', vals, '#f87171') ] }, // red
      options: { responsive: true }
    });
  } catch (e) {
    console.error('Failed to load CPI:', e);
  }
})();

// Fed Funds (FEDFUNDS)
(async () => {
  try {
    const r = await fetch('data/fedfunds.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`fedfunds.json ${r.status}`);
    const data = await r.json();
    setMeta('fedfunds', data);  // uses SOURCES.fedfunds
    const labels = data.points.map(p => p.date);
    const vals   = data.points.map(p => p.value);
    new Chart(document.getElementById('fedfunds'), {
      type: 'line',
      data: { labels, datasets: [ lineDS('Fed Funds Rate (FEDFUNDS)', vals, '#facc15') ] }, // yellow
      options: { responsive: true }
    });
  } catch (e) {
    console.error('Failed to load Fed Funds:', e);
  }
})();