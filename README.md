# FloodGuard AI 

**Predict → Explain → Map → Prioritize → Act**

An AI-powered geospatial early-warning and decision-support platform for flash floods
and correlated landslides in hilly/mountainous regions, built on multi-source
environmental data.

> **⚠ PROTOTYPE DISCLAIMER**  
> This platform is a prototype decision-support system built for a hackathon/SIH submission.  
> Predictions are experimental and must **not** be presented as official government warnings,
> forecasts, or evacuation orders. All data not sourced from a live, cited feed is clearly
> labeled **DEMO / SIMULATED**.

---

## Quick Start

### Option A — Frontend only (Phase 1, no Docker required)

```bash
# 1. Clone
git clone https://github.com/your-org/floodguard-ai.git
cd floodguard-ai

# Frontend commands run from the frontend category
cd frontend

# 2. Install dependencies
pnpm install          # or: npm install

# 3. Run dev server
pnpm dev              # http://localhost:5173

# 4. Build for production
pnpm build && pnpm preview
```

### Option B — Full stack with Docker Compose (Phase 2)

```bash
# 1. Copy and fill environment variables
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD and JWT_SECRET at minimum

# 2. One-command bring-up
docker compose up --build

# Services:
#   Frontend  → http://localhost:4173
#   API       → http://localhost:8000
#   API docs  → http://localhost:8000/docs
#   Postgres  → localhost:5432
```

### Option C — Backend only (Phase 2)

```bash
cd backend

# Create virtual environment
python -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (or export manually)
export DATABASE_URL=postgresql://floodguard:floodguard_dev@localhost:5432/floodguard
export JWT_SECRET=your_secret_here

# Run
uvicorn main:app --reload --port 8000
# Interactive API docs → http://localhost:8000/docs
```

---

## Environment Variables

