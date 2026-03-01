import { useState } from "react";
import { AlertTriangle, MapPin, Monitor, Thermometer, Radio, ShieldAlert, Power, Phone, Flag, Check, X, Map as MapIcon, Activity, Zap } from "lucide-react";

interface ZombieDevice {
  deviceId: string;
  partner: string;
  state: string;
  duration: string;
  location: string;
  lastHeartbeat: string;
}

interface GeoBreachAlert {
  deviceId: string;
  partner: string;
  assignedCity: string;
  currentCity: string;
  distance: number;
  lat: number;
  lng: number;
  assignedLat: number;
  assignedLng: number;
}

interface HealthAlert {
  type: 'display' | 'ad-inventory' | 'thermal';
  deviceId: string;
  partner: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details?: string;
  temperature?: number;
}

const mockZombieDevices: ZombieDevice[] = [
  {
    deviceId: "GG-4411",
    partner: "SkyAds",
    state: "Stalled in Ownership",
    duration: "48 Hours",
    location: "Static (Warehouse)",
    lastHeartbeat: "Feb 8, 2026 2:30 PM"
  },
  {
    deviceId: "GG-3322",
    partner: "MetaCabs",
    state: "Powered but Inactive",
    duration: "72 Hours",
    location: "Static (Tech Home)",
    lastHeartbeat: "Feb 7, 2026 11:45 AM"
  }
];

const mockGeoBreaches: GeoBreachAlert[] = [
  {
    deviceId: "GG-9012",
    partner: "MetaCabs",
    assignedCity: "Mumbai",
    currentCity: "Pune",
    distance: 148,
    lat: 18.5204,
    lng: 73.8567,
    assignedLat: 19.0760,
    assignedLng: 72.8777
  },
  {
    deviceId: "GG-7788",
    partner: "UrbanFleet Media",
    assignedCity: "Delhi",
    currentCity: "Gurgaon",
    distance: 32,
    lat: 28.4595,
    lng: 77.0266,
    assignedLat: 28.7041,
    assignedLng: 77.1025
  }
];

const mockHealthAlerts: HealthAlert[] = [
  {
    type: 'display',
    deviceId: "GG-5566",
    partner: "SkyAds",
    severity: 'critical',
    message: "Black Screen Detected",
    details: "Light sensor reports 0 Lux for 2.5 hours. App heartbeat is green."
  },
  {
    type: 'ad-inventory',
    deviceId: "GG-1122",
    partner: "MetaCabs",
    severity: 'warning',
    message: "Ad Stream Frozen",
    details: "Same creative looping for 4 hours. Potential UI freeze."
  },
  {
    type: 'thermal',
    deviceId: "GG-1100",
    partner: "MetaCabs",
    severity: 'critical',
    message: "Critical Temperature",
    details: "Device overheating detected. Auto-shutdown scheduled.",
    temperature: 72
  }
];

type GuardianView = 'zombies' | 'geo-breach' | 'health';

export function GuardianMonitor() {
  const [activeView, setActiveView] = useState<GuardianView>('zombies');
  const [showKillSwitch, setShowKillSwitch] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Guardian Monitor</h1>
          <p className="text-gray-400">Real-time fraud detection and system health intelligence</p>
        </div>
        <button
          onClick={() => setShowKillSwitch(true)}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#FF4D4D] text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/10 transition-colors font-semibold"
        >
          <Power className="w-5 h-5" />
          Emergency Kill-Switch
        </button>
      </div>

      {/* Critical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AlertStatCard
          icon={AlertTriangle}
          label="Zombie Devices"
          value="14"
          severity="amber"
          description="Stalled > 24h"
        />
        <AlertStatCard
          icon={MapPin}
          label="Geo-Breaches"
          value="3"
          severity="red"
          description="Outside assigned zone"
        />
        <AlertStatCard
          icon={Monitor}
          label="Black Screens"
          value="8"
          severity="red"
          description="Display failures"
        />
        <AlertStatCard
          icon={Thermometer}
          label="Thermal Alerts"
          value="2"
          severity="amber"
          description="Overheating devices"
        />
      </div>

      {/* View Selector */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-2 flex gap-2">
        <ViewTab
          icon={AlertTriangle}
          label="Zombies & Stalls"
          active={activeView === 'zombies'}
          onClick={() => setActiveView('zombies')}
          count={mockZombieDevices.length}
        />
        <ViewTab
          icon={MapIcon}
          label="Geo-Breach Map"
          active={activeView === 'geo-breach'}
          onClick={() => setActiveView('geo-breach')}
          count={mockGeoBreaches.length}
        />
        <ViewTab
          icon={Activity}
          label="Technical Health"
          active={activeView === 'health'}
          onClick={() => setActiveView('health')}
          count={mockHealthAlerts.length}
        />
      </div>

      {/* Content Area */}
      {activeView === 'zombies' && <ZombiesView devices={mockZombieDevices} />}
      {activeView === 'geo-breach' && <GeoBreachView breaches={mockGeoBreaches} />}
      {activeView === 'health' && <HealthView alerts={mockHealthAlerts} />}

      {/* Kill Switch Modal */}
      {showKillSwitch && (
        <KillSwitchModal onClose={() => setShowKillSwitch(false)} />
      )}
    </div>
  );
}

