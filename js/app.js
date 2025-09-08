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
