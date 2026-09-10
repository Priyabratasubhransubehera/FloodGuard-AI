import { RISK_COLORS, RISK_BG, type RiskLevel } from '../../data/mockData';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export default function RiskBadge({ level, size = 'md', dot = false }: RiskBadgeProps) {
  const fontSize = size === 'sm' ? '10px' : size === 'lg' ? '13px' : '11px';
  const px = size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px';
  const py = size === 'sm' ? '2px' : size === 'lg' ? '4px' : '3px';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded font-mono font-semibold"
      style={{
        fontSize,
        padding: `${py} ${px}`,
        color: RISK_COLORS[level],
        background: RISK_BG[level],
        letterSpacing: '0.06em',
        border: `1px solid ${RISK_COLORS[level]}30`,
      }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_COLORS[level], flexShrink: 0 }} />}
      {level}
    </span>
  );
}
