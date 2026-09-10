import { AlertOctagon, X } from 'lucide-react';
import { useState } from 'react';
import type { DemoState } from '../../data/mockData';

export default function DegradedModeBanner({ demoState }: { demoState: DemoState }) {
  const [dismissed, setDismissed] = useState(false);

  const offlineSources = ['Soil Moisture Sensors (IoT)', 'Kapkot AWS Station'];
  const warningSources = ['SASE Landslide Catalog', 'Local AWS Network'];

  if (dismissed) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{
        background: 'rgba(234,179,8,0.12)',
        borderBottom: '1px solid rgba(234,179,8,0.25)',
        flexShrink: 0,
      }}
    >
      <AlertOctagon size={14} style={{ color: '#eab308', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <span className="font-semibold" style={{ fontSize: '12px', color: '#fbbf24' }}>
          DEGRADED MODE ACTIVE —
        </span>
        <span className="ml-1" style={{ fontSize: '12px', color: '#94a3b8' }}>
          {offlineSources.join(', ')} OFFLINE; {warningSources.join(', ')} delayed.
          Prediction confidence downgraded. Some risk scores use interpolated estimates.
        </span>
      </div>
      <button onClick={() => setDismissed(true)} className="ml-2 flex-shrink-0" style={{ color: '#64748b' }}>
        <X size={14} />
      </button>
    </div>
  );
}
