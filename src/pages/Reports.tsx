import { useState } from 'react';
import { FileText, Download, AlertCircle, CheckCircle, FilePdf } from 'lucide-react';
import { jsPDF } from 'jspdf';
import RiskBadge from '../components/ui/RiskBadge';
import { alerts, villages, dataSources, type DemoState } from '../data/mockData';

interface Props { demoState: DemoState; }

const DISCLAIMER = 'This platform is a prototype decision-support system. Predictions are experimental and should not replace official government forecasts, warnings, evacuation orders, or emergency instructions.';

function buildPDF(demoState: DemoState, district: string): jsPDF {
  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const PW = 210;
  const PH = 297;
  const ML = 18, MR = 18, MT = 18;
  const CW = PW - ML - MR;
  let y = MT;

  const nl = (n = 5) => { y += n; };
  const line = () => { doc.setLineWidth(0.2); doc.setDrawColor(40, 60, 100); doc.line(ML, y, PW - MR, y); nl(4); };
  const sectionHeader = (title: string) => {
    doc.setFillColor(15, 25, 50);
    doc.rect(ML, y, CW, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(96, 165, 250);
    doc.setFont('helvetica', 'bold');
    doc.text(title, ML + 3, y + 5.5);
    y += 10;
  };

  // Cover header bar
  doc.setFillColor(10, 25, 60);
  doc.rect(0, 0, PW, 28, 'F');
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, 6, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FLOODGUARD AI', 12, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('FLOOD SITUATION REPORT  ·  PROTOTYPE DECISION-SUPPORT SYSTEM', 12, 17);
  doc.setTextColor(239, 68, 68);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('⚠  ALL DATA IS DEMO / SIMULATED  ·  NOT AN OFFICIAL GOVERNMENT DOCUMENT', 12, 23);

  y = 36;

  // Meta row
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const now = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
  doc.text(`Report Generated: ${now}`, ML, y);
  doc.text(`District: ${district}`, ML + 105, y);
  nl(6);
  doc.text(`Report Version: v4 (Prototype)`, ML, y);
  doc.text(`Period: 02 September 2026, 00:00–06:15 IST`, ML + 105, y);
  nl(3);
  line();

  // Executive summary
  sectionHeader('EXECUTIVE SUMMARY');
  const riskLabel = isHeavy ? 'EXTREME' : 'HIGH';
  const floodPct = isHeavy ? '93' : '62';
  const landPct = isHeavy ? '74' : '48';

  const summaryRows = [
    ['Overall Risk Level', riskLabel],
    ['Flood Probability (Kedarnath Valley, +6h)', `${floodPct}%`],
    ['Landslide Probability (Joshimath)', `${landPct}%`],
    ['Active Alerts', `${alerts.filter(a => a.status === 'ACTIVE').length} (${alerts.filter(a => a.severity === 'RED' && a.status === 'ACTIVE').length} RED)`],
    ['Estimated At-Risk Population', '32,580'],
    ['Model Confidence', '87%'],
  ];
  summaryRows.forEach(([k, v]) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(203, 213, 225);
    doc.text(k, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(riskLabel === 'EXTREME' && k === 'Overall Risk Level' ? '#ef4444' : 226, 232, 240);
    if (k === 'Overall Risk Level') doc.setTextColor(239, 68, 68);
    else doc.setTextColor(226, 232, 240);
    doc.text(v, ML + 95, y);
    nl(5.5);
  });
  nl(2);
  line();

  // Rainfall & hydrology
  sectionHeader('RAINFALL & HYDROLOGY  (SIMULATED)');
  const hydro = [
    ['Current Rainfall — Kedarnath AWS', `${isHeavy ? '62.7' : '18.4'} mm/hr`],
    ['24h Cumulative Rainfall', `${isHeavy ? '312' : '142'} mm`],
    ['Mandakini River @ Rudraprayag', `${isHeavy ? '5.3m' : '3.1m'}  (Warning: 5.0m | Danger: 6.5m)`],
    ['Alaknanda River @ Chamoli', `4.8m  (Warning: 5.0m)`],
    ['Soil Moisture — Munsiyari Ridge', '78%  (Threshold: 80%)'],
    ['Relative Humidity', '94%'],
  ];
  hydro.forEach(([k, v]) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(148, 163, 184);
    doc.text(k, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.text(v, ML + 95, y);
    nl(5.5);
  });
  nl(2);
  line();

  // Vulnerable villages
  sectionHeader('TOP VULNERABLE VILLAGES');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  ['Village', 'Vulnerability', 'Risk Level', 'Population', 'Flood Prob.', 'Landslide Prob.'].forEach((h, i) => {
    doc.text(h, ML + [0, 40, 72, 102, 130, 154][i], y);
  });
  nl(5);
  doc.setLineWidth(0.1);
  doc.setDrawColor(30, 45, 74);
  doc.line(ML, y, PW - MR, y);
  nl(3);
  villages.slice(0, 6).sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore).forEach(v => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(226, 232, 240);
    doc.text(v.name, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(String(v.vulnerabilityScore), ML + 40, y);
    doc.setTextColor(v.riskLevel === 'EXTREME' ? 239 : v.riskLevel === 'VERY HIGH' ? 239 : 249, v.riskLevel === 'EXTREME' ? 68 : v.riskLevel === 'VERY HIGH' ? 68 : 115, 22);
    doc.text(v.riskLevel, ML + 72, y);
    doc.setTextColor(148, 163, 184);
    doc.text(v.population.toLocaleString(), ML + 102, y);
    doc.text(`${Math.round(v.floodProbability * 100)}%`, ML + 130, y);
    doc.text(`${Math.round(v.landslideProbability * 100)}%`, ML + 154, y);
    nl(5.5);
  });
  nl(2);
  line();

  // AI Prediction summary
  sectionHeader('AI PREDICTION SUMMARY  (ILLUSTRATIVE)');
  const aiRows = [
    ['Model', 'XGBoost v2.1  (PROTOTYPE — not trained on real data)'],
    ['Primary Risk Driver', 'Cumulative 24h rainfall exceeding 300mm trigger threshold'],
    ['Secondary Driver', 'Rapid river level rise: +1.8m in 6h on Mandakini'],
    ['Tertiary Driver', 'Soil saturation >85% on slopes >30°'],
    ['Confidence Score', '87%  (downgraded: soil sensor network OFFLINE)'],
    ['Feature Contributions', 'Illustrative — not real SHAP values (Phase 3)'],
  ];
  aiRows.forEach(([k, v]) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(148, 163, 184);
    doc.text(k, ML, y, { maxWidth: 88 });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.text(v, ML + 95, y, { maxWidth: CW - 95 });
    nl(5.5);
  });
  nl(2);
  line();

  // Recommended priorities
  sectionHeader('RECOMMENDED PRIORITIES');
  const prios = [
    ['IMMEDIATE', 'Activate evacuation advisory for Kedarnath Valley low-lying zones'],
    ['URGENT', 'Pre-position SDRF teams at Joshimath and Gauchar staging areas'],
    ['URGENT', 'Monitor Alaknanda — approaching 5.0m warning level'],
    ['ACTION', 'Alert Munsiyari residents to landslide risk on NH-9 slopes'],
    ['MONITOR', 'Kapkot area — sensor offline; deploy ground verification team'],
    ['COMMS', 'Activate WhatsApp broadcast to district emergency WhatsApp groups'],
  ];
  prios.forEach(([tag, text]) => {
    const tagColor: Record<string, [number,number,number]> = {
      IMMEDIATE: [239,68,68], URGENT: [249,115,22], ACTION: [234,179,8], MONITOR: [59,130,246], COMMS: [168,85,247],
    };
    const [r,g,b] = tagColor[tag] || [100,116,139];
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r,g,b);
    doc.text(`[${tag}]`, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(text, ML + 28, y, { maxWidth: CW - 28 });
    nl(5.5);
  });
  nl(2);
  line();

  // Data sources
  sectionHeader('ACTIVE DATA SOURCES');
  dataSources.forEach(ds => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const sc: Record<string,[number,number,number]> = { ACTIVE:[34,197,94], WARNING:[234,179,8], OFFLINE:[239,68,68] };
    const [r,g,b] = sc[ds.status];
    doc.setTextColor(r,g,b);
    doc.text(`● ${ds.status}`, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(ds.name, ML + 22, y);
    doc.setTextColor(71, 85, 105);
    doc.text(`Updated: ${ds.lastUpdated.slice(0,16)}`, ML + 110, y);
    nl(5);
  });
  nl(2);
  line();

  // Disclaimer footer
  if (y > PH - 40) { doc.addPage(); y = 20; }
  doc.setFillColor(30, 15, 15);
  doc.rect(ML, y, CW, 28, 'F');
  doc.setFillColor(239, 68, 68);
  doc.rect(ML, y, 3, 28, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text('⚠  MANDATORY DISCLAIMER', ML + 6, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER, CW - 10);
  doc.text(disclaimerLines, ML + 6, y + 12);
  y += 32;
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text(`FloodGuard AI v2.4.1  ·  Prototype  ·  SIH/Hackathon Submission  ·  Generated ${new Date().toISOString()}`, ML, y);

  return doc;
}

