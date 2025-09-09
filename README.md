# Macroeconomic Indicators Dashboard

📊 A static dashboard that tracks key macroeconomic indicators relevant to crypto markets.  
Data updates daily via [GitHub Actions](.github/workflows/update-data.yml) and is visualized with [Chart.js](https://www.chartjs.org/).

🌐 **Live site:** [https://space-lumps.github.io/macro-dash/](https://space-lumps.github.io/macro-dash/)

---

## Features

- **Automated data fetches** from [FRED](https://fred.stlouisfed.org/).
- **Daily updates** committed by GitHub Actions.
- **Visualizations** built with Chart.js on a static GitHub Pages site.
- **Per-chart captions** explaining macro relevance to crypto.
- Clean **dark theme**, mobile-friendly layout.

---

## Charts Included

- **M2 Money Stock (M2SL)**  
  Rising/falling liquidity as a tailwind/headwind for BTC.

- **USD Broad Index (DTWEXBGS)**  
  Inverse relationship: weaker USD → stronger BTC.

- **2-Year and 10-Year Treasury Yields (DGS2, DGS10)**  
  Proxy for Fed policy and growth/inflation outlook.

- **10Y–2Y Spread (T10Y2Y)**  
  Curve inversion as a recession/slowdown signal.

- **VIX (VIXCLS)**  
  Equity volatility → stress indicator for risk assets.

---

## Future Integration

This macro dashboard is the first component of a larger analytics project.

- **On-chain Dashboard (Dune):** DeFi indicators such as stablecoin supply, DEX volume, and funding/open interest will be queried and visualized in Dune.  
- **Combined Streamlit App:** The macro indicators from this repo will be integrated with DeFi/on-chain data into a single interactive Streamlit application.  
- **Goal:** Provide a holistic view of how macroeconomic conditions (liquidity, rates, USD strength, volatility) interact with crypto-native flows (stablecoins, exchanges, L2 activity) to shape market behavior.

**Flow:** FRED → GitHub Actions → JSON → GitHub Pages (Macro) + Dune (DeFi) → Streamlit (combined app)

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, [Chart.js](https://www.chartjs.org/)  
- **Automation:** [GitHub Actions](https://docs.github.com/en/actions)  
- **Data Sources:** [FRED](https://fred.stlouisfed.org/) (St. Louis Fed)  

---

## Local Development

Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/space-lumps/macro-dash.git
cd macro-dash
open index.html   # or double-click in Finder/Explorer