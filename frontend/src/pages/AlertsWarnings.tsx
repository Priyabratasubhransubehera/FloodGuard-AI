import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, MapPin, Send, MessageSquare, Mail, Phone, Users } from 'lucide-react';
import { alerts, notificationLogs, type Alert, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const severityColors = { RED: '#ef4444', ORANGE: '#f97316', YELLOW: '#eab308', GREEN: '#22c55e' };
const channelIcons = { SMS: Phone, EMAIL: Mail, WHATSAPP: MessageSquare, PUSH: Bell };

export default function AlertsWarnings({ demoState }: Props) {
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'HISTORY'>('ALL');
  const [alertList, setAlertList] = useState(alerts);
  const [notifList, setNotifList] = useState(notificationLogs);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filtered = tab === 'ALL' ? alertList : tab === 'ACTIVE' ? alertList.filter(a => a.status === 'ACTIVE') : alertList.filter(a => a.status !== 'ACTIVE');

  const acknowledge = (id: string) => {
    setAlertList(al => al.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
  };
  const resolve = (id: string) => {
    setAlertList(al => al.map(a => a.id === id ? { ...a, status: 'RESOLVED' as const } : a));
  };
  const sendNotif = (alert: Alert, channel: string) => {
    setSendingId(`${alert.id}-${channel}`);
    setTimeout(() => {
      setNotifList(nl => [{
        id: `NL${Date.now()}`,
        channel: channel as any,
        recipient: channel === 'WHATSAPP' ? 'District Emergency WhatsApp Group' : channel === 'SMS' ? '+91-98XXX-XXXXX (SDRF)' : channel === 'EMAIL' ? 'DM Office' : 'All Users',
        message: `[PROTOTYPE - NOT OFFICIAL] Alert: ${alert.title}. ${alert.location}. Severity: ${alert.severity}.`,
        status: 'SENT' as const,
        alertId: alert.id,
        timestamp: new Date().toISOString(),
      }, ...nl]);
      setSendingId(null);
    }, 1200);
  };

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Alerts & Warnings</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Active and historical alerts. All notifications are simulated prototypes — not official emergency warnings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {(['ALL', 'ACTIVE', 'HISTORY'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-lg px-5 py-2 font-medium transition-all"
            style={{
              fontSize: '12px',
              background: tab === t ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tab === t ? '#60a5fa' : '#475569',
              border: tab === t ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
            }}
          >
            {t} {t === 'ACTIVE' ? `(${alertList.filter(a => a.status === 'ACTIVE').length})` : ''}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(alert => {
          const color = severityColors[alert.severity];
          return (
            <div
              key={alert.id}
              className="glass-card p-4"
              style={{
                borderColor: alert.status === 'ACTIVE' ? `${color}30` : undefined,
                boxShadow: alert.status === 'ACTIVE' && (alert.severity === 'RED' || alert.severity === 'ORANGE') ? `0 0 16px ${color}10` : undefined,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Severity indicator */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ paddingTop: 2 }}>
                  <div className="relative flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: `${color}18` }}>
                    <AlertTriangle size={16} style={{ color }} />
                    {alert.status === 'ACTIVE' && (alert.severity === 'RED' || alert.severity === 'ORANGE') && (
                      <div className="absolute inset-0 rounded-full" style={{ background: `${color}30`, animation: 'pulse-ring 1.8s ease-out infinite' }} />
                    )}
                  </div>
                  <span className="font-mono" style={{ fontSize: '9px', color, letterSpacing: '0.06em' }}>{alert.severity}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold" style={{ fontSize: '13px', color: '#e2e8f0' }}>{alert.title}</h3>
                    <span
                      className="font-mono rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{
                        fontSize: '10px',
                        background: alert.status === 'ACTIVE' ? 'rgba(239,68,68,0.15)' : alert.status === 'ACKNOWLEDGED' ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)',
                        color: alert.status === 'ACTIVE' ? '#ef4444' : alert.status === 'ACKNOWLEDGED' ? '#eab308' : '#22c55e',
                      }}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1" style={{ fontSize: '11px', color: '#475569' }}>
                      <MapPin size={11} /> {alert.location}
                    </div>
                    <div className="flex items-center gap-1" style={{ fontSize: '11px', color: '#475569' }}>
                      <Users size={11} /> {alert.affectedPopulation.toLocaleString()} affected
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155' }}>
                      {new Date(alert.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {alert.status === 'ACTIVE' && (
                <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => acknowledge(alert.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                    style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <CheckCircle size={12} /> Acknowledge
                  </button>
                  <button
                    onClick={() => resolve(alert.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                    style={{ fontSize: '11px', background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <CheckCircle size={12} /> Resolve
                  </button>
                  <div className="flex items-center gap-1 ml-auto">
                    {(['SMS', 'EMAIL', 'WHATSAPP', 'PUSH'] as const).map(channel => {
                      const Icon = channelIcons[channel];
                      const isLoading = sendingId === `${alert.id}-${channel}`;
                      return (
                        <button
                          key={channel}
                          onClick={() => sendNotif(alert, channel)}
                          disabled={isLoading}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
                          style={{ fontSize: '10px', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
                          title={`Send ${channel} (PROTOTYPE — not official)`}
                        >
                          <Icon size={11} />
                          {isLoading ? '…' : channel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notification log */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Send size={14} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Simulated Notification Log</span>
          <span className="font-mono ml-2 rounded px-2 py-0.5" style={{ fontSize: '9px', background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>PROTOTYPE — NOT OFFICIAL WARNINGS</span>
        </div>
        <div className="flex flex-col gap-2">
          {notifList.slice(0, 8).map(n => {
            const Icon = channelIcons[n.channel];
            return (
              <div key={n.id} className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 28, height: 28, background: 'rgba(59,130,246,0.1)' }}>
                  <Icon size={12} style={{ color: '#60a5fa' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono" style={{ fontSize: '10px', color: '#60a5fa' }}>{n.channel}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{n.recipient}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: '9px', background: n.status === 'DELIVERED' ? 'rgba(34,197,94,0.1)' : n.status === 'SENT' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)', color: n.status === 'DELIVERED' ? '#22c55e' : n.status === 'SENT' ? '#3b82f6' : '#ef4444' }}>
                    {n.status}
                  </span>
                  <span className="font-mono" style={{ fontSize: '9px', color: '#334155' }}>{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
