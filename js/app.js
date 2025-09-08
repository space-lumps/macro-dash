// Temporary placeholder chart (will swap to real data soon)
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

