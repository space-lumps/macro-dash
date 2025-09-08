// Neutral dark theme for axes/grids
Chart.defaults.color = '#d0d0d0';          // axis/label text
Chart.defaults.borderColor = '#2a2a2a';    // grid/borders
Chart.defaults.font.family = 'system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif';

// Vibrant palette for charts
const PALETTE = ['#60a5fa','#a78bfa','#34d399','#f59e0b','#f472b6','#22d3ee']; // blue, violet, green, amber, pink, cyan

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
  const labels = usd.points.map(p=>p.date);
  const values = usd.points.map(p=>p.value);
  new Chart(document.getElementById('usd'), {
    type: 'line',
    data: { labels, datasets: [ lineDS('USD Broad Index (FRED:DTWEXBGS)', values, PALETTE[3]) ] },
    options: { responsive: true }
  });
})();






// Temporary placeholder chart
const ctx = document.getElementById('example');
if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['t-4','t-3','t-2','t-1','t'],
      datasets: [{ label: 'Placeholder', data: [1,2,3,2,4] }]
    }
  });
}

async function loadJSON(p){ const r = await fetch(p, {cache:'no-cache'}); return r.json(); }

(async () => {
  // M2
  try {
    const m2 = await loadJSON('data/m2.json');
    const labels = m2.points.map(p => p.date);
    const data = m2.points.map(p => p.value);
    new Chart(document.getElementById('m2'), {
      type: 'line',
      data: { labels, datasets: [{ label: 'M2 (FRED:M2SL)', data }] },
      options: { responsive: true }
    });
  } catch(e) { console.error('Failed to load M2:', e); }
})();

