"""
FloodGuard AI — FastAPI Backend (Phase 2 Skeleton)
===================================================
All endpoints return the same data-shape as the Phase 1 frontend mock-data engine,
so swapping frontend fetch calls to hit these routes is a non-event.

Phase 2: FastAPI + mock/seeded data + JWT auth + WebSocket
Phase 3 (TODO): Replace mock generators with real IMD/CWC/ISRO feeds,
                train XGBoost on historical records, wire real SHAP.

⚠ PROTOTYPE — not for production use.
"""

import asyncio
import json
import os
import random
import time
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field

# ── Config ────────────────────────────────────────────────────────────────────
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_in_production")
JWT_ALGORITHM = "HS256"
ACCESS_EXPIRE = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=False)

# ── In-memory state (Phase 2 only — Phase 3 uses Postgres/PostGIS) ────────────
_fake_users = {
    "admin@floodguard.ai": {
        "email": "admin@floodguard.ai",
        "hashed_password": pwd_ctx.hash("admin123"),  # dev only
        "role": "ADMIN",
        "name": "Admin User",
    },
    "rajesh.kumar@uttarakhand.gov.in": {
        "email": "rajesh.kumar@uttarakhand.gov.in",
        "hashed_password": pwd_ctx.hash("authority123"),
        "role": "AUTHORITY",
        "name": "Rajesh Kumar",
    },
}

_field_reports: list[dict] = []
_notification_log: list[dict] = []

# Simulated WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, data: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

# ── App lifecycle ─────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_push_live_updates())
    yield
    task.cancel()

async def _push_live_updates():
    """Simulates periodic WebSocket pushes of station readings and risk deltas."""
    while True:
        await asyncio.sleep(5)
        payload = {
            "type": "STATION_READING",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": {
                "S001": {"value": round(random.uniform(44, 68), 1), "unit": "mm/hr"},
                "S002": {"value": round(random.uniform(4.6, 5.4), 2), "unit": "m"},
                "S003": {"value": round(random.uniform(58, 70), 1), "unit": "mm/hr"},
            },
        }
        await manager.broadcast(payload)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="FloodGuard AI API",
    description="Phase 2 backend — mock-data-backed. See /docs for interactive API explorer.",
    version="2.4.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth helpers ──────────────────────────────────────────────────────────────
ROLE_HIERARCHY = {"VIEWER": 0, "ANALYST": 1, "AUTHORITY": 2, "ADMIN": 3}

