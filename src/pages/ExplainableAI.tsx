import { useState } from 'react';
import { Lightbulb, AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import RiskBadge from '../components/ui/RiskBadge';
import { villages, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const featureContributions = [
  { feature: 'Cumulative rainfall (24h)', contribution: 0.38, direction: 'positive', value: '312 mm' },
  { feature: 'River level rate-of-rise', contribution: 0.21, direction: 'positive', value: '+1.8 m/6h' },
  { feature: 'Soil moisture saturation', contribution: 0.15, direction: 'positive', value: '91%' },
  { feature: 'Slope gradient', contribution: 0.11, direction: 'positive', value: '41°' },
  { feature: 'Elevation above floodplain', contribution: -0.08, direction: 'negative', value: '3,583m' },
  { feature: 'Historical flood frequency', contribution: 0.07, direction: 'positive', value: '6 events/10yr' },
  { feature: 'Vegetation density (NDVI)', contribution: -0.05, direction: 'negative', value: 'NDVI 0.62' },
  { feature: 'Basin area upstream', contribution: 0.06, direction: 'positive', value: '2,460 km²' },
  { feature: 'Glacier coverage upstream', contribution: 0.04, direction: 'positive', value: '18.4%' },
  { feature: 'Distance to active channel', contribution: 0.03, direction: 'positive', value: '120m' },
];

const DataQualityBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span style={{ fontSize: '11px', color: '#64748b', minWidth: 140 }}>{label}</span>
    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="font-mono" style={{ fontSize: '11px', color: '#94a3b8', minWidth: 30, textAlign: 'right' }}>{value}%</span>
  </div>
);

export default function ExplainableAI({ demoState }: Props) {
  const [selected, setSelected] = useState('V003');
  const v = villages.find(vv => vv.id === selected) || villages[2];
  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';

  const contributions = featureContributions.map(f => ({
    ...f,
    contribution: isHeavy ? f.contribution * 1.15 : f.contribution,
  }));
  const positives = contributions.filter(f => f.direction === 'positive').sort((a, b) => b.contribution - a.contribution);
  const negatives = contributions.filter(f => f.direction === 'negative');

  const chartData = contributions.map(f => ({
    name: f.feature.length > 28 ? f.feature.slice(0, 28) + '…' : f.feature,
    value: Math.abs(f.contribution),
    positive: f.direction === 'positive',
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Explainable AI</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Why is this area at risk? Feature contribution analysis for the selected village.
        </p>
      </div>

      {/* Village selector */}
      <div className="flex items-center gap-4">
        <div>
          <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>SELECT VILLAGE</label>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="rounded-lg px-3 py-2 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
          >
            {villages.map(vv => <option key={vv.id} value={vv.id} style={{ background: '#0f1524' }}>{vv.name}</option>)}
          </select>
        </div>
        <div className="glass-card px-4 py-2.5 flex items-center gap-4">
          <div>
            <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>FLOOD PROBABILITY</div>
            <div className="font-mono font-bold" style={{ fontSize: '20px', color: '#ef4444' }}>{Math.round(v.floodProbability * 100)}%</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>RISK LEVEL</div>
            <RiskBadge level={v.riskLevel} size="md" />
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>LANDSLIDE PROB.</div>
            <div className="font-mono font-bold" style={{ fontSize: '20px', color: '#f97316' }}>{Math.round(v.landslideProbability * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <AlertCircle size={14} style={{ color: '#eab308', flexShrink: 0 }} />
        <span className="font-semibold" style={{ fontSize: '12px', color: '#eab308' }}>Illustrative Feature Contribution</span>
        <span style={{ fontSize: '12px', color: '#64748b' }}>— These are simulated SHAP-like values for demonstration purposes. Not computed by a real trained model against live data.</span>
      </div>

      {/* Feature contribution chart */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Feature Contribution to Flood Risk Score</div>
          <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>ILLUSTRATIVE FEATURE CONTRIBUTION</div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 8 }}>
            <XAxis type="number" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} domain={[0, 0.45]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} width={200} />
            <Tooltip
              formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Contribution']}
              contentStyle={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#94a3b8' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={14}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.positive ? '#3b82f6' : '#22c55e'} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b' }}>
            <div className="w-3 h-3 rounded" style={{ background: '#3b82f6', opacity: 0.8 }} /> Risk-increasing factors
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b' }}>
            <div className="w-3 h-3 rounded" style={{ background: '#22c55e', opacity: 0.8 }} /> Risk-reducing factors
          </div>
        </div>
      </div>

      {/* Factors cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: '#ef4444' }} />
            <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Risk-Increasing Factors</span>
          </div>
          <div className="flex flex-col gap-2">
            {positives.map(f => (
              <div key={f.feature} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#e2e8f0' }}>{f.feature}</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#64748b' }}>Measured: {f.value}</div>
                </div>
                <div className="font-mono font-bold" style={{ fontSize: '14px', color: '#ef4444' }}>+{(f.contribution * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={14} style={{ color: '#22c55e' }} />
            <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Risk-Reducing Factors</span>
          </div>
          <div className="flex flex-col gap-2">
            {negatives.map(f => (
              <div key={f.feature} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#e2e8f0' }}>{f.feature}</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#64748b' }}>Measured: {f.value}</div>
                </div>
                <div className="font-mono font-bold" style={{ fontSize: '14px', color: '#22c55e' }}>{(f.contribution * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>

          {/* Narrative explanation */}
          <div className="mt-4 rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="flex items-center gap-1.5 mb-2" style={{ fontSize: '11px', color: '#60a5fa' }}>
              <Info size={12} /> AI Narrative Explanation
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
              {v.name} shows <strong style={{ color: '#e2e8f0' }}>{v.riskLevel} flood risk</strong> primarily driven by extreme 24-hour rainfall accumulation (312mm), a rapid 1.8m river level rise in 6 hours, and critically saturated soils (91%). The high slope gradient (41°) also elevates co-occurring landslide probability. The only mitigating factors are high elevation (limiting floodplain exposure) and reasonable vegetation density. <em style={{ color: '#475569' }}>Illustrative explanation only.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Data quality */}
      <div className="glass-card p-4">
        <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>Input Data Quality Indicator</div>
        <div className="flex flex-col gap-2">
          <DataQualityBar label="Rainfall data completeness" value={96} color="#22c55e" />
          <DataQualityBar label="River level readings" value={100} color="#22c55e" />
          <DataQualityBar label="Soil moisture readings" value={78} color="#eab308" />
          <DataQualityBar label="Satellite imagery recency" value={85} color="#22c55e" />
          <DataQualityBar label="Geological base layer" value={100} color="#22c55e" />
          <DataQualityBar label="Weather forecast data" value={91} color="#22c55e" />
        </div>
        <div className="mt-3 font-mono" style={{ fontSize: '10px', color: '#334155' }}>
          Overall data quality score: 91.7% · Degraded inputs reduce confidence in soil-driven landslide predictions.
        </div>
      </div>
    </div>
  );
}
