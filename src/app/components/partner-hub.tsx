import { useState } from "react";
import { Plus, Eye, X, Check, Upload, Calendar } from "lucide-react";
import { PartnerOnboarding } from "./partner-onboarding";

type PartnerView = 'list' | 'onboarding' | 'review';

interface Partner {
  id: string;
  name: string;
  logo: string;
  status: 'KYC Pending' | 'Active' | 'Blacklisted';
  fleetSize: number;
  revShare: string;
  lastPayout: {
    amount: string;
    date: string;
  };
}

const mockPartners: Partner[] = [
  {
    id: "PTR-001",
    name: "MetaCabs",
    logo: "MC",
    status: "Active",
    fleetSize: 45,
    revShare: "70/30",
    lastPayout: { amount: "$12,450.00", date: "Feb 5, 2026" }
  },
  {
    id: "PTR-002",
    name: "SkyAds",
    logo: "SA",
    status: "KYC Pending",
    fleetSize: 0,
    revShare: "-",
    lastPayout: { amount: "-", date: "-" }
  },
  {
    id: "PTR-003",
    name: "TechVision Solutions",
    logo: "TV",
    status: "KYC Pending",
    fleetSize: 0,
    revShare: "-",
    lastPayout: { amount: "-", date: "-" }
  },
  {
    id: "PTR-004",
    name: "UrbanFleet Media",
    logo: "UF",
    status: "Active",
    fleetSize: 62,
    revShare: "65/35",
    lastPayout: { amount: "$18,920.00", date: "Feb 3, 2026" }
  },
  {
    id: "PTR-005",
    name: "AdWheels India",
    logo: "AW",
    status: "Blacklisted",
    fleetSize: 0,
    revShare: "-",
    lastPayout: { amount: "$3,200.00", date: "Jan 12, 2026" }
  }
];

