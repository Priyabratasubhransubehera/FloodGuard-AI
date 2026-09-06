import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Map, RefreshCw, Brain, Globe, Shield, ChevronRight } from 'lucide-react';
import type { DemoState } from '../data/mockData';

interface Props { demoState: DemoState; setDemoState: (s: DemoState) => void; }

const DISCLAIMER = 'This platform is a prototype decision-support system. Predictions are experimental and should not replace official government forecasts, warnings, evacuation orders, or emergency instructions.';

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative rounded-full transition-all"
    style={{ width: 44, height: 24, background: value ? '#1d4ed8' : 'rgba(255,255,255,0.1)', flexShrink: 0 }}
  >
    <div className="absolute rounded-full transition-all" style={{ width: 18, height: 18, top: 3, left: value ? 23 : 3, background: 'white' }} />
  </button>
);

export default function Settings({ demoState, setDemoState }: Props) {
  const [activeTab, setActiveTab] = useState('ACCOUNT');
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: false,
    whatsapp: true,
    redThreshold: 0.85,
    orangeThreshold: 0.65,
    refreshInterval: '30',
    showLandslide: true,
    showShelters: true,
    showFieldReports: true,
    aiConfidenceMin: 70,
  });

  const tabs = [
    { id: 'ACCOUNT', label: 'Account', icon: User },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'MAP', label: 'Map Layers', icon: Map },
    { id: 'REFRESH', label: 'Data Refresh', icon: RefreshCw },
    { id: 'AI', label: 'AI Settings', icon: Brain },
    { id: 'LANGUAGE', label: 'Language', icon: Globe },
    { id: 'SYSTEM', label: 'System', icon: Shield },
  ];

  const set = (k: string, v: any) => setSettings(s => ({ ...s, [k]: v }));

  return (
    <div className="page-enter flex" style={{ height: '100%' }}>
      {/* Settings sidebar */}
      <div className="flex flex-col py-4" style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
            style={{
              fontSize: '13px',
              background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#60a5fa' : '#64748b',
              borderLeft: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'ACCOUNT' && (
          <div className="flex flex-col gap-5 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>Account Settings</h2>
            {[
              { label: 'Full Name', value: 'Rajesh Kumar', type: 'text' },
              { label: 'Email', value: 'rajesh.kumar@uttarakhand.gov.in', type: 'email' },
              { label: 'Organization', value: 'Uttarakhand State Disaster Management Authority', type: 'text' },
              { label: 'Role', value: 'AUTHORITY', type: 'text' },
              { label: 'District', value: 'Chamoli', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>{f.label.toUpperCase()}</label>
                <input type={f.type} defaultValue={f.value} readOnly className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '13px' }} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'NOTIFICATIONS' && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>Notification Settings</h2>
            {[
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive RED and ORANGE alerts via email' },
              { key: 'smsAlerts', label: 'SMS Alerts', desc: 'SMS to registered mobile number' },
              { key: 'pushAlerts', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'whatsapp', label: 'WhatsApp Broadcast', desc: 'Simulated WhatsApp group notifications' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div className="font-medium" style={{ fontSize: '13px', color: '#e2e8f0' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{item.desc}</div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key, v)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'LANGUAGE' && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>Language Settings</h2>
            {[
              { code: 'EN', label: 'English', desc: 'Full UI support' },
              { code: 'HI', label: 'हिंदी (Hindi)', desc: 'Partial — key alert text translated' },
              { code: 'GA', label: 'Garhwali (placeholder)', desc: 'Regional language — planned Phase 3' },
              { code: 'KM', label: 'Kumaoni (placeholder)', desc: 'Regional language — planned Phase 3' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setDemoState({ ...demoState, language: lang.code as any })}
                className="flex items-center justify-between p-4 rounded-lg text-left transition-all"
                style={{
                  background: demoState.language === lang.code ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                  border: demoState.language === lang.code ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div>
                  <div className="font-medium" style={{ fontSize: '13px', color: '#e2e8f0' }}>{lang.label}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{lang.desc}</div>
                </div>
                {demoState.language === lang.code && <ChevronRight size={14} style={{ color: '#3b82f6' }} />}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'AI' && (
          <div className="flex flex-col gap-5 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>AI Settings</h2>
            <div>
              <label className="font-mono block mb-2" style={{ fontSize: '10px', color: '#475569' }}>RED ALERT THRESHOLD (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={99} value={Math.round(settings.redThreshold * 100)} onChange={e => set('redThreshold', Number(e.target.value) / 100)} className="flex-1" style={{ accentColor: '#ef4444' }} />
                <span className="font-mono" style={{ fontSize: '14px', color: '#ef4444', minWidth: 40 }}>{Math.round(settings.redThreshold * 100)}%</span>
              </div>
            </div>
            <div>
              <label className="font-mono block mb-2" style={{ fontSize: '10px', color: '#475569' }}>MIN CONFIDENCE TO DISPLAY (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={95} value={settings.aiConfidenceMin} onChange={e => set('aiConfidenceMin', Number(e.target.value))} className="flex-1" style={{ accentColor: '#3b82f6' }} />
                <span className="font-mono" style={{ fontSize: '14px', color: '#3b82f6', minWidth: 40 }}>{settings.aiConfidenceMin}%</span>
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.15)', fontSize: '11px', color: '#64748b' }}>
              Model: XGBoost v2.1 (PROTOTYPE) · Not a trained production model · All scores are illustrative
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>System Settings</h2>
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
              <div className="font-semibold mb-2" style={{ color: '#ef4444', fontSize: '13px' }}>⚠️ Responsible AI Disclaimer</div>
              {DISCLAIMER}
              <br /><br />
              FloodGuard AI v2.4.1 · SIH/Hackathon Prototype · Phase 1 (Frontend + Mock Data)
            </div>
            {[
              { label: 'App Version', value: 'v2.4.1-prototype' },
              { label: 'Build Phase', value: 'Phase 1 — Frontend + Mock Data' },
              { label: 'Build Date', value: '2026-09-02' },
              { label: 'Data Mode', value: 'DEMO / SIMULATED' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</span>
                <span className="font-mono" style={{ fontSize: '12px', color: '#94a3b8' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'MAP' && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>Map Layer Settings</h2>
            {[
              { key: 'showLandslide', label: 'Landslide Risk Overlay', desc: 'Show slope-correlated landslide zones' },
              { key: 'showShelters', label: 'Shelter Capacity Markers', desc: 'Show shelter occupancy on map' },
              { key: 'showFieldReports', label: 'Field Reports Layer', desc: 'Show crowd-sourced ground reports' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div className="font-medium" style={{ fontSize: '13px', color: '#e2e8f0' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{item.desc}</div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key, v)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'REFRESH' && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-bold text-white" style={{ fontSize: '16px' }}>Data Refresh Settings</h2>
            <div>
              <label className="font-mono block mb-2" style={{ fontSize: '10px', color: '#475569' }}>AUTO-REFRESH INTERVAL</label>
              <select value={settings.refreshInterval} onChange={e => set('refreshInterval', e.target.value)} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}>
                {['5', '15', '30', '60', '300'].map(v => <option key={v} value={v} style={{ background: '#0f1524' }}>Every {v < 60 ? `${v} seconds` : `${Number(v) / 60} minutes`}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
