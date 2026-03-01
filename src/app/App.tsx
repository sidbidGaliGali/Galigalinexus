import { useState } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { Footer } from "./components/footer";
import { HomeContent } from "./components/home-content";
import { PartnerHub } from "./components/partner-hub";
import { InventoryLogistics } from "./components/inventory-logistics";
import { AuditDesk } from "./components/audit-desk";
import { GuardianMonitor } from "./components/guardian-monitor";
import { FinanceDesk } from "./components/finance-desk";

type ActiveView = 'overview' | 'partners' | 'logistics' | 'audit' | 'guardian' | 'finance';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Layout */}
      <div className="flex flex-1 pt-[72px]">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            setSidebarOpen(false);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[260px] transition-all duration-300">
          <div className="p-6 max-w-[1600px] mx-auto">
            {activeView === 'overview' && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-semibold text-white mb-2">
                    GaliGali Nexus Control
                  </h1>
                  <p className="text-gray-400">
                    Real-time oversight of devices, partners, and logistics operations
                  </p>
                </div>
                <HomeContent />
              </>
            )}

            {activeView === 'partners' && <PartnerHub />}

            {activeView === 'logistics' && <InventoryLogistics />}

            {activeView === 'audit' && <AuditDesk />}

            {activeView === 'guardian' && <GuardianMonitor />}

            {activeView === 'finance' && <FinanceDesk />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}