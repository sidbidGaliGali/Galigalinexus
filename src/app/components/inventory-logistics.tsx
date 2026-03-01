import { useState } from "react";
import { Package, Truck, Search, Plus, Upload, Check, ChevronRight, FileText, X } from "lucide-react";

interface Device {
  id: string;
  imei: string;
  simIccid: string;
  warehouse: string;
  status: 'Available' | 'Allocated' | 'Shipped';
}

interface Shipment {
  id: string;
  partner: string;
  destination: string;
  status: 'Dispatched' | 'In-Transit' | 'Out for Delivery' | 'Delivered';
  deviceCount: number;
  trackingId: string;
  courier: string;
  expectedDelivery: string;
  podUploaded: boolean;
}

const mockDevices: Device[] = [
  { id: "GG-0001", imei: "352301098765432", simIccid: "8991101200003204510", warehouse: "Mumbai WH-1", status: "Available" },
  { id: "GG-0002", imei: "352301098765433", simIccid: "8991101200003204511", warehouse: "Mumbai WH-1", status: "Available" },
  { id: "GG-0003", imei: "352301098765434", simIccid: "8991101200003204512", warehouse: "Delhi WH-2", status: "Allocated" },
  { id: "GG-0004", imei: "352301098765435", simIccid: "8991101200003204513", warehouse: "Delhi WH-2", status: "Shipped" },
  { id: "GG-0005", imei: "352301098765436", simIccid: "8991101200003204514", warehouse: "Mumbai WH-1", status: "Available" },
];

const mockShipments: Shipment[] = [
  {
    id: "LOT-9921",
    partner: "MetaCabs",
    destination: "Mumbai",
    status: "Out for Delivery",
    deviceCount: 50,
    trackingId: "BDEL834729",
    courier: "BlueDart",
    expectedDelivery: "2026-02-11",
    podUploaded: false
  },
  {
    id: "LOT-9920",
    partner: "UrbanFleet Media",
    destination: "Delhi",
    status: "Delivered",
    deviceCount: 30,
    trackingId: "DEL982341",
    courier: "Delhivery",
    expectedDelivery: "2026-02-08",
    podUploaded: true
  }
];

type View = 'inventory' | 'create-shipment' | 'shipment-details';

export function InventoryLogistics() {
  const [currentView, setCurrentView] = useState<View>('inventory');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setCurrentView('shipment-details');
  };

  const handleBackToInventory = () => {
    setCurrentView('inventory');
    setSelectedShipment(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'inventory' && (
        <InventoryView
          onCreateShipment={() => setCurrentView('create-shipment')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewShipment={handleViewShipment}
        />
      )}

      {currentView === 'create-shipment' && (
        <CreateShipmentFlow
          onBack={handleBackToInventory}
          onComplete={handleBackToInventory}
        />
      )}

      {currentView === 'shipment-details' && selectedShipment && (
        <ShipmentDetails
          shipment={selectedShipment}
          onBack={handleBackToInventory}
        />
      )}
    </div>
  );
}

interface InventoryViewProps {
  onCreateShipment: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewShipment: (shipment: Shipment) => void;
}