def create_access_token(email: str, role: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXPIRE)
    return jwt.encode({"sub": email, "role": role, "exp": exp}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role", "VIEWER")
        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def require_role(min_role: str):
    def dep(user=Depends(get_current_user)):
        if ROLE_HIERARCHY.get(user["role"], 0) < ROLE_HIERARCHY.get(min_role, 99):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Requires {min_role} role")
        return user
    return dep

# ── Pydantic schemas ──────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str

class FieldReportIn(BaseModel):
    reporter_name: str
    reporter_role: str = ""
    location: str
    lat: float
    lng: float
    description: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class FieldReportStatus(BaseModel):
    status: Literal["UNVERIFIED", "CONFIRMED", "RESOLVED"]

# ── Auth routes ───────────────────────────────────────────────────────────────
@app.post("/api/auth/login", response_model=TokenResponse, tags=["auth"])
def login(req: LoginRequest):
    user = _fake_users.get(req.email)
    if not user or not pwd_ctx.verify(req.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(req.email, user["role"])
    # NOTE: In production, issue refresh token as httpOnly cookie (not localStorage)
    return TokenResponse(access_token=token, role=user["role"], name=user["name"])

@app.post("/api/auth/refresh", tags=["auth"])
def refresh_token(user=Depends(get_current_user)):
    token = create_access_token(user["email"], user["role"])
    return {"access_token": token, "token_type": "bearer"}

# ── Health / degraded-mode ────────────────────────────────────────────────────
@app.get("/api/health", tags=["system"])
def health():
    sources = [
        {"id": "DS001", "name": "IMD Rainfall API", "status": "ACTIVE"},
        {"id": "DS002", "name": "CWC River Level Network", "status": "ACTIVE"},
        {"id": "DS007", "name": "Bhukosh Geological Survey", "status": "ACTIVE"},
        {"id": "DS006", "name": "AWS Network (Local)", "status": "WARNING"},
        {"id": "DS008", "name": "Soil Moisture Sensors (IoT)", "status": "OFFLINE"},
    ]
    degraded = any(s["status"] in ("WARNING", "OFFLINE") for s in sources)
    return {"status": "DEGRADED" if degraded else "OK", "sources": sources, "timestamp": datetime.now(timezone.utc).isoformat()}

# ── Dashboard / overview ──────────────────────────────────────────────────────
@app.get("/api/dashboard", tags=["dashboard"])
def dashboard():
    """Returns headline metrics for the Dashboard page."""
    return {
        "current_rainfall_mm_hr": round(random.uniform(45, 68), 1),
        "river_level_m": round(random.uniform(4.9, 5.6), 2),
        "active_alerts": 5,
        "red_alerts": 2,
        "at_risk_population": 32580,
        "soil_moisture_pct": round(random.uniform(74, 88), 1),
        "flood_probability": round(random.uniform(0.82, 0.96), 3),
        "risk_level": "EXTREME",
        "note": "DEMO / SIMULATED",
    }

# ── Stations / live monitoring ────────────────────────────────────────────────
@app.get("/api/stations", tags=["monitoring"])
def get_stations():
    return {
        "stations": [
            {"id": "S001", "name": "Joshimath AWS", "type": "RAINFALL", "lat": 30.56, "lng": 79.57, "status": "ONLINE", "reading": round(random.uniform(44, 68), 1), "unit": "mm/hr", "threshold": 50},
            {"id": "S002", "name": "Alaknanda @ Chamoli", "type": "RIVER", "lat": 30.41, "lng": 79.32, "status": "WARNING", "reading": round(random.uniform(4.6, 5.2), 2), "unit": "m", "threshold": 5.0},
            {"id": "S003", "name": "Kedarnath AWS", "type": "RAINFALL", "lat": 30.73, "lng": 79.07, "status": "ONLINE", "reading": round(random.uniform(58, 72), 1), "unit": "mm/hr", "threshold": 50},
            {"id": "S007", "name": "Munsiyari Soil Sensor", "type": "SOIL", "lat": 30.06, "lng": 80.24, "status": "ONLINE", "reading": round(random.uniform(74, 82), 0), "unit": "% saturation", "threshold": 80},
            {"id": "S008", "name": "Kapkot AWS", "type": "RAINFALL", "lat": 29.99, "lng": 79.96, "status": "OFFLINE", "reading": None, "unit": "mm/hr", "threshold": 50},
        ],
        "note": "DEMO / SIMULATED",
    }

# ── Risk ──────────────────────────────────────────────────────────────────────
@app.get("/api/risk", tags=["risk"])
def get_risk():
    """Village-level flood risk scores."""
    return {
        "villages": [
            {"id": "V001", "name": "Joshimath", "lat": 30.56, "lng": 79.57, "flood_probability": 0.81, "risk_level": "VERY HIGH", "landslide_probability": 0.74},
            {"id": "V003", "name": "Kedarnath", "lat": 30.73, "lng": 79.07, "flood_probability": 0.93, "risk_level": "EXTREME", "landslide_probability": 0.87},
            {"id": "V007", "name": "Munsiyari", "lat": 30.06, "lng": 80.24, "flood_probability": 0.76, "risk_level": "VERY HIGH", "landslide_probability": 0.79},
        ],
        "note": "DEMO / SIMULATED",
    }

@app.get("/api/landslide-risk", tags=["risk"])
def get_landslide_risk():
    """Slope-correlated landslide susceptibility layer."""
    return {
        "zones": [
            {"village": "Joshimath", "lat": 30.56, "lng": 79.57, "slope_deg": 32, "probability": 0.74, "risk_level": "VERY HIGH"},
            {"village": "Kedarnath", "lat": 30.73, "lng": 79.07, "slope_deg": 41, "probability": 0.87, "risk_level": "EXTREME"},
            {"village": "Munsiyari", "lat": 30.06, "lng": 80.24, "slope_deg": 36, "probability": 0.79, "risk_level": "VERY HIGH"},
        ],
        "note": "DEMO / SIMULATED",
    }

# ── AI Prediction ─────────────────────────────────────────────────────────────
@app.post("/api/prediction", tags=["ai"])
def run_prediction(body: dict, user=Depends(require_role("ANALYST"))):
    """
    Simulated ML inference. Phase 3: replace with real XGBoost + SHAP pipeline.
    Rate limiting: stub — add slowapi or similar in production.
    """
    village_id = body.get("village_id", "V003")
    base_probs = {"V001": 0.81, "V003": 0.93, "V007": 0.76}
    prob = base_probs.get(village_id, 0.6) + random.uniform(-0.03, 0.03)
    return {
        "village_id": village_id,
        "flood_probability": round(min(0.99, prob), 3),
        "landslide_probability": round(min(0.99, prob * 0.9), 3),
        "risk_level": "EXTREME" if prob > 0.85 else "VERY HIGH" if prob > 0.65 else "HIGH",
        "confidence": random.randint(80, 92),
        "model": "XGBoost v2.1 (PROTOTYPE — not trained on real data)",
        "note": "Illustrative Feature Contribution — not real SHAP",
    }

@app.get("/api/predictions/history", tags=["ai"])
def prediction_history(village_id: str = "V003"):
    """Immutable prediction version history (audit trail)."""
    return {
        "village_id": village_id,
        "versions": [
            {"version": "v4", "timestamp": "2026-09-02T06:00:00Z", "flood_probability": 0.93, "risk_level": "EXTREME", "confidence": 87},
            {"version": "v3", "timestamp": "2026-09-02T03:00:00Z", "flood_probability": 0.78, "risk_level": "VERY HIGH", "confidence": 81},
            {"version": "v2", "timestamp": "2026-09-01T21:00:00Z", "flood_probability": 0.61, "risk_level": "HIGH", "confidence": 74},
            {"version": "v1", "timestamp": "2026-09-01T12:00:00Z", "flood_probability": 0.34, "risk_level": "MODERATE", "confidence": 69},
        ],
    }

# ── Alerts ────────────────────────────────────────────────────────────────────
@app.get("/api/alerts", tags=["alerts"])
def get_alerts():
    return {
        "alerts": [
            {"id": "A001", "title": "Extreme Flood Risk — Kedarnath Valley", "severity": "RED", "status": "ACTIVE", "location": "Kedarnath, Rudraprayag"},
            {"id": "A002", "title": "Landslide Warning — Joshimath slopes", "severity": "RED", "status": "ACTIVE", "location": "Joshimath, Chamoli"},
            {"id": "A003", "title": "River Level Warning — Alaknanda", "severity": "ORANGE", "status": "ACTIVE", "location": "Chamoli"},
        ],
        "note": "DEMO / SIMULATED",
    }

# ── Shelters ──────────────────────────────────────────────────────────────────
@app.get("/api/shelters", tags=["shelters"])
def get_shelters():
    return {
        "shelters": [
            {"id": "SH001", "name": "Joshimath Relief Camp", "lat": 30.55, "lng": 79.56, "capacity": 500, "occupancy": 187, "type": "PRIMARY"},
            {"id": "SH002", "name": "Gauchar School Shelter", "lat": 30.27, "lng": 79.18, "capacity": 350, "occupancy": 42, "type": "SECONDARY"},
            {"id": "SH003", "name": "Srinagar Polytechnic Camp", "lat": 30.21, "lng": 78.77, "capacity": 800, "occupancy": 210, "type": "PRIMARY"},
        ],
    }

# ── Field Reports ─────────────────────────────────────────────────────────────
@app.post("/api/field-reports", status_code=201, tags=["field-reports"])
def submit_field_report(report: FieldReportIn, user=Depends(get_current_user)):
    new = {
        "id": f"FR{int(time.time())}",
        "reporter_name": report.reporter_name,
        "reporter_role": report.reporter_role,
        "location": report.location,
        "lat": report.lat,
        "lng": report.lng,
        "description": report.description,
        "severity": report.severity,
        "status": "UNVERIFIED",
        "submitted_by": user["email"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _field_reports.append(new)
    return new

@app.get("/api/field-reports", tags=["field-reports"])
def list_field_reports(status_filter: str | None = None):
    reports = _field_reports
    if status_filter:
        reports = [r for r in reports if r["status"] == status_filter.upper()]
    return {"reports": reports, "total": len(reports)}

@app.patch("/api/field-reports/{report_id}", tags=["field-reports"])
def update_field_report(report_id: str, body: FieldReportStatus, user=Depends(require_role("AUTHORITY"))):
    for r in _field_reports:
        if r["id"] == report_id:
            r["status"] = body.status
            r["updated_by"] = user["email"]
            r["updated_at"] = datetime.now(timezone.utc).isoformat()
            return r
    raise HTTPException(status_code=404, detail="Field report not found")

# ── Simulation ────────────────────────────────────────────────────────────────
@app.post("/api/simulation", tags=["simulation"])
def run_simulation(body: dict):
    """
    Simplified flood simulation endpoint.
    Phase 3: replace with real hydraulic model or ML surrogate.
    """
    rainfall = body.get("rainfall_mm_hr", 50)
    duration = body.get("duration_hours", 24)
    river = body.get("river_level_m", 4.0)
    soil = body.get("soil_moisture_pct", 60)
    score = (rainfall / 100) * 0.35 + (duration / 48) * 0.15 + (river / 10) * 0.3 + (soil / 100) * 0.2
    prob = min(0.98, score)
    level = "EXTREME" if prob > 0.85 else "VERY HIGH" if prob > 0.65 else "HIGH" if prob > 0.45 else "MODERATE" if prob > 0.25 else "LOW"
    return {
        "flood_probability": round(prob, 3),
        "risk_level": level,
        "affected_population_estimate": int(32580 * prob * 1.2),
        "inundated_area_km2": round(1240 * prob * 1.3),
        "note": "DEMO / SIMULATED — not a calibrated hydraulic model",
    }

# ── WebSocket ─────────────────────────────────────────────────────────────────
@app.websocket("/ws/live-updates")
async def websocket_endpoint(ws: WebSocket):
    """Real-time station readings, alert pushes, and risk-map deltas."""
    await manager.connect(ws)
    await ws.send_json({"type": "CONNECTED", "message": "FloodGuard AI live-updates channel · DEMO/SIMULATED"})
    try:
        while True:
            await ws.receive_text()  # keep alive / ping-pong
    except WebSocketDisconnect:
        manager.disconnect(ws)

# ── Vulnerable areas ──────────────────────────────────────────────────────────
@app.get("/api/vulnerable-areas", tags=["risk"])
def get_vulnerable_areas():
    return {
        "villages": [
            {"id": "V003", "name": "Kedarnath", "vulnerability_score": 94, "risk_level": "EXTREME", "population": 980, "elevation_m": 3583, "slope_deg": 41},
            {"id": "V001", "name": "Joshimath", "vulnerability_score": 88, "risk_level": "VERY HIGH", "population": 4200, "elevation_m": 1890, "slope_deg": 32},
            {"id": "V007", "name": "Munsiyari", "vulnerability_score": 83, "risk_level": "VERY HIGH", "population": 5100, "elevation_m": 2298, "slope_deg": 36},
        ],
        "note": "DEMO / SIMULATED",
    }

# ── Historical ────────────────────────────────────────────────────────────────
@app.get("/api/historical", tags=["historical"])
def get_historical(year: int | None = None, district: str | None = None):
    events = [
        {"year": 2013, "district": "Rudraprayag", "rainfall_mm": 312, "deaths": 5748, "type": "FLASH_FLOOD"},
        {"year": 2021, "district": "Chamoli", "rainfall_mm": 178, "deaths": 204, "type": "GLACIAL_LAKE_OUTBURST"},
        {"year": 2023, "district": "Rudraprayag", "rainfall_mm": 198, "deaths": 28, "type": "FLASH_FLOOD"},
    ]
    if year:
        events = [e for e in events if e["year"] == year]
    if district:
        events = [e for e in events if district.lower() in e["district"].lower()]
    return {"events": events, "note": "DEMO / SIMULATED"}
