import { useState } from 'react';
import { Database, CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { dataSources } from '../data/mockData';

const statusIcons = {
  ACTIVE: <CheckCircle size={14} style={{ color: '#22c55e' }} />,
  WARNING: <AlertTriangle size={14} style={{ color: '#eab308' }} />,
  OFFLINE: <XCircle size={14} style={{ color: '#ef4444' }} />,
};
const statusColors = { ACTIVE: '#22c55e', WARNING: '#eab308', OFFLINE: '#ef4444' };

export default function DataSources() {
  const [sources, setSources] = useState(dataSources);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const refresh = (id: string) => {
    setRefreshing(id);
    setTimeout(() => {
      setSources(s => s.map(ds => ds.id === id ? { ...ds, lastUpdated: new Date().toISOString() } : ds));
      setRefreshing(null);
    }, 1500);
  };

  const active = sources.filter(s => s.status === 'ACTIVE').length;
  const warn = sources.filter(s => s.status === 'WARNING').length;
  const offline = sources.filter(s => s.status === 'OFFLINE').length;

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Data Sources</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Status of all data feeds connected to FloodGuard AI. Offline or degraded sources reduce prediction confidence.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Active Sources', value: active, color: '#22c55e', icon: CheckCircle },
          { label: 'Warning / Delayed', value: warn, color: '#eab308', icon: AlertTriangle },
          { label: 'Offline Sources', value: offline, color: '#ef4444', icon: XCircle },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, background: `${s.color}18` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div className="font-mono font-bold" style={{ fontSize: '28px', color: s.color }}>{s.value}</div>
              <div className="font-medium uppercase tracking-widest" style={{ fontSize: '10px', color: '#475569' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Source cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
        {sources.map(ds => (
          <div
            key={ds.id}
            className="glass-card p-4"
            style={{
              borderColor: ds.status === 'OFFLINE' ? 'rgba(239,68,68,0.25)' : ds.status === 'WARNING' ? 'rgba(234,179,8,0.2)' : undefined,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {statusIcons[ds.status]}
                <span className="font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>{ds.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono rounded-full px-2 py-0.5"
                  style={{ fontSize: '10px', color: statusColors[ds.status], background: `${statusColors[ds.status]}18`, border: `1px solid ${statusColors[ds.status]}30` }}
                >
                  {ds.status}
                </span>
                <button
                  onClick={() => refresh(ds.id)}
                  disabled={refreshing === ds.id}
                  className="p-1 rounded transition-colors hover:bg-white/5"
                  style={{ color: '#475569' }}
                >
                  <RefreshCw size={12} className={refreshing === ds.id ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>{ds.description}</p>

            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: 'Type', value: ds.type.replace(/_/g, ' ') },
                { label: 'Update Freq', value: ds.updateFreq },
                { label: 'Coverage', value: ds.coverage },
                { label: 'Latency', value: ds.latency },
              ].map(item => (
                <div key={item.label} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>{item.label}</div>
                  <div className="font-mono" style={{ fontSize: '11px', color: '#94a3b8' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="font-mono" style={{ fontSize: '10px', color: '#334155' }}>
                Last updated: {new Date(ds.lastUpdated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
              {ds.status === 'OFFLINE' && (
                <span className="font-mono" style={{ fontSize: '10px', color: '#ef4444' }}>
                  ⚠️ Degraded mode active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="font-mono text-center" style={{ fontSize: '10px', color: '#334155' }}>
        DEMO / SIMULATED data source status · In production, these would connect to live IMD, CWC, and ISRO APIs
      </div>
    </div>
  );
}
