import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip as MapTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CloudRain, Waves, Wind, AlertTriangle, Users, Mountain,
  Activity, ChevronRight, Wifi, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import MetricCard from '../components/ui/MetricCard';
import RiskGauge from '../components/ui/RiskGauge';
import RiskBadge from '../components/ui/RiskBadge';
import {
  alerts, dataSources, villages, generate5DayForecast,
  generateRainfallTimeSeries, generateRiverTimeSeries,
  generateRiskTimelineData, RISK_COLORS, type DemoState, type RiskLevel
} from '../data/mockData';

const DISCLAIMER = 'This platform is a prototype decision-support system. Predictions are experimental and should not replace official government forecasts, warnings, evacuation orders, or emergency instructions.';

interface DashboardProps { demoState: DemoState; }

const forecast = generate5DayForecast();
const conditionEmoji: Record<string, string> = { storm: '⛈️', rain: '🌧️', cloud: '⛅' };

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#94a3b8' }}>
      <div className="font-mono mb-0.5" style={{ color: '#cbd5e1' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-mono">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span></div>
      ))}
    </div>
  );
};

export default function Dashboard({ demoState }: DashboardProps) {
  const [rainfall, setRainfall] = useState(() => generateRainfallTimeSeries(24, 12, demoState.mode === 'HEAVY_RAIN_EVENT'));
  const [riverData, setRiverData] = useState(() => generateRiverTimeSeries(24, 2.8, demoState.mode === 'HEAVY_RAIN_EVENT'));
  const [riskTimeline, setRiskTimeline] = useState(generateRiskTimelineData);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setRainfall(generateRainfallTimeSeries(24, 12, demoState.mode === 'HEAVY_RAIN_EVENT'));
    setRiverData(generateRiverTimeSeries(24, 2.8, demoState.mode === 'HEAVY_RAIN_EVENT'));
    setRiskTimeline(generateRiskTimelineData);
  }, [demoState.mode, tick]);

  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';
  const currentRainfall = isHeavy ? 62.7 : 18.4;
  const riverLevel = isHeavy ? 5.3 : 3.1;
  const floodProb = isHeavy ? 0.93 : 0.44;
  const landProb = isHeavy ? 0.74 : 0.28;
  const riskLevel: RiskLevel = isHeavy ? 'EXTREME' : 'MODERATE';
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const offlineSources = dataSources.filter(d => d.status === 'OFFLINE').length;

  return (
    <div className="page-enter overflow-y-auto" style={{ height: '100%' }}>
      <div className="flex flex-col gap-4 p-4">

        {/* Prototype disclaimer */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.12)', fontSize: '11px' }}>
          <span className="font-mono font-bold" style={{ color: '#3b82f6', flexShrink: 0 }}>PROTOTYPE</span>
          <span style={{ color: '#334155' }}>{DISCLAIMER}</span>
        </div>

        {/* ── Row 1: Metric cards ── */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <MetricCard label="Rainfall" value={currentRainfall.toFixed(1)} unit="mm/hr" icon={<CloudRain size={16} />} iconColor="#3b82f6" trend={{ direction: 'up', label: '+8.3' }} alert={currentRainfall > 50} />
          <MetricCard label="River Level" value={riverLevel.toFixed(1)} unit="m" subValue="Warn: 5.0m" icon={<Waves size={16} />} iconColor={riverLevel >= 5.0 ? '#ef4444' : '#06b6d4'} alert={riverLevel >= 5.0} />
          <MetricCard label="Active Alerts" value={activeAlerts.length} subValue={`${activeAlerts.filter(a => a.severity === 'RED').length} RED`} icon={<AlertTriangle size={16} />} iconColor="#ef4444" alert={activeAlerts.filter(a => a.severity === 'RED').length > 0} />
          <MetricCard label="At-Risk Pop." value="32,580" subValue="7 villages" icon={<Users size={16} />} iconColor="#f97316" />
          <MetricCard label="Soil Moisture" value="78" unit="%" subValue="Thresh: 80%" icon={<Mountain size={16} />} iconColor="#eab308" trend={{ direction: 'up', label: 'Rising' }} />
          <MetricCard label="Data Sources" value={dataSources.length - offlineSources} subValue={`${offlineSources} OFFLINE`} icon={<Activity size={16} />} iconColor={offlineSources > 0 ? '#f97316' : '#22c55e'} alert={offlineSources > 0} />
        </div>

        {/* ── Row 2: Charts + forecast ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 220px' }}>
          {/* Rainfall chart */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-white" style={{ fontSize: '12px' }}>24h Rainfall Intensity</div>
                <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>SIMULATED · mm/hr</div>
              </div>
              <span className="font-mono rounded px-2 py-0.5" style={{ fontSize: '9px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>DEMO</span>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={rainfall} margin={{ top: 2, right: 2, bottom: 0, left: -24 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} interval={7} />
                <YAxis tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine y={50} stroke="#ef444440" strokeDasharray="3 2" />
                <Area type="monotone" dataKey="value" name="mm/hr" stroke="#3b82f6" fill="url(#rg)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* River level chart */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-white" style={{ fontSize: '12px' }}>River Level — Mandakini</div>
                <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>SIMULATED · metres</div>
              </div>
              {riverLevel >= 5.0 && <span className="font-mono rounded px-2 py-0.5 blink" style={{ fontSize: '9px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>⚠ WARNING</span>}
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={riverData} margin={{ top: 2, right: 2, bottom: 0, left: -24 }}>
                <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} interval={7} />
                <YAxis tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} domain={[0, 8]} />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine y={5.0} stroke="#f97316" strokeDasharray="3 2" label={{ value: 'Warn', fill: '#f97316', fontSize: 8, position: 'insideTopLeft' }} />
                <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="3 2" label={{ value: 'Danger', fill: '#ef4444', fontSize: 8, position: 'insideTopLeft' }} />
                <Line type="monotone" dataKey="level" name="Level (m)" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 5-day forecast */}
          <div className="glass-card p-3 flex flex-col gap-2">
            <div className="font-semibold text-white mb-1" style={{ fontSize: '12px' }}>5-Day Forecast</div>
            <div className="font-mono mb-1" style={{ fontSize: '9px', color: '#334155' }}>IMD SIMULATED</div>
            {forecast.map((day, i) => (
              <div key={i} className="flex items-center gap-2 rounded px-2 py-1.5" style={{ background: i === 0 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)', fontSize: '11px' }}>
                <span style={{ color: '#64748b', fontSize: '10px', minWidth: 60 }}>{day.day.slice(0, 9)}</span>
                <span style={{ fontSize: '14px' }}>{conditionEmoji[day.icon]}</span>
                <div className="text-right ml-auto">
                  <div style={{ color: '#e2e8f0', fontSize: '11px' }}>{day.high}mm</div>
                  <div style={{ color: '#334155', fontSize: '9px' }}>{day.condition.split(' ')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 3: Risk gauges + mini-map + 24h timeline ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'auto auto 1fr auto' }}>
          {/* Flood gauge */}
          <div className="glass-card p-4 flex flex-col items-center gap-1">
            <RiskGauge probability={floodProb} riskLevel={riskLevel} size={120} label="Flood Risk" confidence={87} />
            <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>Kedarnath · 6h</div>
          </div>

          {/* Landslide gauge */}
          <div className="glass-card p-4 flex flex-col items-center gap-1">
            <RiskGauge probability={landProb} riskLevel={landProb > 0.7 ? 'VERY HIGH' : 'HIGH'} size={120} label="Landslide Risk" confidence={79} />
            <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>Joshimath · 6h</div>
          </div>

          {/* Mini risk map */}
          <div className="glass-card overflow-hidden" style={{ position: 'relative', minHeight: 190 }}>
            <div className="absolute top-2 left-2 z-10 rounded px-2 py-1 font-mono" style={{ fontSize: '9px', background: 'rgba(10,14,26,0.88)', color: '#334155', border: '1px solid rgba(255,255,255,0.06)' }}>
              RISK MAP PREVIEW · OSM
            </div>
            <Link to="/risk-map" className="absolute top-2 right-2 z-10 rounded px-2 py-1" style={{ fontSize: '10px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', textDecoration: 'none' }}>
              Full map →
            </Link>
            <MapContainer
              center={[30.2, 79.3]}
              zoom={8}
              style={{ width: '100%', height: '100%', minHeight: 190 }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
              {villages.map(v => (
                <CircleMarker
                  key={v.id}
                  center={[v.lat, v.lng]}
                  radius={isHeavy ? 10 + v.vulnerabilityScore / 14 : 7 + v.vulnerabilityScore / 20}
                  pathOptions={{ color: RISK_COLORS[v.riskLevel as RiskLevel], fillColor: RISK_COLORS[v.riskLevel as RiskLevel], fillOpacity: 0.4, weight: 1.5 }}
                >
                  <MapTooltip direction="top" offset={[0, -6]}>
                    <div style={{ background: '#0f1524', padding: '3px 7px', borderRadius: 5, fontSize: '11px', color: '#e2e8f0' }}>
                      <strong>{v.name}</strong> — {v.riskLevel}
                    </div>
                  </MapTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Data source status */}
          <div className="glass-card p-3 flex flex-col" style={{ minWidth: 172 }}>
            <div className="font-semibold text-white mb-2" style={{ fontSize: '12px' }}>Data Sources</div>
            <div className="flex flex-col gap-1.5 flex-1">
              {dataSources.slice(0, 6).map(ds => (
                <div key={ds.id} className="flex items-center justify-between">
                  <span style={{ fontSize: '10px', color: '#475569', maxWidth: 108, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ds.name}</span>
                  <span className="font-mono" style={{
                    fontSize: '9px',
                    color: ds.status === 'ACTIVE' ? '#22c55e' : ds.status === 'WARNING' ? '#eab308' : '#ef4444',
                    background: ds.status === 'ACTIVE' ? 'rgba(34,197,94,0.1)' : ds.status === 'WARNING' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '1px 5px', borderRadius: 4,
                  }}>
                    {ds.status}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/data-sources" className="mt-2 flex items-center gap-1" style={{ fontSize: '10px', color: '#3b82f6', textDecoration: 'none' }}>
              All sources <ChevronRight size={10} />
            </Link>
          </div>
        </div>

        {/* ── Row 4: 24h risk timeline ── */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-white" style={{ fontSize: '12px' }}>24h Risk Timeline — Flood & Landslide Probability</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" style={{ fontSize: '10px', color: '#64748b' }}><div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />Flood %</div>
              <div className="flex items-center gap-1.5" style={{ fontSize: '10px', color: '#64748b' }}><div className="w-2 h-2 rounded-full" style={{ background: '#f97316' }} />Landslide %</div>
              <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>ILLUSTRATIVE</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={riskTimeline} margin={{ top: 2, right: 4, bottom: 0, left: -22 }}>
              <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 8, fill: '#334155' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<DarkTooltip />} />
              <ReferenceLine y={70} stroke="#ef444428" strokeDasharray="3 2" />
              <Line type="monotone" dataKey="flood" name="Flood %" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="landslide" name="Landslide %" stroke="#f97316" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Row 5: Active alerts + Vulnerable areas ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Active alerts */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-white" style={{ fontSize: '12px' }}>Active Alerts ({activeAlerts.length})</div>
              <Link to="/alerts" style={{ fontSize: '10px', color: '#3b82f6', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {activeAlerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="flex items-start gap-2.5 rounded-lg p-2.5" style={{
                  background: alert.severity === 'RED' ? 'rgba(239,68,68,0.07)' : alert.severity === 'ORANGE' ? 'rgba(249,115,22,0.07)' : 'rgba(234,179,8,0.07)',
                  border: `1px solid ${alert.severity === 'RED' ? 'rgba(239,68,68,0.18)' : alert.severity === 'ORANGE' ? 'rgba(249,115,22,0.18)' : 'rgba(234,179,8,0.18)'}`,
                }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: alert.severity === 'RED' ? '#ef4444' : alert.severity === 'ORANGE' ? '#f97316' : '#eab308' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium" style={{ fontSize: '11px', color: '#e2e8f0' }}>{alert.title}</div>
                    <div style={{ fontSize: '10px', color: '#475569' }}>{alert.location}</div>
                  </div>
                  <span className="font-mono flex-shrink-0" style={{ fontSize: '9px', color: '#334155' }}>
                    {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerable villages */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-white" style={{ fontSize: '12px' }}>Top Vulnerable Villages</div>
              <Link to="/vulnerable-areas" style={{ fontSize: '10px', color: '#3b82f6', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {villages.slice(0, 6).sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore).map(v => (
                <div key={v.id} className="flex items-center gap-2" style={{ paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium" style={{ fontSize: '11px', color: '#e2e8f0' }}>{v.name}</span>
                    <span className="ml-1.5 font-mono" style={{ fontSize: '10px', color: '#334155' }}>Pop: {v.population.toLocaleString()}</span>
                  </div>
                  <div className="w-14 rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${v.vulnerabilityScore}%`, background: v.vulnerabilityScore > 80 ? '#ef4444' : v.vulnerabilityScore > 60 ? '#f97316' : '#eab308' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: '10px', color: '#94a3b8', minWidth: 20, textAlign: 'right' }}>{v.vulnerabilityScore}</span>
                  <RiskBadge level={v.riskLevel as RiskLevel} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', fontSize: '10px', color: '#1e293b' }}>
          ⚠ {DISCLAIMER}
        </div>

      </div>
    </div>
  );
}
