import { useState } from "react";
import { DollarSign, Upload, FileText, CheckCircle, Clock, AlertTriangle, Download, ChevronRight, X, Shield, Edit } from "lucide-react";

interface PartnerPayout {
  id: string;
  partner: string;
  earnedRevenue: number;
  galiGaliCut: number;
  netPayable: number;
  status: 'Awaiting Invoice' | 'Invoice Uploaded' | 'Processing' | 'Settled';
  month: string;
  gstAmount: number;
  validAdSeconds: number;
  fraudulentSeconds: number;
}

const mockPayouts: PartnerPayout[] = [
  {
    id: "PAY-001",
    partner: "MetaCabs",
    earnedRevenue: 2450000,
    galiGaliCut: 735000,
    netPayable: 1715000,
    status: "Invoice Uploaded",
    month: "Feb 2026",
    gstAmount: 308700,
    validAdSeconds: 4800000,
    fraudulentSeconds: 120000
  },
  {
    id: "PAY-002",
    partner: "UrbanFleet Media",
    earnedRevenue: 1820000,
    galiGaliCut: 637000,
    netPayable: 1183000,
    status: "Processing",
    month: "Feb 2026",
    gstAmount: 212940,
    validAdSeconds: 3600000,
    fraudulentSeconds: 85000
  },
  {
    id: "PAY-003",
    partner: "SkyAds",
    earnedRevenue: 980000,
    galiGaliCut: 294000,
    netPayable: 686000,
    status: "Awaiting Invoice",
    month: "Feb 2026",
    gstAmount: 123480,
    validAdSeconds: 2100000,
    fraudulentSeconds: 42000
  },
  {
    id: "PAY-004",
    partner: "TechVision Solutions",
    earnedRevenue: 1250000,
    galiGaliCut: 375000,
    netPayable: 875000,
    status: "Settled",
    month: "Jan 2026",
    gstAmount: 157500,
    validAdSeconds: 2800000,
    fraudulentSeconds: 0
  }
];

type FinanceView = 'overview' | 'processing';

