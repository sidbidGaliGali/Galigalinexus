import { LayoutGrid, Users, Truck, Camera, ShieldAlert, Wallet, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type ActiveView = 'overview' | 'partners' | 'logistics' | 'audit' | 'guardian' | 'finance';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const navigationItems = [
  { icon: LayoutGrid, label: "Overview", view: "overview" as ActiveView },
  { icon: Users, label: "Partner Hub", view: "partners" as ActiveView, subtitle: "KYC & Onboarding" },
  { icon: Truck, label: "Inventory & Logistics", view: "logistics" as ActiveView, subtitle: "Shipments & Stock" },
  { icon: Camera, label: "Audit Desk", view: "audit" as ActiveView, subtitle: "Approval Queue" },
  { icon: ShieldAlert, label: "Guardian", view: "guardian" as ActiveView, subtitle: "Fraud & Technical Health" },
  { icon: Wallet, label: "Finance", view: "finance" as ActiveView, subtitle: "Invoices & Payouts" },
];

export function Sidebar({ isOpen, onClose, activeView, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[72px] bottom-0 left-0 bg-[#0A192F] border-r border-[#233554] z-40
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-[260px]'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  activeView === item.view
                    ? 'bg-[#112240] text-[#64FFDA]'
                    : 'text-gray-300 hover:bg-[#112240] hover:text-[#64FFDA]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium truncate">{item.label}</div>
                    {item.subtitle && (
                      <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-[#233554] p-3 space-y-1">
            <a
              href="#settings"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#112240] hover:text-white transition-all"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </a>
            
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#FF4D4D] hover:bg-[#112240] transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>

            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-full items-center justify-center px-3 py-2 rounded-lg text-gray-400 hover:bg-[#112240] hover:text-white transition-all mt-2"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="ml-2 text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}