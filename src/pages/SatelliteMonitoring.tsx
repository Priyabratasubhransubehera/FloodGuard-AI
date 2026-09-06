import { useState } from "react"
import { Satellite, Layers, Eye, AlertCircle, Move } from "lucide-react"

const images = {
  before:
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=500&fit=crop&auto=format",
  during:
    "https://images.unsplash.com/photo-1527699271069-0566f4e84cf1?w=800&h=500&fit=crop&auto=format",
  after:
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop&auto=format",
}

const changeStats = [
  {
    label: "Inundated Area",
    before: "0 km²",
    after: "124 km²",
    change: "+124 km²",
    color: "#ef4444",
  },
  {
    label: "Affected Forest Cover",
    before: "320 km²",
    after: "298 km²",
    change: "-6.9%",
    color: "#f97316",
  },
  {
    label: "Visible Landslide Scars",
    before: "3",
    after: "19",
    change: "+16",
    color: "#ef4444",
  },
  {
    label: "Road Network Visible",
    before: "98%",
    after: "71%",
    change: "-27%",
    color: "#f97316",
  },
  {
    label: "Settlement Exposure",
    before: "Low",
    after: "High",
    change: "↑ Risk",
    color: "#ef4444",
  },
]

export default function SatelliteMonitoring() {
  const [activeView, setActiveView] =
    useState<"BEFORE" | "DURING" | "AFTER" | "COMPARE">("DURING")
  const [showNDVI, setShowNDVI] = useState(false)
  const [showSAR, setShowSAR] = useState(false)
  const [sliderPos, setSliderPos] = useState(50)

  return (
    <div
      className="page-enter flex flex-col gap-5 p-5 overflow-y-auto"
      style={{ height: "100%" }}
    >
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: "18px" }}>
          Satellite Monitoring
        </h1>
        <p className="mt-1" style={{ fontSize: "12px", color: "#475569" }}>
          Multi-temporal satellite imagery with change detection. Imagery below
          is illustrative — sourced from Unsplash.{" "}
          <span className="text-yellow-500 font-semibold">
            DEMO / SIMULATED
          </span>
          .
        </p>
      </div>

      {/* View mode tabs */}
      <div className="flex items-center gap-3">
        <div
          className="flex gap-1 rounded-lg p-1"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {(["BEFORE", "DURING", "AFTER", "COMPARE"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className="rounded-lg px-4 py-2 font-medium transition-all"
              style={{
                fontSize: "12px",
                background:
                  activeView === v ? "rgba(59,130,246,0.15)" : "transparent",
                color: activeView === v ? "#60a5fa" : "#475569",
                border:
                  activeView === v
                    ? "1px solid rgba(59,130,246,0.2)"
                    : "1px solid transparent",
              }}
            >
              {v === "BEFORE"
                ? "📷 Pre-Event"
                : v === "DURING"
                  ? "⛈️ During Event"
                  : v === "AFTER"
                    ? "📊 Post-Event"
                    : "↔️ Compare"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowNDVI(!showNDVI)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{
              fontSize: "11px",
              background: showNDVI
                ? "rgba(34,197,94,0.15)"
                : "rgba(255,255,255,0.04)",
              color: showNDVI ? "#22c55e" : "#475569",
              border: showNDVI
                ? "1px solid rgba(34,197,94,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Layers size={12} /> NDVI Overlay
          </button>
          <button
            onClick={() => setShowSAR(!showSAR)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
            style={{
              fontSize: "11px",
              background: showSAR
                ? "rgba(59,130,246,0.15)"
                : "rgba(255,255,255,0.04)",
              color: showSAR ? "#3b82f6" : "#475569",
              border: showSAR
                ? "1px solid rgba(59,130,246,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Satellite size={12} /> SAR Inundation
          </button>
        </div>
      </div>

      {/* Imagery */}
      <div
        className="glass-card overflow-hidden"
        style={{ position: "relative" }}
      >
        {activeView !== "COMPARE" ? (
          <div
            style={{ position: "relative", height: 420, background: "#0a0e1a" }}
          >
            <img
              src={
                images[(activeView.toLowerCase() as keyof typeof images)] ||
                images.during
              }
              alt={`${activeView} satellite imagery`}
              className="w-full h-full object-cover"
              style={{ opacity: 0.75 }}
            />
            {/* SAR overlay simulation */}
            {showSAR && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 40% at 45% 55%, rgba(59,130,246,0.45) 0%, transparent 70%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}
            {/* NDVI overlay simulation */}
            {showNDVI && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(34,197,94,0.3) 0%, rgba(234,179,8,0.15) 50%, transparent 80%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}
            <div
              className="absolute top-4 left-4 rounded-lg px-3 py-1.5"
              style={{
                background: "rgba(10,14,26,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "11px",
                color: "#60a5fa",
              }}
            >
              <Eye size={11} className="inline mr-1" />
              {activeView === "BEFORE"
                ? "Pre-Event · 25 Aug 2026"
                : activeView === "DURING"
                  ? "During Event · 02 Sep 2026 06:00 UTC"
                  : "Post-Event · 03 Sep 2026"}
              <span className="ml-2 font-mono" style={{ color: "#334155" }}>
                DEMO
              </span>
            </div>
            {activeView === "DURING" && (
              <div
                className="absolute top-4 right-4 rounded-lg px-3 py-1.5 blink"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  fontSize: "11px",
                  color: "#ef4444",
                }}
              >
                ● LIVE (SIMULATED)
              </div>
            )}
          </div>
        ) : (
          /* Before/after slider */
          <div
            style={{
              position: "relative",
              height: 420,
              overflow: "hidden",
              cursor: "ew-resize",
            }}
            onMouseMove={(e) => {
              const rect =
                (e.currentTarget as HTMLDivElement).getBoundingClientRect()
              setSliderPos(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <img
              src={images.after}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.75 }}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={images.before}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.75, minWidth: "100vw" }}
              />
            </div>
            <div
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div
                className="w-0.5 h-full"
                style={{ background: "rgba(255,255,255,0.6)" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                style={{ width: 32, height: 32, background: "white" }}
              >
                <Move size={16} style={{ color: "#0a0e1a" }} />
              </div>
            </div>
            <div
              className="absolute top-4 left-4 rounded-lg px-3 py-1.5"
              style={{
                background: "rgba(10,14,26,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "11px",
                color: "#22c55e",
              }}
            >
              Pre-Event (Aug 25)
            </div>
            <div
              className="absolute top-4 right-4 rounded-lg px-3 py-1.5"
              style={{
                background: "rgba(10,14,26,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "11px",
                color: "#ef4444",
              }}
            >
              Post-Event (Sep 3)
            </div>
          </div>
        )}
      </div>

      {/* Change detection stats */}
      <div className="glass-card p-4">
        <div
          className="font-semibold text-white mb-3"
          style={{ fontSize: "13px" }}
        >
          Change Detection Analysis
        </div>
        <div
          className="font-mono mb-3"
          style={{ fontSize: "10px", color: "#475569" }}
        >
          Pre-event vs post-event comparison · ILLUSTRATIVE ESTIMATES
        </div>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {changeStats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: "10px", color: "#475569" }}
              >
                {s.label}
              </div>
              <div className="flex items-end gap-2 mt-1">
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: "18px", color: s.color }}
                >
                  {s.after}
                </span>
                <span
                  className="font-mono mb-0.5"
                  style={{ fontSize: "11px", color: s.color }}
                >
                  {s.change}
                </span>
              </div>
              <div
                className="font-mono"
                style={{ fontSize: "10px", color: "#334155" }}
              >
                Before: {s.before}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-2 flex items-start gap-2"
        style={{
          background: "rgba(234,179,8,0.06)",
          border: "1px solid rgba(234,179,8,0.15)",
          fontSize: "11px",
          color: "#78716c",
        }}
      >
        <AlertCircle
          size={12}
          style={{ color: "#eab308", flexShrink: 0, marginTop: 1 }}
        />
        Imagery is illustrative (Unsplash). In production, ISRO Bhuvan and
        Sentinel-1 SAR feeds would provide real flood inundation mapping. Change
        detection values are simulated for demonstration.
      </div>
    </div>
  )
}
