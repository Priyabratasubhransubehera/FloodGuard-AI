import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Map, Brain, Lightbulb, AlertTriangle,
  Bell, Navigation, FlaskConical, Satellite, History, FileText,
  Database, Settings, HelpCircle, Radio, Wifi, WifiOff,
  ChevronRight, Shield
} from 'lucide-react';
import { stations } from '../../data/mockData';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/live-monitoring', icon: Activity, label: 'Live Monitoring' },
  { path: '/risk-map', icon: Map, label: 'Risk Map' },
  { path: '/ai-prediction', icon: Brain, label: 'AI Prediction' },
  { path: '/explainable-ai', icon: Lightbulb, label: 'Explainable AI' },
  { path: '/vulnerable-areas', icon: AlertTriangle, label: 'Vulnerable Areas' },
  { path: '/alerts', icon: Bell, label: 'Alerts & Warnings' },
  { path: '/safe-routes', icon: Navigation, label: 'Safe Routes' },
  { path: '/flood-simulator', icon: FlaskConical, label: 'Flood Simulator' },
  { path: '/satellite', icon: Satellite, label: 'Satellite Monitoring' },
  { path: '/historical', icon: History, label: 'Historical Analysis' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/data-sources', icon: Database, label: 'Data Sources' },
  { path: '/field-reports', icon: Radio, label: 'Field Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/help', icon: HelpCircle, label: 'Help & Support' },
];

const onlineCount = stations.filter(s => s.status === 'ONLINE').length;
const totalCount = stations.length;

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className="relative flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '240px',
        background: '#080c18',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative flex-shrink-0" style={{ width: 32, height: 32 }}>
          <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)' }} />
          <Shield size={18} className="absolute inset-0 m-auto text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-white" style={{ fontSize: '13px', letterSpacing: '0.05em', lineHeight: 1.1 }}>FLOODGUARD</div>
            <div className="font-mono text-xs" style={{ color: '#06b6d4', fontSize: '9px', letterSpacing: '0.12em' }}>AI · EARLY WARNING</div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 z-10 flex items-center justify-center rounded-full border transition-colors"
        style={{
          width: 22, height: 22,
          background: '#080c18',
          borderColor: 'rgba(255,255,255,0.12)',
          color: '#64748b',
        }}
      >
        <ChevronRight size={12} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 mx-2 my-0.5 rounded-lg transition-all duration-150 group"
              style={{
                padding: collapsed ? '10px 16px' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: isActive ? '#60a5fa' : '#64748b',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                textDecoration: 'none',
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap" style={{ fontSize: '13px' }}>
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Status footer */}
      {!collapsed && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs" style={{ color: '#475569', fontSize: '10px', letterSpacing: '0.08em' }}>STATION NETWORK</span>
            <div className="flex items-center gap-1">
              <Wifi size={10} style={{ color: '#22c55e' }} />
              <span className="font-mono" style={{ fontSize: '10px', color: '#22c55e' }}>{onlineCount}/{totalCount}</span>
            </div>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${(onlineCount / totalCount) * 100}%`, background: '#22c55e' }} />
          </div>
          <div className="mt-2 font-mono text-xs" style={{ color: '#334155', fontSize: '9px' }}>
            DEMO / SIMULATED DATA · v2.4.1
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <WifiOff size={14} style={{ color: '#334155' }} />
        </div>
      )}
    </aside>
  );
}
