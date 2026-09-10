import { useState } from 'react';
import { Radio, Camera, Send, CheckCircle, AlertCircle, MapPin, Clock, User } from 'lucide-react';
import { fieldReports as initialReports, type FieldReport } from '../data/mockData';

const severityColors = { LOW: '#22c55e', MEDIUM: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };
const statusColors = { UNVERIFIED: '#eab308', CONFIRMED: '#3b82f6', RESOLVED: '#22c55e' };

export default function FieldReports() {
  const [reports, setReports] = useState<FieldReport[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ location: '', lat: '', lng: '', description: '', severity: 'MEDIUM' as const, reporterName: '', reporterRole: '' });
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNVERIFIED' | 'CONFIRMED' | 'RESOLVED'>('ALL');

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);

  const submit = () => {
    if (!form.location || !form.description || !form.reporterName) return;
    const newReport: FieldReport = {
      id: `FR${Date.now()}`,
      reporterName: form.reporterName,
      reporterRole: form.reporterRole || 'Community Member',
      location: form.location,
      lat: parseFloat(form.lat) || 30.4,
      lng: parseFloat(form.lng) || 79.3,
      description: form.description,
      severity: form.severity,
      status: 'UNVERIFIED',
      timestamp: new Date().toISOString(),
    };
    setReports(r => [newReport, ...r]);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ location: '', lat: '', lng: '', description: '', severity: 'MEDIUM', reporterName: '', reporterRole: '' });
  };

  const updateStatus = (id: string, status: FieldReport['status']) => {
    setReports(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Field Reports</h1>
          <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
            Crowd-sourced ground truth from verified field personnel. Reports feed the model feedback loop and appear on the Risk Map as purple markers.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all"
          style={{ fontSize: '12px', background: '#1d4ed8', color: 'white', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <Radio size={14} /> Submit Report
        </button>
      </div>

      {/* Success toast */}
      {submitted && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-3 toast-enter" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '12px', color: '#22c55e' }}>
          <CheckCircle size={14} /> Report submitted. Status: UNVERIFIED. A coordinator will verify within 30 minutes.
        </div>
      )}

      {/* Submit form */}
      {showForm && (
        <div className="glass-card p-5">
          <div className="font-semibold text-white mb-4" style={{ fontSize: '13px' }}>Submit Field Report</div>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>YOUR NAME *</label>
              <input type="text" placeholder="Full name" value={form.reporterName} onChange={e => setForm(f => ({ ...f, reporterName: e.target.value }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div>
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>ROLE / ORGANIZATION</label>
              <input type="text" placeholder="e.g. Village Head, SDRF Scout" value={form.reporterRole} onChange={e => setForm(f => ({ ...f, reporterRole: e.target.value }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div className="col-span-2">
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>LOCATION DESCRIPTION *</label>
              <input type="text" placeholder="e.g. NH-7 near Joshimath Chowk, Pindar river crossing Tharali" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div>
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>LATITUDE (optional)</label>
              <input type="text" placeholder="e.g. 30.565" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div>
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>LONGITUDE (optional)</label>
              <input type="text" placeholder="e.g. 79.572" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div className="col-span-2">
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>OBSERVATION / DESCRIPTION *</label>
              <textarea placeholder="Describe what you observed — water level, road conditions, people affected, etc." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-lg px-3 py-2 outline-none resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }} />
            </div>
            <div>
              <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569' }}>SEVERITY</label>
              <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value as any }))} className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}>
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(s => <option key={s} value={s} style={{ background: '#0f1524' }}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Camera size={13} /> Attach Photo (mock)
              </button>
              <button onClick={submit} className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold ml-auto" style={{ fontSize: '12px', background: '#1d4ed8', color: 'white' }}>
                <Send size={13} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {(['ALL', 'UNVERIFIED', 'CONFIRMED', 'RESOLVED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-lg px-4 py-2 font-medium transition-all"
            style={{
              fontSize: '12px',
              background: filter === f ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: filter === f ? '#60a5fa' : '#475569',
              border: filter === f ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
            }}
          >
            {f} {f === 'ALL' ? `(${reports.length})` : `(${reports.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(report => (
          <div
            key={report.id}
            className="glass-card p-4"
            style={{
              borderColor: report.status === 'UNVERIFIED' ? 'rgba(234,179,8,0.2)' : report.status === 'CONFIRMED' ? 'rgba(59,130,246,0.2)' : undefined,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 36, height: 36, background: `${severityColors[report.severity]}18` }}>
                <Radio size={16} style={{ color: severityColors[report.severity] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: '10px', color: severityColors[report.severity], background: `${severityColors[report.severity]}18` }}>{report.severity}</span>
                    <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: '10px', color: statusColors[report.status], background: `${statusColors[report.status]}18` }}>{report.status}</span>
                    {report.linkedAlertId && <span className="font-mono" style={{ fontSize: '10px', color: '#475569' }}>→ Alert {report.linkedAlertId}</span>}
                  </div>
                  <span className="font-mono" style={{ fontSize: '10px', color: '#334155' }}>{new Date(report.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center gap-1 mb-1" style={{ fontSize: '12px', color: '#60a5fa' }}>
                  <MapPin size={11} /> {report.location}
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{report.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <User size={11} style={{ color: '#475569' }} />
                  <span style={{ fontSize: '11px', color: '#475569' }}>{report.reporterName} · {report.reporterRole}</span>
                </div>
              </div>
            </div>

            {report.status !== 'RESOLVED' && (
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {report.status === 'UNVERIFIED' && (
                  <button onClick={() => updateStatus(report.id, 'CONFIRMED')} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ fontSize: '11px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <CheckCircle size={11} /> Confirm
                  </button>
                )}
                <button onClick={() => updateStatus(report.id, 'RESOLVED')} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ fontSize: '11px', background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle size={11} /> Mark Resolved
                </button>
                <span className="ml-auto font-mono" style={{ fontSize: '10px', color: '#334155' }}>
                  {report.lat.toFixed(4)}°N, {report.lng.toFixed(4)}°E
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
