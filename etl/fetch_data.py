import os, json, time, requests
from pathlib import Path

# Where JSON outputs are written (served by GitHub Pages)
DATA = Path("data"); DATA.mkdir(exist_ok=True)

# Get your FRED key from env (set in GitHub Secrets or locally via export)
FRED_KEY = os.environ["FRED_API_KEY"]

def write_json(name, obj):
    obj["_meta"] = {"generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    (DATA / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2))

def fred_series(series_id):
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {"series_id": series_id, "api_key": FRED_KEY, "file_type": "json"}
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    obs = r.json().get("observations", [])
    points = [{"date": o["date"], "value": (None if o["value"] == "." else float(o["value"]))} for o in obs]
    return {"series_id": series_id, "points": points, "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}

if __name__ == "__main__":
    # M2 money stock
    write_json("m2.json", fred_series("M2SL"))
    # Broad Dollar Index (good proxy for USD strength / DXY-like)
    write_json("usd_index.json", fred_series("DTWEXBGS"))
    print("OK")
    # Treasuries
    write_json("yield_2y.json",   fred_series("DGS2"))
    write_json("yield_10y.json",  fred_series("DGS10"))
    write_json("spread_10y_2y.json", fred_series("T10Y2Y"))
    # Risk sentiment / Volatility
    write_json("vix.json", fred_series("VIXCLS"))
     # CPI (Consumer Price Index for All Urban Consumers, seasonally adjusted)
    write_json("cpi.json", fred_series("CPIAUCSL"))
    # Federal Funds Effective Rate
    write_json("fedfunds.json", fred_series("FEDFUNDS"))