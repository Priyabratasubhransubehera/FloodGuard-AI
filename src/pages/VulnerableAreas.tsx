import { useState } from 'react';
import { AlertTriangle, Users, MapPin, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import RiskBadge from '../components/ui/RiskBadge';
import { villages, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }
type SortKey = 'vulnerabilityScore' | 'population' | 'floodProbability' | 'name';

export default function VulnerableAreas({ demoState }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('vulnerabilityScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';

  const filtered = villages
    .filter(v => riskFilter === 'ALL' || v.riskLevel === riskFilter)
    .sort((a, b) => {
      const av = a[sortKey as keyof typeof a] as number | string;
      const bv = b[sortKey as keyof typeof b] as number | string;
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const totalPop = filtered.reduce((s, v) => s + v.population, 0);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setS(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setS('desc'); }
  };
  function setS(d: 'asc' | 'desc') { setSortDir(d); }

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Vulnerable Areas</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Villages ranked by composite vulnerability score (0–100) integrating flood probability, slope, population density, infrastructure exposure, and historical risk.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Villages Assessed', value: villages.length, icon: MapPin, color: '#3b82f6' },
          { label: 'At-Risk Population', value: totalPop.toLocaleString(), icon: Users, color: '#f97316' },
          { label: 'Extreme/Very High Risk', value: villages.filter(v => v.riskLevel === 'EXTREME' || v.riskLevel === 'VERY HIGH').length, icon: AlertTriangle, color: '#ef4444' },
          { label: 'Avg Vulnerability Score', value: (villages.reduce((s, v) => s + v.vulnerabilityScore, 0) / villages.length).toFixed(1), icon: TrendingUp, color: '#eab308' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 40, height: 40, background: `${s.color}18` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div className="font-mono font-bold" style={{ fontSize: '22px', color: '#e2e8f0' }}>{s.value}</div>
              <div className="font-medium" style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {['ALL', 'EXTREME', 'VERY HIGH', 'HIGH', 'MODERATE', 'LOW'].map(f => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className="rounded px-3 py-1.5 font-mono font-medium transition-all"
              style={{
                fontSize: '11px',
                background: riskFilter === f ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: riskFilter === f ? '#60a5fa' : '#475569',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#475569' }}>{filtered.length} villages</span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full" style={{ fontSize: '12px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Village', key: 'name' as SortKey },
                { label: 'District', key: null },
                { label: 'Vulnerability', key: 'vulnerabilityScore' as SortKey },
                { label: 'Risk Level', key: null },
                { label: 'Flood Prob.', key: 'floodProbability' as SortKey },
                { label: 'Landslide Prob.', key: null },
                { label: 'Population', key: 'population' as SortKey },
                { label: 'Elevation', key: null },
                { label: 'Slope', key: null },
              ].map(col => (
                <th
                  key={col.label}
                  onClick={() => col.key && handleSort(col.key)}
                  className="text-left px-4 py-3 font-mono"
                  style={{
                    fontSize: '10px',
                    color: '#475569',
                    letterSpacing: '0.08em',
                    cursor: col.key ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && sortKey === col.key && (
                      sortDir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr
                key={v.id}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 font-medium" style={{ color: '#e2e8f0' }}>{v.name}</td>
                <td className="px-4 py-3" style={{ color: '#64748b' }}>
                  {v.districtId === 'D001' ? 'Chamoli' : v.districtId === 'D002' ? 'Rudraprayag' : v.districtId === 'D003' ? 'Tehri Garhwal' : v.districtId === 'D004' ? 'Pithoragarh' : 'Bageshwar'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${v.vulnerabilityScore}%`, background: v.vulnerabilityScore > 80 ? '#ef4444' : v.vulnerabilityScore > 60 ? '#f97316' : '#eab308' }} />
                    </div>
                    <span className="font-mono" style={{ color: '#94a3b8' }}>{v.vulnerabilityScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><RiskBadge level={v.riskLevel} size="sm" /></td>
                <td className="px-4 py-3 font-mono" style={{ color: v.floodProbability > 0.7 ? '#ef4444' : '#94a3b8' }}>{Math.round(v.floodProbability * 100)}%</td>
                <td className="px-4 py-3 font-mono" style={{ color: v.landslideProbability > 0.6 ? '#f97316' : '#94a3b8' }}>{Math.round(v.landslideProbability * 100)}%</td>
                <td className="px-4 py-3 font-mono" style={{ color: '#94a3b8' }}>{v.population.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono" style={{ color: '#64748b' }}>{v.elevation}m</td>
                <td className="px-4 py-3 font-mono" style={{ color: v.slope > 30 ? '#f97316' : '#64748b' }}>{v.slope}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="font-mono text-center" style={{ fontSize: '10px', color: '#334155' }}>
        DEMO / SIMULATED VULNERABILITY SCORES · Based on illustrative composite index · Not official government risk assessment
      </div>
    </div>
  );
}