export function PartnerHub() {
  const [currentView, setCurrentView] = useState<PartnerView>('list');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleReviewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedPartner(null), 300);
  };

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentView('list');
    // Refresh partner list
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  if (currentView === 'onboarding') {
    return (
      <PartnerOnboarding 
        onBack={handleBackToList}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Media Owners</h1>
          <p className="text-gray-400">Manage partner onboarding and KYC verification</p>
        </div>
        <button 
          onClick={handleStartOnboarding}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Onboard New Partner
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Partners" value="5" />
        <StatCard label="Active" value="2" color="green" />
        <StatCard label="Pending KYC" value="2" color="amber" />
        <StatCard label="Blacklisted" value="1" color="red" />
      </div>

      {/* Partner Table */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-[#233554]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Partner Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Onboarding Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Fleet Size</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Rev Share %</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Last Payout</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockPartners.map((partner) => (
                <tr key={partner.id} className="border-b border-[#233554] last:border-0 hover:bg-[#0A192F]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#64FFDA] flex items-center justify-center font-semibold text-[#0A192F]">
                        {partner.logo}
                      </div>
                      <div>
                        <div className="text-white font-medium">{partner.name}</div>
                        <div className="text-sm text-gray-500">{partner.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={partner.status} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white">{partner.fleetSize} devices</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-mono">{partner.revShare}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-white">{partner.lastPayout.amount}</div>
                      <div className="text-sm text-gray-500">{partner.lastPayout.date}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleReviewPartner(partner)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Review Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Review Drawer */}
      {isDrawerOpen && selectedPartner && (
        <KYCDrawer partner={selectedPartner} onClose={closeDrawer} />
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color?: 'green' | 'amber' | 'red';
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorClasses = {
    green: 'text-green-500',
    amber: 'text-yellow-500',
    red: 'text-[#FF4D4D]',
  };

  return (
    <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className={`text-3xl font-semibold ${color ? colorClasses[color] : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'KYC Pending' | 'Active' | 'Blacklisted';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    'KYC Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Active': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Blacklisted': 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/20',
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
}

interface KYCDrawerProps {
  partner: Partner;
  onClose: () => void;
}

function KYCDrawer({ partner, onClose }: KYCDrawerProps) {
  const [panVerified, setPanVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [chequeVerified, setChequeVerified] = useState(false);
  const [revShare, setRevShare] = useState("70");
  const [startDate, setStartDate] = useState("2026-02-10");
  const [endDate, setEndDate] = useState("2027-02-10");

  const allDocsVerified = panVerified && gstVerified && chequeVerified;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full md:w-[40%] bg-[#0A192F] border-l border-[#233554] z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#233554]">
          <div>
            <h2 className="text-2xl font-semibold text-white">{partner.name}</h2>
            <p className="text-sm text-gray-400 mt-1">KYC Review & Configuration</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#112240] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Legal Identity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal Identity</h3>
            
            {/* PAN Card */}
            <DocumentCard
              title="PAN Card"
              verified={panVerified}
              onVerify={() => setPanVerified(true)}
              onReject={() => setPanVerified(false)}
            />

            {/* GST Certificate */}
            <DocumentCard
              title="GST Certificate"
              verified={gstVerified}
              onVerify={() => setGstVerified(true)}
              onReject={() => setGstVerified(false)}
            />
          </div>

          {/* Section 2: Bank Vault */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Bank Vault (Settlement)</h3>
            
            <div className="bg-[#112240] rounded-lg border border-[#233554] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Account Name</label>
                  <div className="text-white font-medium">MetaCabs Pvt Ltd</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Account Number</label>
                  <div className="text-white font-mono">****9847</div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">IFSC Code</label>
                <div className="text-white font-mono">HDFC0001234</div>
              </div>
            </div>

            {/* Cancelled Cheque */}
            <DocumentCard
              title="Cancelled Cheque"
              verified={chequeVerified}
              onVerify={() => setChequeVerified(true)}
              onReject={() => setChequeVerified(false)}
            />
          </div>

          {/* Section 3: Commercial Config */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Commercial Configuration</h3>
            
            <div className="space-y-4">
              {/* Revenue Share */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Revenue Share (% to Partner)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={revShare}
                    onChange={(e) => setRevShare(e.target.value)}
                    className="flex-1 bg-[#112240] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                    min="0"
                    max="100"
                  />
                  <span className="text-white font-medium">% to Partner</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">GaliGali receives {100 - parseInt(revShare || "0")}%</p>
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#112240] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#112240] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Assigned City */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Assigned City</label>
                <select
                  multiple
                  className="w-full bg-[#112240] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors h-24"
                >
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="chennai">Chennai</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>

          {/* Section 4: User Provisioning */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">User Provisioning</h3>
            
            <div className="bg-[#112240] rounded-lg border border-[#233554] p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Primary Admin Contact</label>
                <div className="text-white font-medium">Rajesh Kumar</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <div className="text-white text-sm">rajesh@metacabs.com</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Mobile</label>
                  <div className="text-white text-sm">+91 98765 43210</div>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors">
              <Upload className="w-4 h-4" />
              Create Admin Account & Send Welcome Email
            </button>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-[#233554] p-6 bg-[#0A192F]">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#112240] transition-colors">
              Save Draft
            </button>
            <button
              disabled={!allDocsVerified}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                allDocsVerified
                  ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Approve Partner & Activate Dashboard
            </button>
          </div>
          {!allDocsVerified && (
            <p className="text-xs text-yellow-500 mt-2 text-center">
              Please verify all documents before approving
            </p>
          )}
        </div>
      </div>
    </>
  );
}

interface DocumentCardProps {
  title: string;
  verified: boolean;
  onVerify: () => void;
  onReject: () => void;
}

function DocumentCard({ title, verified, onVerify, onReject }: DocumentCardProps) {
  return (
    <div className="bg-[#112240] rounded-lg border border-[#233554] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-medium">{title}</span>
        {verified && (
          <span className="flex items-center gap-1 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            Verified
          </span>
        )}
      </div>
      
      {/* Document Thumbnail */}
      <div className="bg-[#0A192F] rounded border border-[#233554] h-32 flex items-center justify-center mb-3 cursor-pointer hover:border-[#64FFDA] transition-colors group">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-600 group-hover:text-[#64FFDA] mx-auto mb-2" />
          <span className="text-sm text-gray-500 group-hover:text-gray-400">Click to view document</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onVerify}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20"
        >
          <Check className="w-4 h-4" />
          Verify
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FF4D4D]/10 text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/20 transition-colors border border-[#FF4D4D]/20"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
}