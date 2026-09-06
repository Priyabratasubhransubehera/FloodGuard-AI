import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const CANNED: Record<string, string> = {
  risk: 'Based on current sensor data, Kedarnath Valley shows EXTREME flood risk (93% probability). Key drivers: 62.7mm/hr rainfall at Kedarnath AWS, Mandakini River at 5.3m (above 5.0m warning threshold), and soil saturation >85% on 40°+ slopes. I recommend cross-referencing with official IMD District Warning.',
  landslide: 'Landslide probability is highest in Joshimath (74%) and Munsiyari (79%). Elevated slope angles (>30°) combined with soil saturation >80% are the primary indicators. Note: These are illustrative estimates from the prototype model — not official GSI assessments.',
  shelter: 'Nearest available shelter with capacity: Joshimath Relief Camp (500 cap, 37% full — 187 occupants). Srinagar Polytechnic Camp is also available (800 cap, 26% full). Rudraprayag Relief Center is at 66% capacity.',
  forecast: 'IMD forecast indicates continued heavy to extreme rainfall for the next 24 hours in Chamoli and Rudraprayag districts. Peak intensity expected overnight 02–03 September. 5-day outlook shows conditions improving from Saturday.',
  default: 'I can help you interpret flood risk scores, explain AI predictions, locate shelters, or summarize current alert status. Ask me about: risk levels, landslide warnings, shelter capacity, forecast, or a specific village or district.\n\n⚠️ This assistant provides prototype decision-support only and must not replace official government emergency guidance.',
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('risk') || q.includes('flood') || q.includes('probability')) return CANNED.risk;
  if (q.includes('landslide') || q.includes('slope') || q.includes('debris')) return CANNED.landslide;
  if (q.includes('shelter') || q.includes('camp') || q.includes('evacuate') || q.includes('capacity')) return CANNED.shelter;
  if (q.includes('forecast') || q.includes('weather') || q.includes('rain') || q.includes('imd')) return CANNED.forecast;
  return CANNED.default;
}

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'FloodGuard AI Assistant ready. I can help explain risk scores, locate shelters, and summarize active alerts.\n\n⚠️ Prototype decision-support only — not official emergency guidance.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: 'assistant', text: getResponse(text) }]);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 flex items-center justify-center rounded-full shadow-2xl transition-all z-50"
        style={{
          width: 52, height: 52,
          background: open ? '#1e3a5f' : 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
          boxShadow: '0 0 24px rgba(59,130,246,0.4)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {open ? <X size={20} className="text-white" /> : <MessageSquare size={20} className="text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-6 flex flex-col rounded-2xl shadow-2xl z-50"
          style={{
            width: 360, height: 480,
            background: '#0f1524',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-t-2xl" style={{ background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)' }}>
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-white" style={{ fontSize: '13px' }}>FloodGuard AI Assistant</div>
              <div className="font-mono" style={{ fontSize: '10px', color: '#22c55e' }}>● ONLINE · PROTOTYPE</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: 'none' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: msg.role === 'assistant' ? 'rgba(59,130,246,0.2)' : 'rgba(6,182,212,0.2)' }}>
                  {msg.role === 'assistant' ? <Bot size={12} style={{ color: '#3b82f6' }} /> : <User size={12} style={{ color: '#06b6d4' }} />}
                </div>
                <div
                  className="rounded-xl px-3 py-2 max-w-xs"
                  style={{
                    background: msg.role === 'assistant' ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.2)',
                    fontSize: '12px',
                    color: '#cbd5e1',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: 'rgba(59,130,246,0.2)' }}>
                  <Bot size={12} style={{ color: '#3b82f6' }} />
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="rounded-full" style={{ width: 5, height: 5, background: '#475569', animation: `blink 1.2s ${i * 0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <input
              type="text"
              placeholder="Ask about risk, shelters, forecast…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 rounded-lg px-3 py-2 bg-transparent outline-none"
              style={{ fontSize: '12px', color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{ width: 36, height: 36, background: input.trim() ? '#1d4ed8' : 'rgba(255,255,255,0.04)', flexShrink: 0 }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
