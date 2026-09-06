import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, CloudRain, User, ChevronDown, Zap, Globe, Moon } from 'lucide-react';
import { alerts } from '../../data/mockData';
import type { DemoState } from '../../data/mockData';

interface TopNavbarProps {
  demoState: DemoState;
  setDemoState: (s: DemoState) => void;
}

const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

const searchItems = [
  { label: 'Joshimath', type: 'Village', path: '/risk-map' },
  { label: 'Kedarnath', type: 'Village', path: '/risk-map' },
  { label: 'Alaknanda River', type: 'River', path: '/live-monitoring' },
  { label: 'Chamoli District', type: 'District', path: '/vulnerable-areas' },
  { label: 'Joshimath Relief Camp', type: 'Shelter', path: '/safe-routes' },
  { label: 'Kedarnath AWS', type: 'Station', path: '/live-monitoring' },
];

export default function TopNavbar({ demoState, setDemoState }: TopNavbarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredItems = searchQuery.length > 1
    ? searchItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggleMode = () => {
    setDemoState({
      ...demoState,
      mode: demoState.mode === 'NORMAL' ? 'HEAVY_RAIN_EVENT' : 'NORMAL',
    });
  };

  const toggleLanguage = () => {
    setDemoState({ ...demoState, language: demoState.language === 'EN' ? 'HI' : 'EN' });
  };

  return (
    <header
      className="flex items-center gap-3 px-4"
      style={{
        height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#080c18',
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={14} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search village, district, river, station, shelter…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            className="bg-transparent outline-none w-full"
            style={{ fontSize: '13px', color: '#94a3b8' }}
          />
        </div>
        {searchOpen && filteredItems.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg py-1 z-50" style={{ background: '#0f1524', border: '1px solid rgba(255,255,255,0.1)' }}>
            {filteredItems.map(item => (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setSearchQuery(''); setSearchOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
              >
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{item.label}</span>
                <span className="ml-auto font-mono" style={{ fontSize: '10px', color: '#475569' }}>{item.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Demo mode / scenario trigger */}
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            background: demoState.mode === 'HEAVY_RAIN_EVENT' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)',
            border: demoState.mode === 'HEAVY_RAIN_EVENT' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: demoState.mode === 'HEAVY_RAIN_EVENT' ? '#ef4444' : '#64748b',
          }}
        >
          <Zap size={12} className={demoState.mode === 'HEAVY_RAIN_EVENT' ? 'blink' : ''} />
          {demoState.mode === 'HEAVY_RAIN_EVENT' ? 'HEAVY RAIN EVENT' : 'DEMO MODE'}
        </button>

        {/* Weather chip */}
        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#94a3b8' }}>
          <CloudRain size={13} style={{ color: '#3b82f6' }} />
          <span className="font-mono">18.4°C · 94% RH</span>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#64748b' }}
        >
          <Globe size={13} />
          <span className="font-mono font-medium" style={{ fontSize: '11px' }}>{demoState.language}</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell size={15} style={{ color: '#64748b' }} />
            <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold" style={{ width: 16, height: 16, background: '#ef4444', fontSize: '9px', color: 'white' }}>{activeAlerts.length}</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl py-2 z-50" style={{ background: '#0f1524', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="px-4 py-2 font-semibold" style={{ fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>ACTIVE ALERTS ({activeAlerts.length})</div>
              {activeAlerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="px-4 py-3 hover:bg-white/5 cursor-pointer" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: alert.severity === 'RED' ? '#ef4444' : alert.severity === 'ORANGE' ? '#f97316' : '#eab308' }} />
                    <span className="font-medium" style={{ fontSize: '12px', color: '#e2e8f0' }}>{alert.title}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#475569' }}>{alert.location}</p>
                </div>
              ))}
              <button onClick={() => { navigate('/alerts'); setNotifOpen(false); }} className="w-full py-2 text-center" style={{ fontSize: '11px', color: '#3b82f6' }}>View all alerts →</button>
            </div>
          )}
        </div>

        {/* Dark mode indicator */}
        <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Moon size={14} style={{ color: '#64748b' }} />
        </div>

        {/* User profile */}
        <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)' }}>
            <User size={12} className="text-white" />
          </div>
          <div className="text-left">
            <div style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: 600 }}>Rajesh Kumar</div>
            <div className="font-mono" style={{ fontSize: '9px', color: '#06b6d4', letterSpacing: '0.08em' }}>AUTHORITY</div>
          </div>
          <ChevronDown size={12} style={{ color: '#475569' }} />
        </button>
      </div>
    </header>
  );
}