export function FinanceDesk() {
  const [currentView, setCurrentView] = useState<FinanceView>('overview');
  const [selectedPayout, setSelectedPayout] = useState<PartnerPayout | null>(null);

  const totalMonthlyPayouts = mockPayouts.reduce((sum, p) => sum + p.earnedRevenue, 0);
  const totalPending = mockPayouts
    .filter(p => p.status !== 'Settled')
    .reduce((sum, p) => sum + p.netPayable, 0);
  const totalGST = mockPayouts.reduce((sum, p) => sum + p.gstAmount, 0);

  const handleProcessPayout = (payout: PartnerPayout) => {
    setSelectedPayout(payout);
    setCurrentView('processing');
  };

  const handleBack = () => {
    setCurrentView('overview');
    setSelectedPayout(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'overview' && (
        <FinanceOverview
          payouts={mockPayouts}
          totalMonthlyPayouts={totalMonthlyPayouts}
          totalPending={totalPending}
          totalGST={totalGST}
          onProcessPayout={handleProcessPayout}
        />
      )}

      {currentView === 'processing' && selectedPayout && (
        <PayoutProcessing
          payout={selectedPayout}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

interface FinanceOverviewProps {
  payouts: PartnerPayout[];
  totalMonthlyPayouts: number;
  totalPending: number;
  totalGST: number;
  onProcessPayout: (payout: PartnerPayout) => void;
}

function FinanceOverview({
  payouts,
  totalMonthlyPayouts,
  totalPending,
  totalGST,
  onProcessPayout
}: FinanceOverviewProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Finance & Settlement Hub</h1>
        <p className="text-gray-400">Manage partner payouts, invoices, and revenue distribution</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceSummaryCard
          icon={DollarSign}
          label="Total Payouts (Monthly)"
          value={formatCurrency(totalMonthlyPayouts)}
          color="emerald"
          subtext="Across all partners"
        />
        <FinanceSummaryCard
          icon={Clock}
          label="Pending Settlements"
          value={formatCurrency(totalPending)}
          color="amber"
          subtext={`${payouts.filter(p => p.status !== 'Settled').length} partners awaiting`}
        />
        <FinanceSummaryCard
          icon={FileText}
          label="GST Collected"
          value={formatCurrency(totalGST)}
          color="blue"
          subtext="18% on all transactions"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard
          label="Awaiting Invoice"
          value={payouts.filter(p => p.status === 'Awaiting Invoice').length}
          color="red"
        />
        <QuickStatCard
          label="Invoice Uploaded"
          value={payouts.filter(p => p.status === 'Invoice Uploaded').length}
          color="amber"
        />
        <QuickStatCard
          label="Processing"
          value={payouts.filter(p => p.status === 'Processing').length}
          color="blue"
        />
        <QuickStatCard
          label="Settled"
          value={payouts.filter(p => p.status === 'Settled').length}
          color="green"
        />
      </div>

      {/* Payout Table */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] overflow-hidden">
        <div className="p-6 border-b border-[#233554]">
          <h2 className="text-xl font-semibold text-white">Partner Payouts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-[#233554]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Partner</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Earned Revenue</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">GaliGali Cut (30%)</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Net Payable (70%)</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="border-b border-[#233554] last:border-0 hover:bg-[#0A192F]/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{payout.partner}</div>
                    <div className="text-sm text-gray-500">{payout.month}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="text-white font-mono">{formatCurrency(payout.earnedRevenue)}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="text-gray-400 font-mono">{formatCurrency(payout.galiGaliCut)}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="text-[#64FFDA] font-mono font-semibold">{formatCurrency(payout.netPayable)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <PayoutStatusBadge status={payout.status} />
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onProcessPayout(payout)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
                    >
                      Process
                      <ChevronRight className="w-4 h-4" />
                    </button>
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

interface PayoutProcessingProps {
  payout: PartnerPayout;
  onBack: () => void;
}

function PayoutProcessing({ payout, onBack }: PayoutProcessingProps) {
  const [invoiceUploaded, setInvoiceUploaded] = useState(payout.status !== 'Awaiting Invoice');
  const [utrNumber, setUtrNumber] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [showDiscrepancy, setShowDiscrepancy] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const requiresDoubleApproval = payout.netPayable > 500000;

  const handleMarkAsPaid = () => {
    if (requiresDoubleApproval) {
      setShowApprovalModal(true);
    } else {
      // Process payment
      onBack();
    }
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
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Payout Processing: {payout.partner} - {payout.month}
          </h1>
          <p className="text-gray-400">Complete invoice verification and settlement</p>
        </div>
        {requiresDoubleApproval && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Requires Second Admin Approval</span>
          </div>
        )}
      </div>

      {/* Main Processing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Processing */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Revenue Validation */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Revenue Validation</h2>
            
            <div className="space-y-4">
              {/* Ad Seconds Breakdown */}
              <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Valid Ad-Seconds</span>
                  <span className="text-[#64FFDA] font-mono font-semibold">
                    {payout.validAdSeconds.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Fraudulent/Paused Seconds</span>
                  <span className="text-[#FF4D4D] font-mono font-semibold">
                    -{payout.fraudulentSeconds.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-[#233554] pt-4 flex items-center justify-between">
                  <span className="text-white font-semibold">Net Valid Seconds</span>
                  <span className="text-white font-mono font-semibold">
                    {(payout.validAdSeconds - payout.fraudulentSeconds).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Gross Revenue</span>
                    <span className="text-white font-mono">{formatCurrency(payout.earnedRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GaliGali Commission (30%)</span>
                    <span className="text-gray-400 font-mono">-{formatCurrency(payout.galiGaliCut)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GST (18%)</span>
                    <span className="text-gray-400 font-mono">+{formatCurrency(payout.gstAmount)}</span>
                  </div>
                  <div className="border-t border-[#233554] pt-3 flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Final Net Amount</span>
                    <span className="text-[#64FFDA] font-mono font-semibold text-xl">
                      {formatCurrency(payout.netPayable)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Discrepancy Tool */}
              <button
                onClick={() => setShowDiscrepancy(!showDiscrepancy)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#233554] text-gray-400 rounded-lg hover:bg-[#0A192F] hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                {showDiscrepancy ? 'Hide' : 'Show'} Manual Adjustment Tool
              </button>

              {showDiscrepancy && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-yellow-500 font-semibold mb-1">Internal Adjustment</div>
                      <div className="text-sm text-gray-400">Use for hardware damage penalties or bonus incentives</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Adjustment Amount (₹)</label>
                      <input
                        type="number"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        placeholder="Enter amount (use - for deduction)"
                        className="w-full bg-[#0A192F] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Reason for Adjustment *</label>
                      <textarea
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                        placeholder="Mandatory reason for audit trail..."
                        rows={3}
                        className="w-full bg-[#0A192F] text-white px-4 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors resize-none"
                      />
                    </div>
                    <button
                      disabled={!adjustmentAmount || !adjustmentReason}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                        adjustmentAmount && adjustmentReason
                          ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Apply Adjustment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Invoice Management */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Invoice Management</h2>
            
            {!invoiceUploaded ? (
              <div
                onClick={() => setInvoiceUploaded(true)}
                className="border-2 border-dashed border-[#233554] rounded-lg p-12 text-center hover:border-[#64FFDA] transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <div className="text-white mb-1">Drag & Drop Partner Invoice (GST Format)</div>
                <div className="text-sm text-gray-500">or click to browse</div>
                <div className="text-xs text-gray-600 mt-2">PDF, up to 5MB</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#0A192F] rounded-lg border border-green-500/20 p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">Invoice_MetaCabs_Feb2026.pdf</span>
                        <span className="flex items-center gap-1 text-green-500 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Uploaded
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">Uploaded on Feb 10, 2026 at 3:15 PM</div>
                      <div className="text-xs text-gray-500 mt-1">2.1 MB</div>
                    </div>
                    <button className="p-2 hover:bg-[#112240] rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* KYC Verification */}
                <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
                  <h3 className="text-white font-semibold mb-3">Partner KYC Verification</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">PAN Number</div>
                      <div className="text-white font-mono">ABCDE1234F</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">GST Number</div>
                      <div className="text-white font-mono">29ABCDE1234F1Z5</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Account Number</div>
                      <div className="text-white font-mono">****9847</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">IFSC Code</div>
                      <div className="text-white font-mono">HDFC0001234</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#233554]">
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Invoice details match KYC records</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Settlement Details */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settlement Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">UTR / Transaction ID</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="Enter UTR number from bank transfer"
                  className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Date of Transfer</label>
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
                />
              </div>

              <button
                onClick={handleMarkAsPaid}
                disabled={!invoiceUploaded || !utrNumber || !transferDate}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                  invoiceUploaded && utrNumber && transferDate
                    ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark as Paid & Notify Partner
                </div>
              </button>

              {!invoiceUploaded || !utrNumber || !transferDate && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-500">
                      Complete all fields to mark payment as settled
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Payment Summary Card */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-[#0A192F] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Total Payable</div>
                <div className="text-3xl font-semibold text-[#64FFDA]">
                  {formatCurrency(payout.netPayable)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Partner:</span>
                  <span className="text-white font-medium">{payout.partner}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Period:</span>
                  <span className="text-white">{payout.month}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <PayoutStatusBadge status={payout.status} />
                </div>
              </div>

              <div className="pt-4 border-t border-[#233554]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    invoiceUploaded ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-400">Invoice Uploaded</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    utrNumber ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-400">UTR Entered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    transferDate ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-400">Transfer Date Set</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Audit Trail</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="text-white">Invoice Uploaded</div>
                  <div className="text-xs text-gray-500">Feb 10, 2026 3:15 PM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="text-white">Revenue Validated</div>
                  <div className="text-xs text-gray-500">Feb 10, 2026 2:30 PM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <div className="text-white">Payout Initiated</div>
                  <div className="text-xs text-gray-500">Feb 10, 2026 11:00 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Admin Approval Modal */}
      {showApprovalModal && (
        <SecondApprovalModal
          payout={payout}
          onClose={() => setShowApprovalModal(false)}
          onApprove={() => {
            setShowApprovalModal(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}

// Helper Components

interface FinanceSummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'emerald' | 'amber' | 'blue';
  subtext: string;
}

function FinanceSummaryCard({ icon: Icon, label, value, color, subtext }: FinanceSummaryCardProps) {
  const colors = {
    emerald: 'text-[#64FFDA] bg-[#64FFDA]/10',
    amber: 'text-yellow-500 bg-yellow-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  };

  return (
    <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">{label}</div>
          <div className={`text-2xl font-semibold ${colors[color].split(' ')[0]}`}>
            {value}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}

interface QuickStatCardProps {
  label: string;
  value: number;
  color: 'red' | 'amber' | 'blue' | 'green';
}

function QuickStatCard({ label, value, color }: QuickStatCardProps) {
  const colors = {
    red: 'text-[#FF4D4D] bg-[#FF4D4D]/10 border-[#FF4D4D]/20',
    amber: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20'
  };

  return (
    <div className={`bg-[#112240] rounded-lg border p-4 ${colors[color]}`}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-3xl font-semibold ${colors[color].split(' ')[0]}`}>{value}</div>
    </div>
  );
}

function PayoutStatusBadge({ status }: { status: string }) {
  const styles = {
    'Awaiting Invoice': 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/20',
    'Invoice Uploaded': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Settled': 'bg-green-500/10 text-green-500 border-green-500/20'
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

interface SecondApprovalModalProps {
  payout: PartnerPayout;
  onClose: () => void;
  onApprove: () => void;
}

function SecondApprovalModal({ payout, onClose, onApprove }: SecondApprovalModalProps) {
  const [approverName, setApproverName] = useState("");
  const [approverPassword, setApproverPassword] = useState("");

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#112240] rounded-lg border-2 border-[#64FFDA] z-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#64FFDA]/10 rounded-lg">
            <Shield className="w-8 h-8 text-[#64FFDA]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Second Admin Approval</h3>
            <p className="text-sm text-gray-400">Required for payouts &gt; ₹5L</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div className="text-sm text-yellow-500">
            <strong>High-Value Transaction</strong>
            <div className="mt-2 space-y-1">
              <div>Partner: <strong>{payout.partner}</strong></div>
              <div>Amount: <strong>{formatCurrency(payout.netPayable)}</strong></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Approver Name</label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Admin Password</label>
            <input
              type="password"
              value={approverPassword}
              onChange={(e) => setApproverPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#0A192F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onApprove}
              disabled={!approverName || !approverPassword}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                approverName && approverPassword
                  ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Approve Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