interface AlertStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  severity: 'red' | 'amber' | 'blue';
  description: string;
}

function AlertStatCard({ icon: Icon, label, value, severity, description }: AlertStatCardProps) {
  const colors = {
    red: 'text-[#FF4D4D] bg-[#FF4D4D]/10 border-[#FF4D4D]/20',
    amber: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className={`bg-[#112240] rounded-lg border-2 p-6 ${colors[severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <Icon className={`w-6 h-6 ${colors[severity].split(' ')[0]}`} />
        <div className={`text-4xl font-semibold ${colors[severity].split(' ')[0]}`}>
          {value}
        </div>
      </div>
      <div className="text-white font-medium mb-1">{label}</div>
      <div className="text-sm text-gray-400">{description}</div>
    </div>
  );
}

interface ViewTabProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}

function ViewTab({ icon: Icon, label, active, onClick, count }: ViewTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-[#64FFDA] text-[#0A192F]'
          : 'text-gray-400 hover:bg-[#0A192F] hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        active ? 'bg-[#0A192F] text-[#64FFDA]' : 'bg-[#0A192F] text-gray-400'
      }`}>
        {count}
      </span>
    </button>
  );
}

interface ZombiesViewProps {
  devices: ZombieDevice[];
}

function ZombiesView({ devices }: ZombiesViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Stalled Devices (ON but NOT ACTIVE)</h2>
          <div className="text-sm text-gray-400">
            Devices powered but not serving ads or generating revenue
          </div>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.deviceId}
              className="bg-[#0A192F] rounded-lg border-l-4 border-l-yellow-500 p-6 hover:border-[#64FFDA] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-mono font-semibold text-lg">{device.deviceId}</span>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium border border-yellow-500/20">
                      {device.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{device.partner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{device.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-yellow-500 font-semibold text-lg mb-1">{device.duration}</div>
                  <div className="text-xs text-gray-500">since last heartbeat</div>
                </div>
              </div>

              <div className="bg-[#112240] rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Last Heartbeat</div>
                    <div className="text-white">{device.lastHeartbeat}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Current Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-white">Powered but Idle</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#64FFDA]/10 text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/20 transition-colors border border-[#64FFDA]/20">
                  <Radio className="w-4 h-4" />
                  Ping Device
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                  <Phone className="w-4 h-4" />
                  Contact Ops
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FF4D4D]/10 text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/20 transition-colors border border-[#FF4D4D]/20">
                  <Flag className="w-4 h-4" />
                  Flag for Investigation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface GeoBreachViewProps {
  breaches: GeoBreachAlert[];
}

function GeoBreachView({ breaches }: GeoBreachViewProps) {
  const [selectedBreach, setSelectedBreach] = useState<GeoBreachAlert | null>(breaches[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Map View - 8 columns */}
      <div className="lg:col-span-8 bg-[#112240] rounded-lg border border-[#233554] p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Geo-Breach Detection Map</h2>
        
        {/* Interactive Map Placeholder */}
        <div className="relative bg-[#0A192F] rounded-lg border border-[#233554] h-[500px] overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #233554 0px, #233554 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #233554 0px, #233554 1px, transparent 1px, transparent 20px)'
            }}></div>
          </div>

          {/* India Outline */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M35,15 L40,12 L45,15 L48,18 L52,20 L55,25 L58,30 L60,35 L62,40 L65,45 L65,50 L63,55 L60,60 L58,65 L55,70 L52,75 L48,78 L45,80 L42,82 L38,83 L35,82 L32,80 L30,78 L28,75 L27,72 L26,68 L25,65 L24,60 L23,55 L22,50 L23,45 L25,40 L27,35 L30,30 L32,25 L35,20 L35,15 Z"
              fill="none"
              stroke="#64FFDA"
              strokeWidth="0.5"
            />
          </svg>

          {/* Geofence Circles */}
          <div className="absolute left-[30%] top-[55%]">
            <div className="w-32 h-32 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-blue-400">Mumbai</div>
              </div>
            </div>
          </div>

          <div className="absolute left-[38%] top-[20%]">
            <div className="w-32 h-32 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-blue-400">Delhi</div>
              </div>
            </div>
          </div>

          {/* Breach Alerts */}
          {selectedBreach && (
            <>
              {/* Breach Location */}
              <div className="absolute left-[32%] top-[58%]">
                <div className="relative">
                  <div className="w-6 h-6 bg-[#FF4D4D] rounded-full animate-ping absolute"></div>
                  <div className="w-6 h-6 bg-[#FF4D4D] rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="30%"
                  y1="55%"
                  x2="32%"
                  y2="58%"
                  stroke="#FF4D4D"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </svg>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-400">Assigned Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF4D4D]"></div>
            <span className="text-sm text-gray-400">Breach Location</span>
          </div>
        </div>
      </div>

      {/* Breach List - 4 columns */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Breaches</h3>
          
          <div className="space-y-3">
            {breaches.map((breach) => (
              <button
                key={breach.deviceId}
                onClick={() => setSelectedBreach(breach)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedBreach?.deviceId === breach.deviceId
                    ? 'bg-[#FF4D4D]/10 border-[#FF4D4D]'
                    : 'bg-[#0A192F] border-[#233554] hover:border-[#FF4D4D]/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-white font-mono font-semibold">{breach.deviceId}</span>
                  <AlertTriangle className="w-4 h-4 text-[#FF4D4D]" />
                </div>
                <div className="text-sm text-gray-400 mb-2">{breach.partner}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">{breach.assignedCity}</span>
                  <span className="text-[#FF4D4D]">→</span>
                  <span className="text-[#FF4D4D]">{breach.currentCity}</span>
                </div>
                <div className="text-xs text-[#FF4D4D] mt-2">{breach.distance}km from home</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Breach Details */}
        {selectedBreach && (
          <div className="bg-[#112240] rounded-lg border-2 border-[#FF4D4D]/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Breach Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Device ID</div>
                <div className="text-white font-mono font-semibold">{selectedBreach.deviceId}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className="px-3 py-1 bg-[#FF4D4D]/10 text-[#FF4D4D] rounded-full text-sm inline-block border border-[#FF4D4D]/20">
                  Monetization Auto-Paused
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Distance from Home</div>
                <div className="text-[#FF4D4D] font-semibold">{selectedBreach.distance} km</div>
              </div>

              <div className="pt-4 space-y-2">
                <button className="w-full px-4 py-2.5 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold">
                  Authorize Remote Location Change
                </button>
                <button className="w-full px-4 py-2.5 border-2 border-[#FF4D4D] text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/10 transition-colors font-semibold">
                  Block Device
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface HealthViewProps {
  alerts: HealthAlert[];
}

function HealthView({ alerts }: HealthViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Technical Health Monitor</h2>

        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <HealthAlertCard key={idx} alert={alert} />
          ))}
        </div>
      </div>

      {/* Ad-Inventory Controller */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Ad-Stream Integrity Monitor</h3>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-medium">All URLs Validated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
            <div className="text-sm text-gray-400 mb-2">404 Check Status</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white font-semibold">Passed</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Last checked: 2 mins ago</div>
          </div>

          <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
            <div className="text-sm text-gray-400 mb-2">Active Campaigns</div>
            <div className="text-2xl font-semibold text-white">147</div>
            <div className="text-xs text-gray-500 mt-2">Across 5 partners</div>
          </div>

          <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
            <div className="text-sm text-gray-400 mb-2">Stream Health</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">98.7%</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Uptime last 24h</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HealthAlertCardProps {
  alert: HealthAlert;
}

function HealthAlertCard({ alert }: HealthAlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-[#FF4D4D] bg-[#FF4D4D]/5';
      case 'warning': return 'border-yellow-500 bg-yellow-500/5';
      case 'info': return 'border-blue-500 bg-blue-500/5';
      default: return 'border-[#233554]';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[#FF4D4D]';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getIcon = () => {
    switch (alert.type) {
      case 'display': return Monitor;
      case 'ad-inventory': return Radio;
      case 'thermal': return Thermometer;
      default: return AlertTriangle;
    }
  };

  const Icon = getIcon();

  return (
    <div className={`bg-[#0A192F] rounded-lg border-l-4 p-6 ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
            <Icon className={`w-6 h-6 ${getSeverityTextColor(alert.severity)}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-white font-semibold text-lg">{alert.message}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                alert.severity === 'critical' ? 'bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20' :
                alert.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              }`}>
                {alert.severity.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span className="font-mono font-semibold">{alert.deviceId}</span>
              <span>•</span>
              <span>{alert.partner}</span>
            </div>

            <p className="text-gray-300 text-sm">{alert.details}</p>

            {alert.type === 'thermal' && alert.temperature && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Temperature</span>
                  <span className={`font-semibold ${getSeverityTextColor(alert.severity)}`}>
                    {alert.temperature}°C
                  </span>
                </div>
                <div className="w-full bg-[#112240] rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-[#FF4D4D] transition-all"
                    style={{ width: `${(alert.temperature / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°C</span>
                  <span>50°C</span>
                  <span>100°C</span>
                </div>
                <div className={`mt-3 p-3 rounded-lg ${getSeverityColor('critical')}`}>
                  <div className="flex items-center gap-2 text-sm text-[#FF4D4D]">
                    <Zap className="w-4 h-4" />
                    <span>Auto-Shutdown Scheduled in 5 minutes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {alert.type === 'display' && (
          <button className="px-4 py-2 bg-[#64FFDA]/10 text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/20 transition-colors border border-[#64FFDA]/20 font-medium">
            Reboot App
          </button>
        )}
        {alert.type === 'ad-inventory' && (
          <button className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20 font-medium">
            Force Refresh Stream
          </button>
        )}
        {alert.type === 'thermal' && (
          <button className="px-4 py-2 bg-[#FF4D4D]/10 text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/20 transition-colors border border-[#FF4D4D]/20 font-medium">
            Emergency Shutdown
          </button>
        )}
        <button className="px-4 py-2 bg-[#112240] text-white rounded-lg hover:bg-[#0A192F] transition-colors border border-[#233554] font-medium">
          View Device Logs
        </button>
      </div>
    </div>
  );
}

interface KillSwitchModalProps {
  onClose: () => void;
}

function KillSwitchModal({ onClose }: KillSwitchModalProps) {
  const [step, setStep] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && confirmText === "KILL") {
      // Execute kill switch
      setStep(3);
      setTimeout(onClose, 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#112240] rounded-lg border-2 border-[#FF4D4D] z-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#FF4D4D]/10 rounded-lg">
            <Power className="w-8 h-8 text-[#FF4D4D]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Emergency Kill-Switch</h3>
            <p className="text-sm text-gray-400">Stop ad-serving for a partner's fleet</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF4D4D] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#FF4D4D]">
                  <strong>Warning:</strong> This action will immediately pause all monetization for the selected partner. Use only for confirmed fraud or critical violations.
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Select Partner to Disable</label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#FF4D4D] transition-colors"
              >
                <option value="">Choose a partner...</option>
                <option value="metacabs">MetaCabs (45 devices)</option>
                <option value="skyads">SkyAds (32 devices)</option>
                <option value="urbanfleet">UrbanFleet Media (62 devices)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#0A192F] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedPartner}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                  selectedPartner
                    ? 'bg-[#FF4D4D] text-white hover:bg-[#FF4D4D]/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 rounded-lg p-4">
              <div className="text-sm text-[#FF4D4D] mb-4">
                <strong>Double Confirmation Required</strong>
                <p className="mt-2">Type <strong>KILL</strong> to confirm this action.</p>
              </div>
              
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type KILL"
                className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#FF4D4D] focus:outline-none font-mono text-center text-lg"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#0A192F] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmText !== "KILL"}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                  confirmText === "KILL"
                    ? 'bg-[#FF4D4D] text-white hover:bg-[#FF4D4D]/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Execute Kill-Switch
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl text-white font-semibold mb-2">Kill-Switch Activated</h4>
            <p className="text-gray-400">All devices for selected partner have been paused</p>
          </div>
        )}
      </div>
    </>
  );
}

// Add missing import
import { User } from "lucide-react";
