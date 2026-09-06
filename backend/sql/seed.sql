-- FloodGuard AI — Seed Script (Phase 2)
-- Run automatically via Docker Compose entrypoint.
-- Phase 3: extend with real village polygons, watershed geometries (PostGIS).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
    hashed_pw   TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Villages ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS villages (
    id                  VARCHAR(10) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    district            VARCHAR(100),
    lat                 DECIMAL(9,6),
    lng                 DECIMAL(9,6),
    population          INTEGER,
    elevation_m         INTEGER,
    slope_deg           INTEGER,
    vulnerability_score INTEGER DEFAULT 0,
    -- Phase 3: geom GEOMETRY(Point, 4326)
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO villages (id, name, district, lat, lng, population, elevation_m, slope_deg, vulnerability_score) VALUES
('V001', 'Joshimath',     'Chamoli',    30.56, 79.57, 4200,  1890, 32, 88),
('V002', 'Gauchar',       'Chamoli',    30.28, 79.19, 6100,   782, 18, 71),
('V003', 'Kedarnath',     'Rudraprayag',30.73, 79.07,  980,  3583, 41, 94),
('V004', 'Ukhimath',      'Rudraprayag',30.49, 79.10, 3200,  1311, 28, 76),
('V005', 'Srinagar',      'Tehri Garhwal',30.22,78.78,18400,  560, 12, 55),
('V007', 'Munsiyari',     'Pithoragarh',30.06, 80.24, 5100,  2298, 36, 83),
('V009', 'Bageshwar Town','Bageshwar',  29.84, 79.77, 9200,   954, 14, 48)
ON CONFLICT (id) DO NOTHING;

-- ── Shelters ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shelters (
    id              VARCHAR(10) PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    lat             DECIMAL(9,6),
    lng             DECIMAL(9,6),
    capacity        INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    type            VARCHAR(20) DEFAULT 'SECONDARY',
    contact_phone   VARCHAR(20),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO shelters (id, name, lat, lng, capacity, current_occupancy, type, contact_phone) VALUES
('SH001','Joshimath Relief Camp',     30.55, 79.56, 500, 187, 'PRIMARY',   '+91-1389-222301'),
('SH002','Gauchar School Shelter',    30.27, 79.18, 350,  42, 'SECONDARY', '+91-1363-252210'),
('SH003','Srinagar Polytechnic Camp', 30.21, 78.77, 800, 210, 'PRIMARY',   '+91-1346-252180'),
('SH004','Rudraprayag Relief Center', 30.27, 78.97, 600, 395, 'PRIMARY',   '+91-1364-233101'),
('SH005','Dharchula Community Hall',  29.84, 80.52, 280,  88, 'SECONDARY', '+91-5964-222402')
ON CONFLICT (id) DO NOTHING;

-- ── Field Reports ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name   VARCHAR(200) NOT NULL,
    reporter_role   VARCHAR(100),
    location        VARCHAR(300) NOT NULL,
    lat             DECIMAL(9,6),
    lng             DECIMAL(9,6),
    description     TEXT NOT NULL,
    severity        VARCHAR(20) DEFAULT 'MEDIUM',
    status          VARCHAR(20) DEFAULT 'UNVERIFIED',
    submitted_by    VARCHAR(255),
    linked_alert_id VARCHAR(20),
    -- Phase 3: geom GEOMETRY(Point, 4326)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- ── Prediction Versions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prediction_versions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id      VARCHAR(10) REFERENCES villages(id),
    version_tag     VARCHAR(10) NOT NULL,
    flood_probability DECIMAL(5,4),
    risk_level      VARCHAR(20),
    confidence      INTEGER,
    model_version   VARCHAR(50) DEFAULT 'XGBoost-v2.1-prototype',
    data_inputs     JSONB,
    notes           TEXT,
    is_demo         BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notification Log ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel     VARCHAR(20) NOT NULL,  -- SMS | EMAIL | WHATSAPP | PUSH
    recipient   VARCHAR(300),
    message     TEXT,
    status      VARCHAR(20) DEFAULT 'SENT',
    alert_id    VARCHAR(20),
    simulated   BOOLEAN DEFAULT TRUE,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Landslide Zones (Phase 3: use real PostGIS polygons) ───────────────────
CREATE TABLE IF NOT EXISTS landslide_zones (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id      VARCHAR(10) REFERENCES villages(id),
    susceptibility  VARCHAR(20) DEFAULT 'HIGH',
    slope_deg       INTEGER,
    probability     DECIMAL(5,4),
    -- Phase 3: geom GEOMETRY(Polygon, 4326)
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
