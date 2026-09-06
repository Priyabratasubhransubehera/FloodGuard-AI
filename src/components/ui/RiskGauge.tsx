import { RISK_COLORS, type RiskLevel } from '../../data/mockData';

interface RiskGaugeProps {
  probability: number; // 0-1
  riskLevel: RiskLevel;
  size?: number;
  label?: string;
  confidence?: number;
}

export default function RiskGauge({ probability, riskLevel, size = 120, label = 'Flood Risk', confidence }: RiskGaugeProps) {
  const pct = Math.round(probability * 100);
  const color = RISK_COLORS[riskLevel];

  const r = (size / 2) * 0.78;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -225;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle * probability;

  function polarToXY(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(start: number, end: number, rad: number) {
    const s = polarToXY(start, rad);
    const e = polarToXY(end, rad);
    const large = (end - start) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath = arcPath(startAngle, startAngle + sweepAngle, r);
  const fillPath = arcPath(startAngle, endAngle, r);
  const strokeW = size * 0.095;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeW} strokeLinecap="round" />
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`,
              transition: 'stroke-dashoffset 1s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold" style={{ fontSize: size * 0.2, color, lineHeight: 1 }}>{pct}%</span>
          <span className="font-semibold mt-1" style={{ fontSize: size * 0.085, color, letterSpacing: '0.04em' }}>{riskLevel}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-medium" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        {confidence !== undefined && (
          <div className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>Confidence: {confidence}%</div>
        )}
      </div>
    </div>
  );
}