See `.env.example` for the full reference. Key variables:

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_PASSWORD` | Phase 2+ | Database password |
| `JWT_SECRET` | Phase 2+ | Token signing key (`openssl rand -hex 32`) |
| `VITE_API_BASE_URL` | Phase 2+ | Backend URL for frontend fetch calls |
| `VITE_WS_URL` | Phase 2+ | WebSocket URL for live-updates channel |
| `VITE_MAPBOX_TOKEN` | Optional | Mapbox token; falls back to OpenStreetMap/Leaflet if unset |

---

## Project Structure

```
floodguard-ai/
├── frontend/                   # React + TypeScript frontend
│   ├── src/                    # Application source
│   ├── public/                 # Static assets and service worker
│   ├── package.json
│   └── Dockerfile.frontend
├── backend/
│   ├── main.py                 # FastAPI app (Phase 2 skeleton)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── sql/seed.sql            # Postgres + PostGIS schema + seed data
├── docker-compose.yml          # One-command full-stack run
├── vercel.json                 # Frontend/backend deployment routing
├── .env.example                # Environment variable template
└── README.md
```

### Pages (16 total)

| # | Route | Page |
|---|---|---|
| 1 | `/` | Dashboard |
| 2 | `/live-monitoring` | Live Monitoring |
| 3 | `/risk-map` | Risk Map (Leaflet + OpenStreetMap) |
| 4 | `/ai-prediction` | AI Prediction Engine |
| 5 | `/explainable-ai` | Explainable AI |
| 6 | `/vulnerable-areas` | Vulnerable Areas |
| 7 | `/alerts` | Alerts & Warnings |
| 8 | `/safe-routes` | Safe Routes |
| 9 | `/flood-simulator` | Flood Simulator |
| 10 | `/satellite` | Satellite Monitoring |
| 11 | `/historical` | Historical Analysis |
| 12 | `/reports` | Reports (PDF generator) |
| 13 | `/data-sources` | Data Sources |
| 14 | `/field-reports` | Field Reports |
| 15 | `/settings` | Settings |
| 16 | `/help` | Help & Support |

---

## Demo Flow — Heavy Rainfall Flash Flood Scenario

1. **Open Dashboard** — note risk gauges at MODERATE (default mode)
2. **Activate Heavy Rain Event** — click the `DEMO MODE` button in the top bar; it turns red
3. **Dashboard escalates** — flood probability jumps to 93%, river level crosses warning threshold
4. **Go to Risk Map** — Kedarnath and Joshimath markers turn red/purple (EXTREME)
5. **Run AI Prediction** — select Kedarnath, +6h horizon, click Run → EXTREME output with 87% confidence
6. **Explainable AI** — inspect the illustrative feature-contribution bars; rainfall dominates
7. **Alerts & Warnings** — 2 RED alerts active; simulate sending WhatsApp broadcast to district group
8. **Field Reports** — submit a new CRITICAL report: "Rising water at NH-7 near Joshimath Chowk"
9. **Generate Report** — go to Reports, click Generate → download the dark-themed PDF
10. **Safe Routes** — Joshimath Relief Camp at 37% capacity; route 1 is safest option

---

## Phase Roadmap

### Phase 1 — Frontend shell + mock data ✅ (current)
- React 19 + Vite 8 + Tailwind CSS v4 + Recharts + Leaflet
- Full 16-page navigable UI with comprehensive mock-data simulation engine
- Demo Mode with Heavy Rainfall Event scenario
- PDF report generation (jsPDF)
- No backend required — fully standalone

### Phase 2 — Backend skeleton (next)
- FastAPI + Pydantic + JWT auth (ADMIN / AUTHORITY / ANALYST / VIEWER roles)
- WebSocket `/ws/live-updates` for real-time station readings and alert pushes
- REST API endpoints returning same data shapes as Phase 1 mock engine
- PostgreSQL + PostGIS schema (seed.sql included)
- Docker Compose: `docker compose up --build`
- Swap frontend `mockData.ts` imports to `fetch()` calls — non-event

### Phase 3 — Real data & ML (post-hackathon roadmap)
- **Data ingestion:** IMD gridded rainfall (GRIB), CWC gauge readings, ISRO Bhuvan satellite
- **ML pipeline:** XGBoost trained on IMD historical flood records (2000–2025); Scikit-learn preprocessing
- **Explainability:** Real SHAP TreeExplainer replacing illustrative estimates
- **Geospatial:** GeoPandas watershed delineation, Rasterio DEM processing, PostGIS flood-zone polygons
- **Operational:** Rate limiting on prediction/simulation endpoints, Redis cache, Celery task queue
- **Offline PWA:** Service worker caching last-known risk map + offline alert queue sync

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet (OpenStreetMap; Mapbox token optional) |
| Icons | Lucide React |
| PDF | jsPDF |
| Backend | Python 3.12, FastAPI, Pydantic v2, Uvicorn |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Database | PostgreSQL 16 + PostGIS 3.4 |
| Realtime | WebSocket (FastAPI + asyncio) |
| ML (Phase 3) | XGBoost, Scikit-learn, SHAP, Pandas, NumPy |
| Geospatial (Phase 3) | GeoPandas, Rasterio, Shapely |
| DevOps | Docker Compose, multi-stage Docker builds |

---

## Design System

Dark navy command center aesthetic — see `frontend/guidelines/Guidelines.md` for full tokens,
typography, and component patterns.

**Risk color scale** (always color + text label — never color alone):

| Level | Color | Hex |
|---|---|---|
| LOW | Green | `#22c55e` |
| MODERATE | Yellow | `#eab308` |
| HIGH | Orange | `#f97316` |
| VERY HIGH | Red | `#ef4444` |
| EXTREME | Purple | `#a855f7` |

---

## Responsible AI

This system produces **illustrative prototype predictions**, not certified forecasts.
The Explainable AI feature-contribution chart is labeled "Illustrative Feature Contribution"
throughout the UI and must not be presented as real SHAP values until Phase 3.

Every alert notification carries: *"Prototype notification — not an official emergency warning."*

Full disclaimer (required in: Dashboard, Settings, every generated Report, Help page):

> *"This platform is a prototype decision-support system. Predictions are experimental
> and should not replace official government forecasts, warnings, evacuation orders,
> or emergency instructions."*

---

## License

MIT — see `LICENSE`. Built for SIH 2026 / Hackathon evaluation.
Not intended for operational emergency-management use without further validation.