function InventoryView({ onCreateShipment, searchQuery, onSearchChange, onViewShipment }: InventoryViewProps) {
  const filteredDevices = mockDevices.filter(device =>
    device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.imei.includes(searchQuery) ||
    device.simIccid.includes(searchQuery)
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Inventory & Logistics</h1>
          <p className="text-gray-400">Manage device stock and shipments</p>
        </div>
        <button
          onClick={onCreateShipment}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Create Lot Shipment
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget
          icon={Package}
          label="Total Stock"
          value="2,400"
          unit="units"
          color="blue"
        />
        <StatWidget
          icon={Package}
          label="Allocated"
          value="450"
          unit="units"
          color="emerald"
        />
        <StatWidget
          icon={Truck}
          label="In Transit"
          value="180"
          unit="units"
          color="amber"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Device ID, IMEI, or SIM ICCID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0A192F] text-white placeholder-gray-400 pl-11 pr-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
          />
        </div>
      </div>

      {/* Active Shipments */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Active Shipments</h2>
        <div className="space-y-3">
          {mockShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-[#0A192F] rounded-lg border border-[#233554] p-4 hover:border-[#64FFDA] transition-colors cursor-pointer"
              onClick={() => onViewShipment(shipment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    shipment.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{shipment.id} → {shipment.partner}</div>
                    <div className="text-sm text-gray-400">{shipment.deviceCount} devices • {shipment.courier} • {shipment.trackingId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShipmentStatusBadge status={shipment.status} />
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Inventory Table */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] overflow-hidden">
        <div className="p-6 border-b border-[#233554]">
          <h2 className="text-xl font-semibold text-white">Master Device Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-[#233554]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Device ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">IMEI</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">SIM ICCID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Warehouse</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id} className="border-b border-[#233554] last:border-0 hover:bg-[#0A192F]/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-white font-mono font-semibold">{device.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300 font-mono text-sm">{device.imei}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300 font-mono text-sm">{device.simIccid}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white">{device.warehouse}</span>
                  </td>
                  <td className="py-4 px-6">
                    <DeviceStatusBadge status={device.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface CreateShipmentFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

function CreateShipmentFlow({ onBack, onComplete }: CreateShipmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [partner, setPartner] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [boxCount, setBoxCount] = useState("1");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSubmit = () => {
    // In a real app, this would create the shipment
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#112240] rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white rotate-180" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Create Lot Shipment</h1>
          <p className="text-gray-400">Assign and ship devices to media partners</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <div className="flex items-center justify-between">
          <StepIndicator number={1} label="Asset Selection" active={currentStep === 1} completed={currentStep > 1} />
          <div className="flex-1 h-0.5 bg-[#233554] mx-4" />
          <StepIndicator number={2} label="Destination & Receiver" active={currentStep === 2} completed={currentStep > 2} />
          <div className="flex-1 h-0.5 bg-[#233554] mx-4" />
          <StepIndicator number={3} label="Courier Details" active={currentStep === 3} completed={false} />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Select Devices for Shipment</h2>
              <p className="text-gray-400 mb-6">Choose devices to include in this lot or upload a CSV file</p>
            </div>

            {/* Upload CSV Option */}
            <div className="border-2 border-dashed border-[#233554] rounded-lg p-8 text-center hover:border-[#64FFDA] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <div className="text-white mb-1">Upload CSV with Device IDs</div>
              <div className="text-sm text-gray-500">or select devices manually below</div>
            </div>

            {/* Manual Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Available Devices</span>
                <span className="text-sm text-[#64FFDA]">{selectedDevices.length} selected</span>
              </div>
              {mockDevices.filter(d => d.status === 'Available').map((device) => (
                <label
                  key={device.id}
                  className="flex items-center gap-3 p-3 bg-[#0A192F] rounded-lg border border-[#233554] hover:border-[#64FFDA] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => handleSelectDevice(device.id)}
                    className="w-4 h-4 rounded border-[#233554] text-[#64FFDA] focus:ring-[#64FFDA] focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="text-white font-mono font-semibold">{device.id}</div>
                    <div className="text-sm text-gray-400">{device.imei} • {device.warehouse}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Destination & Receiver Details</h2>
              <p className="text-gray-400 mb-6">Specify where the devices should be delivered</p>
            </div>

            <div className="space-y-4">
              {/* Partner Selection */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Partner</label>
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                >
                  <option value="">Choose a partner...</option>
                  <option value="metacabs">MetaCabs</option>
                  <option value="skyads">SkyAds</option>
                  <option value="urbanfleet">UrbanFleet Media</option>
                </select>
              </div>

              {/* Receiver Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Receiver Name</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Mobile Number</label>
                  <input
                    type="tel"
                    value={receiverMobile}
                    onChange={(e) => setReceiverMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Shipping Address</label>
                <textarea
                  rows={3}
                  placeholder="Auto-populated from Partner KYC..."
                  className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors resize-none"
                  defaultValue="123, Business Park, Andheri East, Mumbai - 400069, Maharashtra, India"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Courier Details</h2>
              <p className="text-gray-400 mb-6">Provide shipment tracking information</p>
            </div>

            <div className="space-y-4">
              {/* Courier Partner */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Courier Partner</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                >
                  <option value="">Select courier...</option>
                  <option value="bluedart">BlueDart</option>
                  <option value="delhivery">Delhivery</option>
                  <option value="porter">Porter</option>
                  <option value="dtdc">DTDC</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tracking ID */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tracking ID</label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g., BDEL834729"
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
                  />
                </div>

                {/* Number of Boxes */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Number of Boxes</label>
                  <input
                    type="number"
                    value={boxCount}
                    onChange={(e) => setBoxCount(e.target.value)}
                    min="1"
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                  />
                </div>

                {/* Expected Delivery */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Expected Delivery</label>
                  <input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Summary */}
            <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
              <h3 className="text-white font-semibold mb-3">Shipment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Devices:</span>
                  <span className="text-white font-semibold">{selectedDevices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Partner:</span>
                  <span className="text-white">{partner || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Courier:</span>
                  <span className="text-white">{courier || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onBack()}
          className="px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#112240] transition-colors"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>
        
        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && selectedDevices.length === 0}
            className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${
              currentStep === 1 && selectedDevices.length === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
            }`}
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
          >
            Create Shipment
          </button>
        )}
      </div>
    </div>
  );
}

interface ShipmentDetailsProps {
  shipment: Shipment;
  onBack: () => void;
}

function ShipmentDetails({ shipment, onBack }: ShipmentDetailsProps) {
  const [podUploaded, setPodUploaded] = useState(shipment.podUploaded);

  const statusSteps: Array<'Dispatched' | 'In-Transit' | 'Out for Delivery' | 'Delivered'> = [
    'Dispatched',
    'In-Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex = statusSteps.indexOf(shipment.status);

  // Mock device list for this lot
  const lotDevices = mockDevices.slice(0, 5).map((d, i) => ({
    ...d,
    id: `GG-${String(i + 100).padStart(4, '0')}`
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#112240] rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white rotate-180" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Shipment {shipment.id} → {shipment.partner} {shipment.destination}
          </h1>
          <p className="text-gray-400">{shipment.deviceCount} devices • {shipment.courier} • {shipment.trackingId}</p>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStepIndex
                    ? 'bg-[#64FFDA] text-[#0A192F]'
                    : 'bg-[#0A192F] text-gray-400 border-2 border-[#233554]'
                }`}>
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${
                  index <= currentStepIndex ? 'text-white' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${
                  index < currentStepIndex ? 'bg-[#64FFDA]' : 'bg-[#233554]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* POD Vault Section */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Proof of Delivery (POD) Vault</h2>
        
        {!podUploaded ? (
          <div
            onClick={() => setPodUploaded(true)}
            className="border-2 border-dashed border-[#233554] rounded-lg p-12 text-center hover:border-[#64FFDA] transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-white mb-1">Upload Signed POD / Delivery Photo</div>
            <div className="text-sm text-gray-500">Click to upload or drag and drop</div>
            <div className="text-xs text-gray-600 mt-2">PNG, JPG or PDF up to 10MB</div>
          </div>
        ) : (
          <div className="bg-[#0A192F] rounded-lg border border-green-500/20 p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FileText className="w-8 h-8 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">POD_LOT-9921_Signed.pdf</span>
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <Check className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="text-sm text-gray-400">Uploaded on Feb 10, 2026 at 2:45 PM</div>
                <div className="text-xs text-gray-500 mt-1">2.4 MB • Signed by Rajesh Kumar</div>
              </div>
              <button className="p-2 hover:bg-[#112240] rounded-lg transition-colors">
                <Eye className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Device List in Lot */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] overflow-hidden">
        <div className="p-6 border-b border-[#233554]">
          <h2 className="text-xl font-semibold text-white">Devices in This Lot ({lotDevices.length})</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-[#233554] sticky top-0">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-400">Device ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-400">IMEI</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-400">SIM ICCID</th>
              </tr>
            </thead>
            <tbody>
              {lotDevices.map((device) => (
                <tr key={device.id} className="border-b border-[#233554] last:border-0 hover:bg-[#0A192F]/50 transition-colors">
                  <td className="py-3 px-6">
                    <span className="text-white font-mono font-semibold">{device.id}</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-gray-300 font-mono text-sm">{device.imei}</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-gray-300 font-mono text-sm">{device.simIccid}</span>
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

// Helper Components

interface StatWidgetProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: 'blue' | 'emerald' | 'amber';
}

function StatWidget({ icon: Icon, label, value, unit, color }: StatWidgetProps) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    emerald: 'text-[#64FFDA] bg-[#64FFDA]/10',
    amber: 'text-yellow-500 bg-yellow-500/10',
  };

  return (
    <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">{label}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white">{value}</span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceStatusBadge({ status }: { status: string }) {
  const styles = {
    'Available': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Allocated': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Shipped': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function ShipmentStatusBadge({ status }: { status: string }) {
  const styles = {
    'Dispatched': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'In-Transit': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Out for Delivery': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

interface StepIndicatorProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
        active ? 'bg-[#64FFDA] text-[#0A192F]' :
        completed ? 'bg-green-500 text-white' :
        'bg-[#0A192F] text-gray-400 border-2 border-[#233554]'
      }`}>
        {completed ? <Check className="w-5 h-5" /> : <span className="font-semibold">{number}</span>}
      </div>
      <span className={`text-sm whitespace-nowrap ${
        active || completed ? 'text-white' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  );
}

// Add Eye import
import { Eye } from "lucide-react";
