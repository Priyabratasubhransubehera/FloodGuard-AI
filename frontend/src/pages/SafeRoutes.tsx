import { useState } from 'react';
import { Navigation, Clock, Shield, AlertCircle, Users, Home } from 'lucide-react';
import RiskBadge from '../components/ui/RiskBadge';
import ShelterCapacityBar from '../components/ui/ShelterCapacityBar';
import { safeRoutes, shelters, villages, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

export default function SafeRoutes({ demoState }: Props) {
  const [from, setFrom] = useState('V001');
  const [to, setTo] = useState('SH001');
  const [selected, setSelected] = useState('R001');

  const selectedRoute = safeRoutes.find(r => r.id === selected) || safeRoutes[0];
  const destinationShelter = shelters.find(s => s.id === selectedRoute.shelterId);

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Safe Routes</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Decision-support route recommendations to designated shelters. These are <span className="text-yellow-500 font-semibold">prototype estimates</span> — not evacuation orders. Always follow official NDRF/SDRF guidance.
        </p>
      </div>

      {/* Selectors */}
      <div className="glass-card p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>FROM (VILLAGE)</label>
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {villages.map(v => <option key={v.id} value={v.id} style={{ background: '#0f1524' }}>{v.name}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <Navigation size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>TO (SHELTER)</label>
            <select
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {shelters.map(sh => <option key={sh.id} value={sh.id} style={{ background: '#0f1524' }}>{sh.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Route cards */}
      <div className="flex flex-col gap-3">
        {safeRoutes.map(route => (
          <button
            key={route.id}
            onClick={() => setSelected(route.id)}
            className="glass-card p-4 text-left transition-all"
            style={{
              borderColor: selected === route.id ? 'rgba(59,130,246,0.4)' : undefined,
              boxShadow: selected === route.id ? '0 0 16px rgba(59,130,246,0.08)' : undefined,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 36, height: 36, background: `${route.color}18`, border: `2px solid ${route.color}40` }}>
                <Navigation size={16} style={{ color: route.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>{route.name}</h3>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={route.riskScore} size="sm" />
                    <span className="font-mono font-bold" style={{ fontSize: '14px', color: route.safetyScore > 80 ? '#22c55e' : route.safetyScore > 65 ? '#eab308' : '#f97316' }}>
                      {route.safetyScore}/100
                    </span>
                  </div>
                </div>
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, auto) 1fr' }}>
                  <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#64748b' }}>
                    <Navigation size={12} style={{ color: '#475569' }} /> {route.distance} km
                  </div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#64748b' }}>
                    <Clock size={12} style={{ color: '#475569' }} /> ~{route.estimatedTime} min
                  </div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#64748b' }}>
                    <Shield size={12} style={{ color: '#475569' }} /> Safety: {route.safetyScore}%
                  </div>
                </div>
                {route.hazards.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {route.hazards.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#475569' }}>
                        <AlertCircle size={10} style={{ color: '#eab308', flexShrink: 0 }} /> {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Shelter capacity */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Home size={14} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Shelter Capacity</span>
          <span className="font-mono ml-2" style={{ fontSize: '10px', color: '#475569' }}>SIMULATED · Live occupancy</span>
        </div>
        <div className="flex flex-col gap-2">
          {shelters.map(sh => (
            <ShelterCapacityBar key={sh.id} name={sh.name} occupancy={sh.occupancy} capacity={sh.capacity} type={sh.type} phone={sh.contactPhone} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', fontSize: '11px', color: '#78716c' }}>
        <AlertCircle size={14} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
        <span>
          <span className="font-semibold" style={{ color: '#eab308' }}>Decision-support route recommendation only. </span>
          This is not an evacuation order. Route safety scores are prototype estimates. Always follow official NDRF/SDRF/district authority guidance. Conditions on the ground change rapidly — verify before proceeding.
        </span>
      </div>
    </div>
  );
}
