// utils/chartConfig.js
export const chartOptions = (min, max) => ({
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  scales: {
    x: { display: false },
    y: { min, max, display: false },
  },
})

export const lineStyles = {
  default: { borderWidth: 2, tension: 0.4, borderDash: [] },
  dashed: { borderWidth: 2, tension: 0.2, borderDash: [5, 5] },
  wave: {
    borderWidth: 2,
    tension: 0.4,
    radius: 0,
    hitRadius: 10,
    hoverRadius: 4,
  },
}
