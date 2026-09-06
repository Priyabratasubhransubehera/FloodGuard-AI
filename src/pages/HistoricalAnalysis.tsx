import { useState } from 'react';
import { History, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { historicalEvents, generateMonthlyRainfallData } from '../data/mockData';

const monthlyData = generateMonthlyRainfallData();

const floodFrequency = [
  { year: '2013', count: 2, deaths: 5748 },
  { year: '2014', count: 0, deaths: 0 },
  { year: '2015', count: 1, deaths: 4 },
  { year: '2016', count: 2, deaths: 12 },
  { year: '2017', count: 1, deaths: 3 },
  { year: '2018', count: 0, deaths: 0 },
  { year: '2019', count: 3, deaths: 34 },
  { year: '2020', count: 1, deaths: 7 },
  { year: '2021', count: 2, deaths: 204 },
  { year: '2022', count: 1, deaths: 8 },
  { year: '2023', count: 2, deaths: 28 },
  { year: '2024', count: 2, deaths: 17 },
];

const riskComparison = [
  { period: '2010–2015', avgRisk: 42, avgRainfall: 180, events: 6 },
  { period: '2016–2020', avgRisk: 56, avgRainfall: 210, events: 8 },
  { period: '2021–2025', avgRisk: 73, avgRainfall: 248, events: 10 },
  { period: '2026 YTD', avgRisk: 89, avgRainfall: 312, events: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2" style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}>
        <div className="font-mono mb-1" style={{ color: '#cbd5e1' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-mono">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function HistoricalAnalysis() {
  const [yearFilter, setYearFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const filtered = historicalEvents.filter(e =>
    (yearFilter === 'ALL' || e.year.toString() === yearFilter) &&
    (districtFilter === 'ALL' || e.district === districtFilter)
  );

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Historical Analysis</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Long-term flood and landslide event analysis for Uttarakhand. SIMULATED historical records for demonstration.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div>
          <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>YEAR</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '12px' }}>
            <option value="ALL" style={{ background: '#0f1524' }}>All Years</option>
            {[2013, 2016, 2019, 2021, 2022, 2023, 2024].map(y => <option key={y} value={y} style={{ background: '#0f1524' }}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>DISTRICT</label>
          <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className="rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '12px' }}>
            <option value="ALL" style={{ background: '#0f1524' }}>All Districts</option>
            {['Chamoli', 'Rudraprayag', 'Tehri Garhwal', 'Pithoragarh', 'Bageshwar'].map(d => <option key={d} value={d} style={{ background: '#0f1524' }}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Monthly rainfall pattern */}
        <div className="glass-card p-4">
          <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>Monthly Rainfall Pattern</div>
          <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>Current Year vs 30-Year Average · mm</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
              <Bar dataKey="avg" name="30yr Avg" fill="#3b82f630" stroke="#3b82f6" strokeWidth={1} radius={[3, 3, 0, 0]} />
              <Bar dataKey="rainfall" name="2026" fill="#06b6d4" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Flood frequency */}
        <div className="glass-card p-4">
          <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>Annual Flood Event Frequency</div>
          <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>2013–2026 · SIMULATED records</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={floodFrequency} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Events" fill="#f97316" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk trend */}
        <div className="glass-card p-4">
          <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>Historical vs Current Risk Comparison</div>
          <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>5-year period avg risk score · ILLUSTRATIVE</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskComparison} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgRisk" name="Avg Risk Score" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
              <Line type="monotone" dataKey="avgRainfall" name="Avg Rainfall (mm)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deaths trend */}
        <div className="glass-card p-4">
          <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>Lives Lost in Major Events</div>
          <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>2013–2024 · SIMULATED data</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={floodFrequency} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="deaths" name="Deaths" fill="#ef4444" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event table */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 font-semibold text-white" style={{ fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Major Historical Events ({filtered.length} records)
        </div>
        <table className="w-full" style={{ fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Year', 'District', 'Type', 'Rainfall (mm)', 'Deaths', 'Displaced', 'Total Affected', 'Peak River Level'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-mono" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td className="px-4 py-3 font-mono font-bold" style={{ color: '#e2e8f0' }}>{e.year}</td>
                <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{e.district}</td>
                <td className="px-4 py-3">
                  <span className="font-mono rounded px-2 py-0.5" style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{e.type.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: '#e2e8f0' }}>{e.rainfall}</td>
                <td className="px-4 py-3 font-mono" style={{ color: e.deaths > 100 ? '#ef4444' : e.deaths > 20 ? '#f97316' : '#e2e8f0' }}>{e.deaths.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono" style={{ color: '#94a3b8' }}>{e.displaced.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono" style={{ color: '#94a3b8' }}>{e.affected.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono" style={{ color: e.peakRiverLevel > 7 ? '#ef4444' : '#e2e8f0' }}>{e.peakRiverLevel}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="font-mono text-center" style={{ fontSize: '10px', color: '#334155' }}>
        SIMULATED historical data for demonstration purposes only · Not sourced from official IMD/CWC records
      </div>
    </div>
  );
}
