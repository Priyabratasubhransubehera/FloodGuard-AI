import { useState } from 'react';
import { FlaskConical, Play, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import RiskBadge from '../components/ui/RiskBadge';
import { type RiskLevel, RISK_COLORS, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const RISK_LEVELS: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH', 'EXTREME'];

function computeRisk(rainfall: number, duration: number, river: number, soil: number): { level: RiskLevel; prob: number } {
  const score = (rainfall / 100) * 0.35 + (duration / 48) * 0.15 + (river / 10) * 0.3 + (soil / 100) * 0.2;
  const prob = Math.min(0.98, score);
  const level = prob > 0.85 ? 'EXTREME' : prob > 0.65 ? 'VERY HIGH' : prob > 0.45 ? 'HIGH' : prob > 0.25 ? 'MODERATE' : 'LOW';
  return { level, prob };
}

export default function FloodSimulator({ demoState }: Props) {
  const [rainfall, setRainfall] = useState(50);
  const [duration, setDuration] = useState(24);
  const [river, setRiver] = useState(4.0);
  const [soil, setSoil] = useState(60);
  const [simResult, setSimResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const runSim = () => {
    setRunning(true);
    setTimeout(() => {
      const before = { LOW: 35, MODERATE: 30, HIGH: 20, 'VERY HIGH': 10, EXTREME: 5 };
      const risk = computeRisk(rainfall, duration, river, soil);
      const scale = risk.prob;
      const after = {
        LOW: Math.max(5, 35 - scale * 28),
        MODERATE: Math.max(5, 30 - scale * 15),
        HIGH: 20 + scale * 12,
        'VERY HIGH': 10 + scale * 20,
        EXTREME: 5 + scale * 28,
      };
      const pop = Math.round(32580 * risk.prob * 1.2);
      const area = Math.round(1240 * risk.prob * 1.3);
      setSimResult({ before, after, risk, pop, area });
      setRunning(false);
    }, 1800);
  };

  const SliderControl = ({ label, value, min, max, step, unit, onChange, warn }: any) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="font-mono" style={{ fontSize: '11px', color: '#64748b' }}>{label}</label>
        <span className="font-mono font-bold" style={{ fontSize: '14px', color: warn ? '#ef4444' : '#e2e8f0' }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: warn ? '#ef4444' : '#3b82f6' }}
      />
      <div className="flex justify-between font-mono" style={{ fontSize: '9px', color: '#334155', marginTop: 2 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );

  const chartData = simResult ? RISK_LEVELS.map(l => ({
    level: l,
    before: Math.round(simResult.before[l] || 0),
    after: Math.round(simResult.after[l] || 0),
  })) : [];

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Flood Simulator</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Adjust environmental parameters and simulate flood scenarios to explore risk distributions. All results are <span className="text-yellow-500 font-semibold">hypothetical simulations</span>.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '340px 1fr' }}>
        {/* Controls */}
        <div className="glass-card p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical size={16} style={{ color: '#06b6d4' }} />
            <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Scenario Parameters</span>
          </div>

          <SliderControl label="Rainfall Intensity" value={rainfall} min={5} max={120} step={5} unit=" mm/hr" onChange={setRainfall} warn={rainfall > 80} />
          <SliderControl label="Duration" value={duration} min={1} max={48} step={1} unit="h" onChange={setDuration} />
          <SliderControl label="Initial River Level" value={river} min={1.0} max={9.0} step={0.1} unit=" m" onChange={setRiver} warn={river >= 5.0} />
          <SliderControl label="Soil Moisture" value={soil} min={20} max={100} step={5} unit="%" onChange={setSoil} warn={soil > 80} />

          {/* Live risk preview */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-mono mb-1" style={{ fontSize: '10px', color: '#475569' }}>INSTANT ESTIMATE</div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Flood probability</span>
              <span className="font-mono font-bold" style={{ fontSize: '16px', color: RISK_COLORS[computeRisk(rainfall, duration, river, soil).level] }}>
                {Math.round(computeRisk(rainfall, duration, river, soil).prob * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Risk level</span>
              <RiskBadge level={computeRisk(rainfall, duration, river, soil).level} size="sm" />
            </div>
          </div>

          <button
            onClick={runSim}
            disabled={running}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all"
            style={{
              background: running ? 'rgba(59,130,246,0.15)' : '#1d4ed8',
              color: running ? '#64748b' : 'white',
              fontSize: '13px',
              border: '1px solid rgba(59,130,246,0.3)',
              cursor: running ? 'not-allowed' : 'pointer',
            }}
          >
            {running ? (
              <><div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />Running simulation…</>
            ) : (
              <><Play size={14} />Run Scenario</>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-5">
          {!simResult ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center gap-3" style={{ minHeight: 300 }}>
              <FlaskConical size={40} style={{ color: '#334155' }} />
              <div style={{ fontSize: '14px', color: '#475569' }}>Adjust parameters and run simulation</div>
              <div style={{ fontSize: '12px', color: '#334155' }}>Results will appear here</div>
            </div>
          ) : (
            <>
              {/* Result metrics */}
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { label: 'Risk Level', value: <RiskBadge level={simResult.risk.level} size="lg" />, sub: `${Math.round(simResult.risk.prob * 100)}% probability` },
                  { label: 'Affected Population', value: simResult.pop.toLocaleString(), sub: 'estimated · SIMULATED' },
                  { label: 'Inundated Area', value: `${simResult.area} km²`, sub: 'estimated · SIMULATED' },
                ].map(m => (
                  <div key={m.label} className="glass-card p-4 text-center">
                    <div className="font-mono font-bold mb-1" style={{ fontSize: '22px', color: '#e2e8f0' }}>{m.value}</div>
                    <div className="font-mono" style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>{m.label}</div>
                    <div className="font-mono mt-1" style={{ fontSize: '10px', color: '#334155' }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Before/after distribution */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-white" style={{ fontSize: '13px' }}>Risk Distribution — Before vs After Scenario</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>% of affected villages</div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis dataKey="level" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                    />
                    <Bar dataKey="before" name="Before" fill="#3b82f620" stroke="#3b82f6" strokeWidth={1} radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill="#3b82f640" />)}
                    </Bar>
                    <Bar dataKey="after" name="After Scenario" fill="#ef4444" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={`${RISK_COLORS[entry.level as RiskLevel]}cc`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b' }}>
                    <div className="w-3 h-3 rounded" style={{ background: '#3b82f640', border: '1px solid #3b82f6' }} /> Baseline distribution
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: '11px', color: '#64748b' }}>
                    <div className="w-3 h-3 rounded" style={{ background: RISK_COLORS[simResult.risk.level] + '99' }} /> Post-scenario distribution
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', fontSize: '11px', color: '#78716c' }}>
        <AlertCircle size={14} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
        All simulation results are hypothetical estimates from a simplified model. Not suitable for operational decision-making or public communication. For official scenario planning, consult CWC and NDMA methodologies.
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
