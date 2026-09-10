import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import DegradedModeBanner from './components/layout/DegradedModeBanner';
import AIChatAssistant from './components/layout/AIChatAssistant';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import RiskMap from './pages/RiskMap';
import AIPrediction from './pages/AIPrediction';
import ExplainableAI from './pages/ExplainableAI';
import VulnerableAreas from './pages/VulnerableAreas';
import AlertsWarnings from './pages/AlertsWarnings';
import SafeRoutes from './pages/SafeRoutes';
import FloodSimulator from './pages/FloodSimulator';
import SatelliteMonitoring from './pages/SatelliteMonitoring';
import HistoricalAnalysis from './pages/HistoricalAnalysis';
import Reports from './pages/Reports';
import DataSources from './pages/DataSources';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import FieldReports from './pages/FieldReports';
import type { DemoState } from './data/mockData';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>({
    mode: 'NORMAL',
    offlineSource: null,
    language: 'EN',
    fieldReports: [],
  });

  return (
    <BrowserRouter>
      <div className="flex flex-col" style={{ height: '100%', background: '#0a0e1a' }}>
        <DegradedModeBanner demoState={demoState} />
        <div className="flex flex-1 min-h-0">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
          <div className="flex flex-col flex-1 min-w-0">
            <TopNavbar demoState={demoState} setDemoState={setDemoState} />
            <main className="flex-1 min-h-0 overflow-hidden" style={{ background: '#0a0e1a' }}>
              <Routes>
                <Route path="/" element={<Dashboard demoState={demoState} />} />
                <Route path="/live-monitoring" element={<LiveMonitoring demoState={demoState} />} />
                <Route path="/risk-map" element={<RiskMap demoState={demoState} />} />
                <Route path="/ai-prediction" element={<AIPrediction demoState={demoState} />} />
                <Route path="/explainable-ai" element={<ExplainableAI demoState={demoState} />} />
                <Route path="/vulnerable-areas" element={<VulnerableAreas demoState={demoState} />} />
                <Route path="/alerts" element={<AlertsWarnings demoState={demoState} />} />
                <Route path="/safe-routes" element={<SafeRoutes demoState={demoState} />} />
                <Route path="/flood-simulator" element={<FloodSimulator demoState={demoState} />} />
                <Route path="/satellite" element={<SatelliteMonitoring />} />
                <Route path="/historical" element={<HistoricalAnalysis />} />
                <Route path="/reports" element={<Reports demoState={demoState} />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/settings" element={<Settings demoState={demoState} setDemoState={setDemoState} />} />
                <Route path="/help" element={<HelpSupport />} />
                <Route path="/field-reports" element={<FieldReports />} />
              </Routes>
            </main>
          </div>
        </div>
        <AIChatAssistant />
      </div>
    </BrowserRouter>
  );
}
