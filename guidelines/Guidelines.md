# FloodGuard AI — Design Guidelines

## Stance
**Data-dense command center.** Bloomberg Terminal meets emergency ops room.
Every pixel is information. No decorative whitespace. Dense hierarchy with crisp
mono-spaced labels, confident dark canvas, and a risk color scale that signals
meaning at a glance — always color + text, never color alone.

## Canvas
- Page background: `#0a0e1a` (near-black navy)
- Card/panel layer: `#0f1524` with `backdrop-blur(12px)` glassmorphism
- App chrome (sidebar, header): `#080c18`
- All borders: `rgba(255,255,255,0.06–0.1)` hairlines

## Typography
- UI / body: **Inter** (Google Fonts) — 300/400/500/600/700/800
- Data labels, values, status codes, coordinates: **JetBrains Mono** — 400/500/600
- No decorative fonts. Hierarchy through weight and opacity, not size alone.
- Standard sizes: 18px h1 · 13px section header · 12px body · 10–11px labels · 9–10px mono metadata

## Risk Color Scale (non-negotiable — always color + text label)
| Level     | Color     | Hex       |
|-----------|-----------|-----------|
| LOW       | Green     | `#22c55e` |
| MODERATE  | Yellow    | `#eab308` |
| HIGH      | Orange    | `#f97316` |
| VERY HIGH | Red       | `#ef4444` |
| EXTREME   | Purple    | `#a855f7` |

## Component Patterns
- **Glass card**: `rgba(15,21,36,0.85)` bg + `backdrop-blur(12px)` + `1px rgba(255,255,255,0.07)` border + `border-radius: 0.75rem`
- **Hover state**: border shifts to `rgba(59,130,246,0.25)` + faint blue glow
- **Active/selected**: left `2px solid #3b82f6` border + `rgba(59,130,246,0.15)` background
- **Risk badge**: mono font, colored bg at 15% opacity, matching border at 20% opacity
- **Charts**: Recharts with custom dark tooltips, no gridlines by default, reference lines for thresholds

## Motion
- Page transitions: `fadeIn 0.2s ease` (opacity + 4px translateY)
- Pulsing alert ring: `pulse-ring 1.8s ease-out infinite` on active RED/ORANGE markers
- Skeleton loaders: shimmer gradient
- Avoid gratuitous animation — motion signals urgency, not decoration

## Responsible AI
Every page with predictions or risk scores must carry one of:
1. `ILLUSTRATIVE FEATURE CONTRIBUTION` label on XAI charts
2. `DEMO / SIMULATED DATA` badge on live charts
3. Full disclaimer in footer: *"This platform is a prototype decision-support system…"*

## Phase Roadmap
- Phase 1 (current): Frontend + mock data, fully navigable
- Phase 2: FastAPI backend, same data shape, JWT auth, WebSocket
- Phase 3: Real IMD/CWC feeds, trained XGBoost model, real SHAP, PostGIS
