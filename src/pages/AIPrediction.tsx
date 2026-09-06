import { useState, useEffect } from 'react';
import { Brain, Play, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import RiskGauge from '../components/ui/RiskGauge';
import RiskBadge from '../components/ui/RiskBadge';
import { villages, districts, predictionVersions, type RiskLevel, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2" style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#94a3b8' }}>
        <div className="font-mono mb-1" style={{ color: '#cbd5e1' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {(p.value * 100).toFixed(0)}%</div>
        ))}
      </div>
    );
  }
  return null;
};

function generateForecastCurve(baseProb: number) {
  const hours = [0, 3, 6, 12, 24, 48, 72];
  return hours.map((h, i) => ({
    hour: `+${h}h`,
    probability: Math.max(0.05, Math.min(0.99, baseProb - i * 0.06 + (Math.random() - 0.5) * 0.04)),
    confidence_hi: Math.min(0.99, baseProb - i * 0.04 + 0.08),
    confidence_lo: Math.max(0.01, baseProb - i * 0.08 - 0.08),
  }));
}

export default function AIPrediction({ demoState }: Props) {
  const [selectedRegion, setSelectedRegion] = useState('D002');
  const [selectedVillage, setSelectedVillage] = useState('V003');
  const [horizon, setHorizon] = useState('6');
  const [running, setRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';
  const targetVillage = villages.find(v => v.id === selectedVillage) || villages[2];

  const runPrediction = () => {
    setRunning(true);
    setHasResult(false);
    setTimeout(() => {
      const v = villages.find(vv => vv.id === selectedVillage) || villages[2];
      const prob = isHeavy ? Math.min(0.99, v.floodProbability + 0.08) : v.floodProbability;
      const landProb = isHeavy ? Math.min(0.99, v.landslideProbability + 0.06) : v.landslideProbability;
      setResult({
        village: v,
        floodProb: prob,
        landProb,
        riskLevel: isHeavy && prob > 0.85 ? 'EXTREME' : v.riskLevel,
        confidence: isHeavy ? 87 : 74,
        forecastCurve: generateForecastCurve(prob),
      });
      setRunning(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>AI Prediction Engine</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Run flood and landslide risk predictions for a selected region and time horizon. All outputs are{' '}
          <span className="font-semibold" style={{ color: '#eab308' }}>ILLUSTRATIVE PROTOTYPE ESTIMATES</span> — not official forecasts.
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-5">
        <div className="font-semibold text-white mb-4" style={{ fontSize: '13px' }}>Prediction Parameters</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>DISTRICT</label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {districts.map(d => <option key={d.id} value={d.id} style={{ background: '#0f1524' }}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>VILLAGE</label>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {villages.map(v => <option key={v.id} value={v.id} style={{ background: '#0f1524' }}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>TIME HORIZON</label>
            <select
              value={horizon}
              onChange={e => setHorizon(e.target.value)}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {['3', '6', '12', '24', '48', '72'].map(h => <option key={h} value={h} style={{ background: '#0f1524' }}>+{h} hours</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={runPrediction}
              disabled={running}
              className="flex items-center gap-2 rounded-lg px-6 py-2 font-semibold transition-all"
              style={{
                background: running ? 'rgba(59,130,246,0.2)' : '#1d4ed8',
                color: running ? '#64748b' : 'white',
                fontSize: '13px',
                border: '1px solid rgba(59,130,246,0.3)',
                cursor: running ? 'not-allowed' : 'pointer',
              }}
            >
              {running ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                  Running…
                </>
              ) : (
                <><Play size={14} />Run Prediction</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {running && (
        <div className="glass-card p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2" style={{ borderColor: '#1d4ed8', borderTopColor: '#06b6d4', animation: 'spin 0.8s linear infinite' }} />
          <div className="font-semibold" style={{ color: '#64748b' }}>Simulating ML inference pipeline…</div>
          <div className="font-mono" style={{ fontSize: '11px', color: '#334155' }}>
            Loading IMD forecast → Extracting features → XGBoost inference → Confidence calibration
          </div>
        </div>
      )}

      {/* Results */}
      {hasResult && result && (
        <>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
            <div className="glass-card p-6 flex flex-col items-center gap-2">
              <RiskGauge probability={result.floodProb} riskLevel={result.riskLevel} size={140} label="Flood Risk" confidence={result.confidence} />
            </div>
            <div className="glass-card p-6 flex flex-col items-center gap-2">
              <RiskGauge probability={result.landProb} riskLevel={result.landProb > 0.7 ? 'VERY HIGH' : result.landProb > 0.5 ? 'HIGH' : 'MODERATE'} size={140} label="Landslide Risk" confidence={result.confidence - 8} />
            </div>
            <div className="glass-card p-4">
              <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>Risk Probability Forecast Curve</div>
              <div className="font-mono mb-2" style={{ fontSize: '10px', color: '#475569' }}>Horizon: 0–72h · ILLUSTRATIVE ESTIMATES</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={result.forecastCurve} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0.7} stroke="#ef444450" strokeDasharray="3 3" label={{ value: 'HIGH', fill: '#ef4444', fontSize: 9 }} />
                  <Line type="monotone" dataKey="probability" name="Flood Prob." stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="confidence_hi" name="Conf. High" stroke="#3b82f620" strokeWidth={1} dot={false} strokeDasharray="3 2" />
                  <Line type="monotone" dataKey="confidence_lo" name="Conf. Low" stroke="#3b82f620" strokeWidth={1} dot={false} strokeDasharray="3 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model info */}
          <div className="glass-card p-4">
            <div className="font-semibold text-white mb-3" style={{ fontSize: '13px' }}>Prediction Summary — {result.village.name}</div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {[
                { label: 'Flood Probability', value: `${Math.round(result.floodProb * 100)}%` },
                { label: 'Landslide Probability', value: `${Math.round(result.landProb * 100)}%` },
                { label: 'Overall Risk', value: <RiskBadge level={result.riskLevel} size="md" /> },
                { label: 'Model Confidence', value: `${result.confidence}%` },
                { label: 'Time Horizon', value: `+${horizon} hours` },
                { label: 'Model', value: 'XGBoost v2.1 (PROTOTYPE)' },
                { label: 'Features Used', value: '14 inputs' },
                { label: 'Training Data', value: 'Simulated 2000–2025' },
              ].map(item => (
                <div key={item.label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>{item.label}</div>
                  <div className="font-mono font-semibold mt-0.5" style={{ fontSize: '13px', color: '#e2e8f0' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', fontSize: '11px', color: '#78716c' }}>
            <AlertCircle size={14} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
            This platform is a prototype decision-support system. Predictions are experimental and should not replace official government forecasts, warnings, evacuation orders, or emergency instructions.
          </div>
        </>
      )}

      {/* Prediction version history */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Prediction Version History — Kedarnath Valley</span>
        </div>
        <div className="font-mono mb-3" style={{ fontSize: '10px', color: '#475569' }}>IMMUTABLE AUDIT TRAIL · Every risk score is timestamped and archived</div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: '12px', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <thead>
              <tr>
                {['Version', 'Timestamp', 'Flood Prob.', 'Risk Level', 'Confidence', 'Notes'].map(h => (
                  <th key={h} className="text-left font-mono pb-2" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em', fontWeight: 500, paddingRight: 16 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictionVersions.map((pv, i) => (
                <tr key={pv.version} className="rounded-lg" style={{ background: i === 0 ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  <td className="font-mono py-2 pr-4" style={{ color: '#60a5fa', borderRadius: '8px 0 0 8px', paddingLeft: 8 }}>{pv.version}</td>
                  <td className="font-mono py-2 pr-4" style={{ color: '#64748b', fontSize: '11px' }}>{new Date(pv.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="font-mono py-2 pr-4" style={{ color: '#e2e8f0' }}>{Math.round(pv.floodProb * 100)}%</td>
                  <td className="py-2 pr-4"><RiskBadge level={pv.riskLevel} size="sm" /></td>
                  <td className="font-mono py-2 pr-4" style={{ color: '#64748b' }}>{pv.confidence}%</td>
                  <td className="py-2 pr-2" style={{ color: '#475569', borderRadius: '0 8px 8px 0' }}>{pv.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