export default function Reports({ demoState }: Props) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [district, setDistrict] = useState('Chamoli & Rudraprayag');
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);

  const isHeavy = demoState.mode === 'HEAVY_RAIN_EVENT';
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const doc = buildPDF(demoState, district);
      setPdfDoc(doc);
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };

  const handleDownloadPDF = () => {
    if (!pdfDoc) return;
    pdfDoc.save(`FloodGuard_Report_${district.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="page-enter flex flex-col gap-5 p-5 overflow-y-auto" style={{ height: '100%' }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Reports</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Generate structured flood situation reports as downloadable PDFs. All reports carry mandatory disclaimers and are labeled PROTOTYPE / SIMULATED.
        </p>
      </div>

      {/* Generate form */}
      <div className="glass-card p-5">
        <div className="font-semibold text-white mb-4" style={{ fontSize: '13px' }}>Generate Flood Situation Report</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>DISTRICT / AREA</label>
            <select
              value={district}
              onChange={e => { setDistrict(e.target.value); setGenerated(false); }}
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}
            >
              {['Chamoli & Rudraprayag', 'Chamoli', 'Rudraprayag', 'Tehri Garhwal', 'Pithoragarh', 'Bageshwar'].map(d => (
                <option key={d} value={d} style={{ background: '#0f1524' }}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono block mb-1" style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>REPORT TYPE</label>
            <select className="w-full rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '13px' }}>
              {['Flood Situation Report', 'Landslide Risk Summary', 'Event Debrief', 'Preparedness Assessment'].map(t => (
                <option key={t} value={t} style={{ background: '#0f1524' }}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 rounded-lg px-5 py-2 font-semibold transition-all"
              style={{
                background: generating ? 'rgba(59,130,246,0.15)' : '#1d4ed8',
                color: generating ? '#64748b' : 'white',
                fontSize: '13px',
                border: '1px solid rgba(59,130,246,0.3)',
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? (
                <><div className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />Composing PDF…</>
              ) : (
                <><FileText size={14} />Generate Report</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated report preview */}
      {generated && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: '#22c55e' }} />
              <span className="font-semibold text-white" style={{ fontSize: '13px' }}>Report Ready — Dark-themed PDF</span>
              <span className="font-mono rounded px-2 py-0.5" style={{ fontSize: '9px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>PROTOTYPE</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all font-semibold"
              style={{ fontSize: '12px', background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <Download size={14} /> Download PDF
            </button>
          </div>

          {/* Report preview */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#06080f', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* PDF header preview */}
            <div className="flex items-center gap-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 6, background: '#1d4ed8', alignSelf: 'stretch', flexShrink: 0 }} />
              <div className="px-5 py-4" style={{ background: 'rgba(10,25,60,0.8)', flex: 1 }}>
                <div className="font-bold text-white" style={{ fontSize: '15px', letterSpacing: '0.04em' }}>FLOODGUARD AI</div>
                <div className="font-mono" style={{ fontSize: '10px', color: '#94a3b8', marginTop: 2 }}>FLOOD SITUATION REPORT  ·  PROTOTYPE DECISION-SUPPORT SYSTEM</div>
                <div className="font-mono font-bold" style={{ fontSize: '9px', color: '#ef4444', marginTop: 3 }}>⚠  ALL DATA IS DEMO / SIMULATED  ·  NOT AN OFFICIAL GOVERNMENT DOCUMENT</div>
              </div>
            </div>

            <div className="p-5 font-mono" style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>
              {/* Meta */}
              <div className="grid gap-0 mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {[
                  ['Report Generated', new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })],
                  ['District', district],
                  ['Report Version', 'v4 (Prototype)'],
                  ['Period', '02 Sep 2026 · 00:00–06:15 IST'],
                ].map(([k, v]) => (
                  <div key={k}><span style={{ color: '#334155' }}>{k}: </span><span style={{ color: '#e2e8f0' }}>{v}</span></div>
                ))}
              </div>

              {/* Executive summary */}
              <div className="rounded-lg px-3 py-2 mb-4" style={{ background: 'rgba(15,25,50,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="font-bold mb-2" style={{ fontSize: '10px', color: '#60a5fa', letterSpacing: '0.1em' }}>EXECUTIVE SUMMARY</div>
                {[
                  ['Overall Risk Level', isHeavy ? 'EXTREME 🔴' : 'HIGH 🟠', isHeavy ? '#ef4444' : '#f97316'],
                  ['Flood Probability', `${isHeavy ? 93 : 62}% (Kedarnath Valley, +6h)`, '#e2e8f0'],
                  ['Landslide Probability', `${isHeavy ? 74 : 48}% (Joshimath slopes)`, '#e2e8f0'],
                  ['Active Alerts', `${activeAlerts.length} (${activeAlerts.filter(a => a.severity === 'RED').length} RED · ${activeAlerts.filter(a => a.severity === 'ORANGE').length} ORANGE)`, '#e2e8f0'],
                  ['At-Risk Population', '32,580', '#e2e8f0'],
                  ['Model Confidence', '87%', '#e2e8f0'],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex gap-3">
                    <span style={{ minWidth: 200, color: '#475569' }}>{k}</span>
                    <span style={{ color: c as string }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Priorities */}
              <div className="rounded-lg px-3 py-2 mb-4" style={{ background: 'rgba(15,25,50,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="font-bold mb-2" style={{ fontSize: '10px', color: '#60a5fa', letterSpacing: '0.1em' }}>RECOMMENDED PRIORITIES</div>
                {[
                  ['IMMEDIATE', '#ef4444', 'Activate evacuation advisory for Kedarnath Valley'],
                  ['URGENT', '#f97316', 'Pre-position SDRF at Joshimath & Gauchar staging areas'],
                  ['ACTION', '#eab308', 'Alert Munsiyari residents to landslide risk NH-9'],
                  ['MONITOR', '#3b82f6', 'Kapkot sensor offline — deploy verification team'],
                ].map(([tag, col, text]) => (
                  <div key={tag} className="flex gap-2">
                    <span className="font-bold" style={{ color: col as string, minWidth: 76 }}>[{tag}]</span>
                    <span style={{ color: '#cbd5e1' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimer box */}
              <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(30,15,15,0.8)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div className="font-bold mb-1" style={{ fontSize: '10px', color: '#ef4444' }}>⚠ MANDATORY DISCLAIMER</div>
                <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.5 }}>{DISCLAIMER}</div>
                <div className="mt-1" style={{ fontSize: '9px', color: '#334155' }}>FloodGuard AI v2.4.1 · Prototype · SIH/Hackathon Submission</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', fontSize: '11px', color: '#78716c' }}>
        <AlertCircle size={14} style={{ color: '#eab308', flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong style={{ color: '#eab308' }}>Required disclaimer: </strong>
          {DISCLAIMER} All generated reports are labeled PROTOTYPE and SIMULATED. Do not distribute as official government documents.
        </span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
