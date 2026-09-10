interface ShelterCapacityBarProps {
  name: string;
  occupancy: number;
  capacity: number;
  type: string;
  phone?: string;
}

export default function ShelterCapacityBar({ name, occupancy, capacity, type, phone }: ShelterCapacityBarProps) {
  const pct = Math.round((occupancy / capacity) * 100);
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f97316' : '#22c55e';

  return (
    <div className="glass-card p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium" style={{ fontSize: '12px', color: '#e2e8f0' }}>{name}</div>
          <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>{type}{phone && ` · ${phone}`}</div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold" style={{ fontSize: '14px', color }}>{pct}%</div>
          <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>{occupancy}/{capacity}</div>
        </div>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
