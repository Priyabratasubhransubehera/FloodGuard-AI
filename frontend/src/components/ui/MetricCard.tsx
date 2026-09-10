import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon: ReactNode;
  iconColor?: string;
  trend?: { direction: 'up' | 'down' | 'stable'; label: string };
  alert?: boolean;
  badge?: ReactNode;
}

export default function MetricCard({ label, value, unit, subValue, icon, iconColor = '#3b82f6', trend, alert, badge }: MetricCardProps) {
  return (
    <div
      className="glass-card glass-card-hover flex flex-col gap-3 p-4"
      style={{
        borderColor: alert ? 'rgba(239,68,68,0.3)' : undefined,
        boxShadow: alert ? '0 0 20px rgba(239,68,68,0.08)' : undefined,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: `${iconColor}18` }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        {badge}
        {trend && !badge && (
          <span
            className="font-mono text-xs"
            style={{
              color: trend.direction === 'up' ? '#ef4444' : trend.direction === 'down' ? '#22c55e' : '#64748b',
              fontSize: '10px',
            }}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
          </span>
        )}
      </div>
      <div>
        <div className="font-mono font-bold leading-none" style={{ fontSize: '24px', color: alert ? '#ef4444' : '#e2e8f0' }}>
          {value}
          {unit && <span className="ml-1 font-normal" style={{ fontSize: '13px', color: '#475569' }}>{unit}</span>}
        </div>
        {subValue && <div className="mt-1" style={{ fontSize: '11px', color: '#475569' }}>{subValue}</div>}
      </div>
      <div className="font-medium uppercase tracking-widest" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}
