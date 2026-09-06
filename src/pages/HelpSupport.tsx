import { HelpCircle, BookOpen, Phone, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const DISCLAIMER = 'This platform is a prototype decision-support system. Predictions are experimental and should not replace official government forecasts, warnings, evacuation orders, or emergency instructions.';

const glossary = [
  { term: 'Flood Probability', def: 'The estimated likelihood (0–100%) that a flash flood will occur at the given location within the specified time horizon, as output by the prototype ML model.' },
  { term: 'Risk Level (LOW–EXTREME)', def: 'A five-tier classification derived from flood probability: LOW (<25%), MODERATE (25–45%), HIGH (45–65%), VERY HIGH (65–85%), EXTREME (>85%). Always paired with text — never shown as color alone.' },
  { term: 'Illustrative Feature Contribution', def: 'A simulated SHAP-like breakdown showing which environmental factors most influenced the model\'s risk score. NOT computed by a real trained SHAP explainer in this prototype.' },
  { term: 'Vulnerability Score (0–100)', def: 'A composite index integrating flood probability, slope, population density, elevation, distance to water body, and historical event frequency. Higher = more vulnerable.' },
  { term: 'Degraded Mode', def: 'Activated when one or more data sources are OFFLINE or significantly delayed. Predictions revert to interpolated estimates and confidence scores are reduced.' },
  { term: 'CWC', def: 'Central Water Commission — India\'s apex body for hydrological data. Source of river level gauge readings in Phase 3.' },
  { term: 'IMD', def: 'India Meteorological Department — source of operational rainfall forecasts and gridded precipitation data.' },
  { term: 'SDRF', def: 'State Disaster Response Force — the first-responder agency for state-level disaster events.' },
  { term: 'NDRF', def: 'National Disaster Response Force — the national rapid-response search-and-rescue team.' },
  { term: 'PostGIS / GeoJSON', def: 'Geospatial database extensions used in Phase 3 to store and query village polygons, flood inundation zones, and watershed boundaries.' },
  { term: 'SAR (Synthetic Aperture Radar)', def: 'Microwave satellite imaging that penetrates cloud cover and can map inundated areas in near-real-time. Used by ISRO Bhuvan Flood Monitoring Service.' },
];

const faqs = [
  { q: 'Are these predictions official government warnings?', a: 'No. This is a prototype decision-support tool built for a hackathon/SIH submission. All predictions are experimental estimates from a prototype ML model. Official warnings come from IMD, CWC, SDMA, and district administration.' },
  { q: 'Why is the model labeled "ILLUSTRATIVE"?', a: 'The feature contribution scores (similar to SHAP values) shown in Explainable AI are computed by a simplified simulated model, not a real XGBoost model trained on historical flood data. Phase 3 roadmap includes real model training.' },
  { q: 'What does "Degraded Mode" mean?', a: 'When one or more data sources go OFFLINE (e.g., the Kapkot AWS or Soil Moisture IoT sensors), the system switches to Degraded Mode. Predictions for affected areas use interpolated estimates and confidence scores are reduced. A banner appears at the top of every page.' },
  { q: 'How often is data refreshed?', a: 'In this prototype, data is simulated and refreshes every 5–30 seconds (configurable in Settings). In Phase 3, IMD data updates every 15 minutes, CWC every hour, and satellite every 6 hours.' },
  { q: 'How do I submit a field report?', a: 'Go to Field Reports in the sidebar. Enter your location, describe what you observed, select severity, and optionally attach a photo. Submitted reports appear on the Risk Map as purple markers.' },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openGlossary, setOpenGlossary] = useState<number | null>(null);

  return (
    <div className="page-enter flex flex-col gap-6 p-5 overflow-y-auto" style={{ height: '100%', maxWidth: 800 }}>
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '18px' }}>Help & Support</h1>
        <p className="mt-1" style={{ fontSize: '12px', color: '#475569' }}>
          Usage guide, glossary, contact information, and the responsible AI disclaimer.
        </p>
      </div>

      {/* Responsible AI disclaimer */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          <span className="font-bold" style={{ fontSize: '14px', color: '#ef4444' }}>Responsible AI Disclaimer — Required Reading</span>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
          {DISCLAIMER}
        </p>
        <div className="mt-3" style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
          <strong style={{ color: '#94a3b8' }}>This system is intended for:</strong>
          <ul className="mt-1 ml-4 list-disc">
            <li>Demonstrating AI-driven decision support for disaster risk reduction</li>
            <li>Hackathon/SIH evaluation and prototype feedback</li>
            <li>Understanding the potential of real-time data integration for flood early warning</li>
          </ul>
          <strong className="mt-2 block" style={{ color: '#94a3b8' }}>This system must NOT be used for:</strong>
          <ul className="mt-1 ml-4 list-disc">
            <li>Issuing public evacuation orders or emergency instructions</li>
            <li>Replacing official IMD, CWC, or NDMA communications</li>
            <li>Making resource allocation decisions in real emergencies without official verification</li>
          </ul>
        </div>
      </div>

      {/* Quick guide */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '14px' }}>Usage Guide</span>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { step: '1', title: 'Monitor Dashboard', desc: 'The Dashboard shows live metrics, active alerts, risk gauges, and top vulnerable areas. Set Demo Mode to "Heavy Rain Event" to see a high-risk scenario.' },
            { step: '2', title: 'Check Risk Map', desc: 'The Risk Map overlays flood probability, landslide zones, monitoring stations, shelters, and field reports on an OpenStreetMap base. Toggle layers in the right panel.' },
            { step: '3', title: 'Run AI Prediction', desc: 'Select a district, village, and time horizon. Click "Run Prediction" to see a simulated risk score with forecast curve and version history.' },
            { step: '4', title: 'Explain a Prediction', desc: 'Explainable AI shows which environmental factors drove the risk score. All contributions are illustrative — not real SHAP values.' },
            { step: '5', title: 'Manage Alerts', desc: 'Alerts & Warnings shows active and historical alerts. You can acknowledge, resolve, and simulate sending SMS/Email/WhatsApp/Push notifications.' },
            { step: '6', title: 'Generate Report', desc: 'Reports page generates a structured flood situation report. Download it as a text file. Includes mandatory disclaimers.' },
          ].map(item => (
            <div key={item.step} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ fontSize: '11px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>{item.step}</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#e2e8f0' }}>{item.title}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={16} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '14px' }}>Frequently Asked Questions</span>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium" style={{ fontSize: '13px', color: '#e2e8f0' }}>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={14} style={{ color: '#475569', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: '#475569', flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3" style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div className="glass-card p-5">
        <span className="font-semibold text-white block mb-4" style={{ fontSize: '14px' }}>Glossary of Risk Terms</span>
        <div className="flex flex-col gap-2">
          {glossary.map((item, i) => (
            <div key={i} className="rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <button
                onClick={() => setOpenGlossary(openGlossary === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
              >
                <span className="font-mono font-medium" style={{ fontSize: '12px', color: '#60a5fa' }}>{item.term}</span>
                {openGlossary === i ? <ChevronUp size={12} style={{ color: '#475569' }} /> : <ChevronDown size={12} style={{ color: '#475569' }} />}
              </button>
              {openGlossary === i && (
                <div className="px-4 pb-3" style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  {item.def}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone size={16} style={{ color: '#64748b' }} />
          <span className="font-semibold text-white" style={{ fontSize: '14px' }}>Escalation Contacts</span>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { org: 'NDMA Helpline', phone: '1078 (Toll-free)', note: 'National Disaster Management Authority' },
            { org: 'SDRF Uttarakhand', phone: '+91-135-2710924', note: 'State Disaster Response Force' },
            { org: 'IMD Dehradun', phone: '+91-135-2622006', note: 'Official weather & flood warnings' },
            { org: 'CWC Uttarakhand', phone: '+91-11-26196726', note: 'Central Water Commission' },
          ].map(c => (
            <div key={c.org} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="font-semibold" style={{ fontSize: '12px', color: '#e2e8f0' }}>{c.org}</div>
              <div className="font-mono" style={{ fontSize: '13px', color: '#3b82f6', marginTop: 2 }}>{c.phone}</div>
              <div style={{ fontSize: '10px', color: '#334155', marginTop: 2 }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="rounded-lg px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#334155' }}>
        ⚠️ {DISCLAIMER}
        <br />FloodGuard AI v2.4.1 · Prototype · SIH/Hackathon Submission
      </div>
    </div>
  );
}
