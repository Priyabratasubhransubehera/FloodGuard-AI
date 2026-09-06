import { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, AlertCircle, Droplets, Wind, Mountain, Satellite } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { stations, generateRainfallTimeSeries, generateRiverTimeSeries, generateSoilMoistureTimeSeries, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const statusColor = { ONLINE: '#22c55e', WARNING: '#eab308', OFFLINE: '#ef4444' };
const tabIcons = { RAINFALL: Droplets, RIVER: Activity, WEATHER: Wind, SOIL: Mountain, SATELLITE: Satellite };
const tabs = ['RAINFALL', 'RIVER', 'WEATHER', 'SOIL', 'SATELLITE'] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2" style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}>
        <div className="font-mono mb-1" style={{ color: '#cbd5e1' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-mono">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function LiveMonitoring({ demoState }: Props) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('RAINFALL');
  const [rainfallData, setRainfallData] = useState(() => generateRainfallTimeSeries(24, 12, demoState.mode === 'HEAVY_RAIN_EVENT'));
  const [riverData, setRiverData] = useState(() => generateRiverTimeSeries(24, 2.8, demoState.mode === 'HEAVY_RAIN_EVENT'));
  const [soilData] = useState(() => generateSoilMoistureTimeSeries(24));
  const [wsStatus, setWsStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'OFFLINE'>('CONNECTED');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState(stations[0].id);

  useEffect(() => {
    const t = setInterval(() => {
      setRainfallData(generateRainfallTimeSeries(24, 12, demoState.mode === 'HEAVY_RAIN_EVENT'));
      setRiverData(generateRiverTimeSeries(24, 2.8, demoState.mode === 'HEAVY_RAIN_EVENT'));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(t);
  }, [demoState.mode]);

  useEffect(() => {
    setWsStatus('RECONNECTING');
    const t = setTimeout(() => setWsStatus('CONNECTED'), 1200);
    return () => clearTimeout(t);
  }, []);

  const tabStations = stations.filter(s => activeTab === 'SATELLITE' ? false : s.type === activeTab);
  const currentStation = stations.find(s => s.id === selectedStation) || stations[0];

  return (
    <div className="page-enter flex flex-col gap-4 p-5 overflow-y-auto" style={{ height: '100%' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Live Monitoring</h1>
          <div className="font-mono mt-0.5" style={{ fontSize: '11px', color: '#475569' }}>
            DEMO / SIMULATED LIVE DATA — updates every 5 seconds · Last: {lastUpdate.toLocaleTimeString('en-IN')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px' }}>
            {wsStatus === 'CONNECTED' ? <Wifi size={12} style={{ color: '#22c55e' }} /> : wsStatus === 'RECONNECTING' ? <Wifi size={12} className="blink" style={{ color: '#eab308' }} /> : <WifiOff size={12} style={{ color: '#ef4444' }} />}
            <span className="font-mono" style={{ color: wsStatus === 'CONNECTED' ? '#22c55e' : wsStatus === 'RECONNECTING' ? '#eab308' : '#ef4444' }}>
              WS {wsStatus}
            </span>
          </div>
          <span className="font-mono rounded-lg px-3 py-1.5" style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            SIMULATED LIVE
          </span>
        </div>
      </div>

      {/* Station quick cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {stations.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedStation(s.id)}
            className="glass-card p-3 text-left transition-all"
            style={{
              borderColor: selectedStation === s.id ? 'rgba(59,130,246,0.4)' : undefined,
              boxShadow: selectedStation === s.id ? '0 0 12px rgba(59,130,246,0.1)' : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: '9px', background: `${statusColor[s.status]}18`, color: statusColor[s.status], border: `1px solid ${statusColor[s.status]}30` }}>
                {s.status}
              </span>
              <span className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>{s.type}</span>
            </div>
            <div className="font-mono font-bold" style={{ fontSize: '20px', color: s.status === 'OFFLINE' ? '#334155' : '#e2e8f0' }}>
              {s.status === 'OFFLINE' ? '—' : s.lastReading.toFixed(1)}
              <span className="ml-1 font-normal" style={{ fontSize: '10px', color: '#475569' }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>{s.name}</div>
            {s.status === 'WARNING' && (
              <div className="flex items-center gap-1 mt-1" style={{ fontSize: '10px', color: '#eab308' }}>
                <AlertCircle size={10} /> Approaching threshold
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {tabs.map(tab => {
          const Icon = tabIcons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all font-medium"
              style={{
                fontSize: '12px',
                background: activeTab === tab ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: activeTab === tab ? '#60a5fa' : '#475569',
                border: activeTab === tab ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
              }}
            >
              <Icon size={13} />{tab}
            </button>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {activeTab === 'RAINFALL' && (
          <>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Rainfall Intensity — 24h</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>mm/hr · Chamoli Region</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={rainfallData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="rfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={50} stroke="#ef444450" strokeDasharray="3 3" label={{ value: 'Heavy', fill: '#ef4444', fontSize: 9 }} />
                  <Area type="monotone" dataKey="value" name="mm/hr" stroke="#3b82f6" fill="url(#rfGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Cumulative Rainfall — 24h</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>mm total · Kedarnath AWS</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={rainfallData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="cumulative" name="Cumulative mm" stroke="#06b6d4" fill="url(#cumGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'RIVER' && (
          <>
            <div className="glass-card p-4">
              <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>River Level — Mandakini @ Rudraprayag</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={riverData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} domain={[0, 8]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={5.0} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Warning 5.0m', fill: '#f97316', fontSize: 9 }} />
                  <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Danger 6.5m', fill: '#ef4444', fontSize: 9 }} />
                  <Line type="monotone" dataKey="level" name="Level (m)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-4">
              <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>River Level — Alaknanda @ Chamoli</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={riverData.map(d => ({ ...d, level: Math.max(0, d.level - 0.8) }))} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} domain={[0, 8]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={5.0} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Warning 5.0m', fill: '#f97316', fontSize: 9 }} />
                  <Line type="monotone" dataKey="level" name="Level (m)" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'SOIL' && (
          <>
            <div className="glass-card p-4">
              <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>Soil Moisture Saturation — Munsiyari</div>
              <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>% saturation · Threshold: 80%</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={soilData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={80} stroke="#ef444450" strokeDasharray="3 3" label={{ value: 'Landslide threshold', fill: '#ef4444', fontSize: 9 }} />
                  <Area type="monotone" dataKey="value" name="% saturation" stroke="#eab308" fill="url(#soilGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-4 flex flex-col gap-3">
              <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Soil Sensor Network Status</div>
              {[
                { name: 'Munsiyari Ridge', value: 78, status: 'ONLINE' },
                { name: 'Joshimath Slope', value: 85, status: 'WARNING' },
                { name: 'Kapkot Farm', value: 0, status: 'OFFLINE' },
                { name: 'Kedarnath Meadow', value: 91, status: 'WARNING' },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: '12px', color: s.value > 80 ? '#ef4444' : '#e2e8f0' }}>
                      {s.status === 'OFFLINE' ? '—' : `${s.value}%`}
                    </span>
                    <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: '9px', color: statusColor[s.status as keyof typeof statusColor], background: `${statusColor[s.status as keyof typeof statusColor]}18` }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'WEATHER' && (
          <>
            <div className="glass-card p-4 flex flex-col gap-4">
              <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Current Weather Conditions</div>
              {[
                { label: 'Temperature', value: '18.4°C', icon: '🌡️' },
                { label: 'Relative Humidity', value: '94%', icon: '💧' },
                { label: 'Wind Speed', value: '24 km/h NW', icon: '💨' },
                { label: 'Visibility', value: '0.8 km (Fog)', icon: '🌫️' },
                { label: 'Cloud Cover', value: '100% (Overcast)', icon: '☁️' },
                { label: 'Dew Point', value: '17.2°C', icon: '🌢️' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{item.icon} {item.label}</span>
                  <span className="font-mono font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="glass-card p-4">
              <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>Humidity & Wind — 24h</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={rainfallData.map((d, i) => ({ ...d, humidity: 72 + i * 0.9 + (Math.random() - 0.5) * 3, wind: 18 + i * 0.4 + (Math.random() - 0.5) * 4 }))} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="wind" name="Wind km/h" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'SATELLITE' && (
          <div className="col-span-2 glass-card p-6 flex flex-col items-center justify-center gap-3" style={{ minHeight: 240 }}>
            <Satellite size={48} style={{ color: '#334155' }} />
            <div className="font-semibold" style={{ fontSize: '14px', color: '#64748b' }}>Live Satellite Feed</div>
            <div className="text-center" style={{ fontSize: '12px', color: '#334155', maxWidth: 400 }}>
              Real-time satellite imagery is available in the Satellite Monitoring section with before/after comparison tools and change detection analysis.
            </div>
          </div>
        )}
      </div>

      {/* Station detail */}
      <div className="glass-card p-4">
        <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>
          Station Detail — {currentStation.name}
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {[
            { label: 'Station ID', value: currentStation.id },
            { label: 'Type', value: currentStation.type },
            { label: 'Status', value: currentStation.status },
            { label: 'Current Reading', value: `${currentStation.lastReading} ${currentStation.unit}` },
            { label: 'Threshold', value: `${currentStation.threshold} ${currentStation.unit}` },
            { label: 'Coordinates', value: `${currentStation.lat}°N, ${currentStation.lng}°E` },
          ].map(item => (
            <div key={item.label} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>{item.label}</div>
              <div className="font-mono mt-0.5" style={{ fontSize: '12px', color: item.label === 'Status' ? statusColor[currentStation.status] : '#e2e8f0' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
