import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Mountain, Users, Home, Activity, Eye, EyeOff } from 'lucide-react';
import RiskBadge from '../components/ui/RiskBadge';
import { villages, stations, shelters, fieldReports, RISK_COLORS, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const CENTER: [number, number] = [30.2, 79.3];

const layers = [
  { id: 'flood', label: 'Flood Risk', color: '#3b82f6' },
  { id: 'landslide', label: 'Landslide Risk', color: '#f97316' },
  { id: 'stations', label: 'Monitoring Stations', color: '#06b6d4' },
  { id: 'shelters', label: 'Shelters', color: '#22c55e' },
  { id: 'field', label: 'Field Reports', color: '#a855f7' },
  { id: 'rivers', label: 'Rivers', color: '#1d4ed8' },
  { id: 'roads', label: 'Roads (Risk)', color: '#eab308' },
];

export default function RiskMap({ demoState }: Props) {
  const [activeLayers, setActiveLayers] = useState(new Set(['flood', 'landslide', 'stations', 'shelters', 'field']));
  const [selectedVillage, setSelectedVillage] = useState<typeof villages[number] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const stationColors = { ONLINE: '#22c55e', WARNING: '#eab308', OFFLINE: '#ef4444' };

  return (
    <div className="flex" style={{ height: '100%', position: 'relative' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={CENTER}
          zoom={9}
          style={{ width: '100%', height: '100%', background: '#0a0e1a' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />

          {/* Flood risk villages */}
          {activeLayers.has('flood') && villages.map(v => (
            <CircleMarker
              key={`flood-${v.id}`}
              center={[v.lat, v.lng]}
              radius={10 + v.vulnerabilityScore / 10}
              pathOptions={{
                color: RISK_COLORS[v.riskLevel],
                fillColor: RISK_COLORS[v.riskLevel],
                fillOpacity: 0.35,
                weight: 1.5,
              }}
              eventHandlers={{ click: () => setSelectedVillage(v) }}
            >
              <MapTooltip direction="top" offset={[0, -8]}>
                <div style={{ background: '#0f1524', padding: '4px 8px', borderRadius: 6, fontSize: '11px', color: '#e2e8f0' }}>
                  <strong>{v.name}</strong> — {v.riskLevel}
                </div>
              </MapTooltip>
            </CircleMarker>
          ))}

          {/* Landslide risk overlay */}
          {activeLayers.has('landslide') && villages.filter(v => v.slope > 25).map(v => (
            <CircleMarker
              key={`ls-${v.id}`}
              center={[v.lat + 0.01, v.lng + 0.01]}
              radius={6 + v.slope / 6}
              pathOptions={{
                color: '#f97316',
                fillColor: '#f97316',
                fillOpacity: 0.2,
                weight: 1,
                dashArray: '4 3',
              }}
            >
              <MapTooltip direction="top" offset={[0, -6]}>
                <div style={{ background: '#0f1524', padding: '4px 8px', borderRadius: 6, fontSize: '11px', color: '#e2e8f0' }}>
                  <strong>{v.name}</strong> — Landslide: {Math.round(v.landslideProbability * 100)}% · Slope {v.slope}°
                </div>
              </MapTooltip>
            </CircleMarker>
          ))}

          {/* Monitoring stations */}
          {activeLayers.has('stations') && stations.map(s => (
            <CircleMarker
              key={`st-${s.id}`}
              center={[s.lat, s.lng]}
              radius={7}
              pathOptions={{
                color: stationColors[s.status],
                fillColor: stationColors[s.status],
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <MapTooltip direction="top" offset={[0, -6]}>
                <div style={{ background: '#0f1524', padding: '4px 8px', borderRadius: 6, fontSize: '11px', color: '#e2e8f0' }}>
                  <strong>{s.name}</strong><br />
                  {s.status === 'OFFLINE' ? 'OFFLINE' : `${s.lastReading} ${s.unit}`} · {s.status}
                </div>
              </MapTooltip>
            </CircleMarker>
          ))}

          {/* Shelters */}
          {activeLayers.has('shelters') && shelters.map(sh => {
            const pct = Math.round((sh.occupancy / sh.capacity) * 100);
            return (
              <CircleMarker
                key={`sh-${sh.id}`}
                center={[sh.lat, sh.lng]}
                radius={8}
                pathOptions={{
                  color: '#22c55e',
                  fillColor: '#22c55e',
                  fillOpacity: 0.7,
                  weight: 2,
                }}
              >
                <MapTooltip direction="top" offset={[0, -6]}>
                  <div style={{ background: '#0f1524', padding: '6px 8px', borderRadius: 6, fontSize: '11px', color: '#e2e8f0' }}>
                    <strong>🏠 {sh.name}</strong><br />
                    Capacity: {sh.occupancy}/{sh.capacity} ({pct}% full)
                  </div>
                </MapTooltip>
              </CircleMarker>
            );
          })}

          {/* Field reports */}
          {activeLayers.has('field') && fieldReports.filter(r => r.status !== 'RESOLVED').map(r => (
            <CircleMarker
              key={`fr-${r.id}`}
              center={[r.lat, r.lng]}
              radius={6}
              pathOptions={{
                color: '#a855f7',
                fillColor: '#a855f7',
                fillOpacity: 0.7,
                weight: 2,
                dashArray: r.status === 'UNVERIFIED' ? '3 2' : undefined,
              }}
            >
              <MapTooltip direction="top" offset={[0, -6]}>
                <div style={{ background: '#0f1524', padding: '6px 8px', borderRadius: 6, fontSize: '11px', color: '#e2e8f0' }}>
                  <strong>📍 {r.location}</strong><br />
                  {r.status} · {r.severity}<br />
                  {r.reporterName}
                </div>
              </MapTooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* DEMO label on map */}
        <div className="absolute bottom-4 left-4 z-10 font-mono rounded-lg px-3 py-1.5" style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: '#334155', letterSpacing: '0.1em' }}>
          DEMO / SIMULATED RISK OVERLAY · OSM Base Map
        </div>
      </div>

      {/* Layer control panel */}
      <div className="flex flex-col" style={{ width: 260, background: '#080c18', borderLeft: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, overflow: 'hidden' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Layers size={14} style={{ color: '#64748b' }} />
          <span className="font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>Map Layers</span>
        </div>

        <div className="flex flex-col gap-1 p-3 overflow-y-auto">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
              style={{
                background: activeLayers.has(layer.id) ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: activeLayers.has(layer.id) ? layer.color : '#334155' }} />
              <span style={{ fontSize: '12px', color: activeLayers.has(layer.id) ? '#e2e8f0' : '#475569' }}>{layer.label}</span>
              <span className="ml-auto" style={{ color: '#475569' }}>
                {activeLayers.has(layer.id) ? <Eye size={12} /> : <EyeOff size={12} />}
              </span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="p-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="font-semibold mb-2" style={{ fontSize: '11px', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Risk Legend</div>
          {(['LOW', 'MODERATE', 'HIGH', 'VERY HIGH', 'EXTREME'] as const).map(level => (
            <div key={level} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: RISK_COLORS[level] }} />
              <span className="font-mono" style={{ fontSize: '10px', color: '#64748b' }}>{level}</span>
            </div>
          ))}
          <div className="mt-2" style={{ fontSize: '10px', color: '#334155' }}>
            Dashed circle = Landslide zone<br />
            Purple circle = Field report<br />
            ■ Green diamond = Shelter
          </div>
        </div>

        {/* Village detail panel */}
        {selectedVillage && (
          <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>{selectedVillage.name}</span>
              <button onClick={() => setSelectedVillage(null)} style={{ fontSize: '18px', color: '#475569', lineHeight: 1 }}>×</button>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Risk Level', value: <RiskBadge level={selectedVillage.riskLevel} size="sm" /> },
                { label: 'Flood Prob.', value: `${Math.round(selectedVillage.floodProbability * 100)}%` },
                { label: 'Landslide Prob.', value: `${Math.round(selectedVillage.landslideProbability * 100)}%` },
                { label: 'Population', value: selectedVillage.population.toLocaleString() },
                { label: 'Elevation', value: `${selectedVillage.elevation}m` },
                { label: 'Slope', value: `${selectedVillage.slope}°` },
                { label: 'Vulnerability', value: `${selectedVillage.vulnerabilityScore}/100` },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span style={{ fontSize: '11px', color: '#475569' }}>{row.label}</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: '#94a3b8' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
