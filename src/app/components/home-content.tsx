import { AlertTriangle, MapPin, Monitor, FileCheck, Package, Truck, Warehouse, Pause, Phone, RotateCcw } from "lucide-react";

interface AlertData {
  type: string;
  device: string;
  partner: string;
  details: string;
  priority: 'red' | 'amber';
}

const alerts: AlertData[] = [
  {
    type: "Geo-Breach",
    device: "GG-9012",
    partner: "MetaCabs",
    details: "Mumbai ➔ Pune",
    priority: "red"
  },
  {
    type: "Stalled",
    device: "GG-4411",
    partner: "SkyAds",
    details: "No movement for 48h",
    priority: "amber"
  },
  {
    type: "Tech",
    device: "GG-1100",
    partner: "MetaCabs",
    details: "Overheating (72°C)",
    priority: "red"
  }
];

// Mock device data for India map
const deviceLocations = [
  { city: "Mumbai", x: 30, y: 55, status: "healthy", count: 45 },
  { city: "Delhi", x: 38, y: 20, status: "healthy", count: 62 },
  { city: "Bangalore", x: 35, y: 75, status: "alert", count: 8 },
  { city: "Pune", x: 32, y: 58, status: "alert", count: 3 },
  { city: "Hyderabad", x: 40, y: 65, status: "healthy", count: 34 },
  { city: "Chennai", x: 42, y: 78, status: "healthy", count: 28 },
  { city: "Kolkata", x: 65, y: 40, status: "healthy", count: 41 },
  { city: "Ahmedabad", x: 28, y: 35, status: "healthy", count: 19 },
  { city: "Jaipur", x: 32, y: 25, status: "healthy", count: 15 },
];

export function HomeContent() {
  return (
    <div className="space-y-6">
      {/* Top Row: Crisis Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CrisisCard
          title="Stalled Ownership"
          value="14"
          subtext="On but not installed > 24h"
          color="amber"
          icon={AlertTriangle}
        />
        <CrisisCard
          title="City Leaps"
          value="3"
          subtext="Active outside assigned zone"
          color="red"
          icon={MapPin}
        />
        <CrisisCard
          title="Black Screens"
          value="8"
          subtext="No light sensor input detected"
          color="red"
          icon={Monitor}
        />
        <CrisisCard
          title="Pending KYC"
          value="5"
          subtext="Partners awaiting document review"
          color="blue"
          icon={FileCheck}
        />
      </div>

      {/* Middle Row: Logistics & Health Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Global Fleet Heatmap - 8 columns */}
        <div className="lg:col-span-8 bg-[#112240] rounded-lg border border-[#233554] p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Global Fleet Heatmap</h2>
          <div className="relative aspect-[16/10] bg-[#0A192F] rounded-lg border border-[#233554] overflow-hidden">
            {/* India Map Outline */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-20"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M35,15 L40,12 L45,15 L48,18 L52,20 L55,25 L58,30 L60,35 L62,40 L65,45 L65,50 L63,55 L60,60 L58,65 L55,70 L52,75 L48,78 L45,80 L42,82 L38,83 L35,82 L32,80 L30,78 L28,75 L27,72 L26,68 L25,65 L24,60 L23,55 L22,50 L23,45 L25,40 L27,35 L30,30 L32,25 L35,20 L35,15 Z"
                fill="none"
                stroke="#233554"
                strokeWidth="0.5"
              />
            </svg>

            {/* Device Markers */}
            {deviceLocations.map((location, idx) => (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                {/* Pulsing Effect */}
                {location.status === "alert" && (
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#FF4D4D] animate-ping opacity-75"></div>
                )}
                {location.status === "healthy" && (
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-30"></div>
                )}
                
                {/* Main Dot */}
                <div
                  className={`w-4 h-4 rounded-full shadow-lg ${
                    location.status === "alert" ? "bg-[#FF4D4D]" : "bg-green-500"
                  }`}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-[#0A192F] border border-[#233554] rounded px-3 py-2 whitespace-nowrap shadow-xl">
                    <div className="text-white font-medium text-sm">{location.city}</div>
                    <div className="text-gray-400 text-xs">{location.count} devices</div>
                    <div className={`text-xs ${location.status === "alert" ? "text-[#FF4D4D]" : "text-green-500"}`}>
                      {location.status === "alert" ? "Alert" : "Healthy"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF4D4D]"></div>
              <span className="text-sm text-gray-400">Alert</span>
            </div>
          </div>
        </div>

        {/* Logistics Pipeline - 4 columns */}
        <div className="lg:col-span-4 bg-[#112240] rounded-lg border border-[#233554] p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Logistics Pipeline</h2>
          <div className="space-y-6">
            <LogisticsItem
              icon={Warehouse}
              label="In Warehouse"
              value="450"
              unit="units"
              color="blue"
            />
            <LogisticsItem
              icon={Package}
              label="Allocated"
              value="120"
              unit="units"
              color="emerald"
            />
            <LogisticsItem
              icon={Truck}
              label="In Transit"
              value="85"
              unit="units"
              subtext="Tracking active"
              color="amber"
            />
          </div>

          {/* Summary Bar */}
          <div className="mt-6 pt-6 border-t border-[#233554]">
            <div className="text-sm text-gray-400 mb-2">Total Inventory</div>
            <div className="text-3xl font-semibold text-white">655</div>
            <div className="text-xs text-gray-500 mt-1">devices</div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Critical Guardian Alerts */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Critical Guardian Alerts</h2>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#233554]">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Alert Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Device</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Partner</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[#233554] last:border-0 relative ${
                    alert.priority === "red" ? "border-l-4 border-l-[#FF4D4D]" : "border-l-4 border-l-yellow-500"
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      alert.priority === "red" 
                        ? "bg-[#FF4D4D]/10 text-[#FF4D4D]" 
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      {alert.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-mono font-semibold">{alert.device}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{alert.partner}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400">{alert.details}</span>
                  </td>
                  <td className="py-4 px-4">
                    {idx === 0 && (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors text-sm">
                        <Pause className="w-3 h-3" />
                        Pause & Flag
                      </button>
                    )}
                    {idx === 1 && (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors text-sm">
                        <Phone className="w-3 h-3" />
                        Contact Partner
                      </button>
                    )}
                    {idx === 2 && (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors text-sm">
                        <RotateCcw className="w-3 h-3" />
                        Remote Reboot
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface CrisisCardProps {
  title: string;
  value: string;
  subtext: string;
  color: 'amber' | 'red' | 'blue';
  icon: React.ElementType;
}

function CrisisCard({ title, value, subtext, color, icon: Icon }: CrisisCardProps) {
  const colorClasses = {
    amber: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    red: 'text-[#FF4D4D] border-[#FF4D4D]/20 bg-[#FF4D4D]/5',
    blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
  };

  const iconColorClasses = {
    amber: 'text-yellow-500',
    red: 'text-[#FF4D4D]',
    blue: 'text-blue-500',
  };

  return (
    <div className={`bg-[#112240] rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-400">{title}</div>
        <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
      </div>
      <div className={`text-4xl font-semibold mb-2 ${iconColorClasses[color]}`}>{value}</div>
      <div className="text-xs text-gray-400">{subtext}</div>
    </div>
  );
}

interface LogisticsItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  subtext?: string;
  color: 'blue' | 'emerald' | 'amber';
}

function LogisticsItem({ icon: Icon, label, value, unit, subtext, color }: LogisticsItemProps) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    emerald: 'text-[#64FFDA] bg-[#64FFDA]/10',
    amber: 'text-yellow-500 bg-yellow-500/10',
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-1">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-white">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      </div>
    </div>
  );
}
