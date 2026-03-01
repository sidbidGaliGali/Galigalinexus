import { useState } from "react";
import { ChevronLeft, Upload, Check, Building, FileText, Wallet, Handshake, Loader, AlertCircle, X } from "lucide-react";

interface OnboardingData {
  // Business Profile
  legalEntityName: string;
  brandName: string;
  logo: File | null;
  adminName: string;
  adminMobile: string;
  adminEmail: string;
  address: string;
  pinCode: string;
  
  // KYC Documents
  panNumber: string;
  panDocument: File | null;
  gstin: string;
  gstDocument: File | null;
  incorporationDocument: File | null;
  
  // Banking
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  cancelledCheque: File | null;
  
  // Commercial Terms
  revenueShare: string;
  contractStartDate: string;
  contractEndDate: string;
  targetCities: string[];
  deploymentTarget: string;
  sendWelcomeEmail: boolean;
}

interface PartnerOnboardingProps {
  onBack: () => void;
  onComplete: () => void;
}

export function PartnerOnboarding({ onBack, onComplete }: PartnerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingGST, setIsValidatingGST] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const [data, setData] = useState<OnboardingData>({
    legalEntityName: "",
    brandName: "",
    logo: null,
    adminName: "",
    adminMobile: "",
    adminEmail: "",
    address: "",
    pinCode: "",
    panNumber: "",
    panDocument: null,
    gstin: "",
    gstDocument: null,
    incorporationDocument: null,
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    cancelledCheque: null,
    revenueShare: "70",
    contractStartDate: "",
    contractEndDate: "",
    targetCities: [],
    deploymentTarget: "",
    sendWelcomeEmail: true
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic
    alert("Draft saved successfully!");
  };

  const handleFinalize = () => {
    // Finalize and activate partner
    onComplete();
  };

  const handleGSTINChange = (value: string) => {
    updateData('gstin', value);
    if (value.length === 15) {
      setIsValidatingGST(true);
      // Simulate API call
      setTimeout(() => {
        setIsValidatingGST(false);
      }, 1500);
    }
  };

  const handleIFSCChange = (value: string) => {
    updateData('ifscCode', value);
    if (value.length === 11) {
      // Auto-fetch bank details
      updateData('bankName', 'HDFC Bank');
      updateData('branchName', 'Andheri East, Mumbai');
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return data.legalEntityName && data.brandName && data.adminName && data.adminEmail && data.address;
      case 2:
        return data.panNumber && data.panDocument && data.gstin && data.gstDocument && data.incorporationDocument;
      case 3:
        return data.accountHolderName && data.accountNumber && data.confirmAccountNumber && 
               data.accountNumber === data.confirmAccountNumber && data.ifscCode && data.cancelledCheque;
      case 4:
        return data.revenueShare && data.contractStartDate && data.contractEndDate && 
               data.targetCities.length > 0 && data.deploymentTarget;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, label: "Business", icon: Building },
    { number: 2, label: "KYC", icon: FileText },
    { number: 3, label: "Banking", icon: Wallet },
    { number: 4, label: "Commercials", icon: Handshake }
  ];

  return (
    <div className="min-h-screen bg-[#0A192F] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Media Owners
        </button>

        <h1 className="text-3xl font-semibold text-white mb-8">Onboard New Media Owner</h1>

        {/* Progress Stepper */}
        <div className="bg-[#112240] rounded-lg border border-[#233554] p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-[#64FFDA] text-[#0A192F]' :
                      'bg-[#0A192F] text-gray-400 border-2 border-[#233554]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-500'
                      }`}>
                        Step {step.number}
                      </div>
                      <div className={`text-xs ${
                        isActive || isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-[#233554]'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-[#112240] rounded-lg border border-[#233554] p-8 mb-6">
          {/* Step 1: Business Profile */}
          {currentStep === 1 && (
            <BusinessProfile data={data} updateData={updateData} />
          )}

          {/* Step 2: KYC Documents */}
          {currentStep === 2 && (
            <KYCDocuments 
              data={data} 
              updateData={updateData}
              isValidatingGST={isValidatingGST}
              onGSTINChange={handleGSTINChange}
            />
          )}

          {/* Step 3: Banking & Settlement */}
          {currentStep === 3 && (
            <BankingSettlement 
              data={data} 
              updateData={updateData}
              onIFSCChange={handleIFSCChange}
            />
          )}

          {/* Step 4: Commercial Terms */}
          {currentStep === 4 && (
            <CommercialTerms data={data} updateData={updateData} />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between sticky bottom-0 bg-[#0A192F] py-4">
          <button
            onClick={handleSaveDraft}
            className="px-6 py-3 border border-[#233554] text-gray-400 rounded-lg hover:bg-[#112240] hover:text-white transition-colors"
          >
            Save as Draft
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-[#233554] text-white rounded-lg hover:bg-[#112240] transition-colors"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isStepValid(currentStep)
                  ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? 'Review & Finalize' : 'Next Step'}
            </button>
          </div>
        </div>

        {/* Summary Modal */}
        {showSummary && (
          <SummaryModal
            data={data}
            onClose={() => setShowSummary(false)}
            onConfirm={handleFinalize}
          />
        )}
      </div>
    </div>
  );
}

// Step 1: Business Profile
function BusinessProfile({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Business Profile</h2>
        <p className="text-gray-400">Basic information about the media owner company</p>
      </div>

      <div className="space-y-4">
        {/* Company Details */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Company Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Legal Entity Name *</label>
              <input
                type="text"
                value={data.legalEntityName}
                onChange={(e) => updateData('legalEntityName', e.target.value)}
                placeholder="e.g., MetaCabs Private Limited"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Brand Name *</label>
              <input
                type="text"
                value={data.brandName}
                onChange={(e) => updateData('brandName', e.target.value)}
                placeholder="Used for dashboard display"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Company Logo</label>
            <FileUploadZone
              file={data.logo}
              onFileSelect={(file) => updateData('logo', file)}
              accept="image/png,image/svg+xml"
              label="Upload PNG or SVG (Max 2MB)"
            />
          </div>
        </div>

        {/* Primary Admin Contact */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Primary Admin Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Full Name *</label>
              <input
                type="text"
                value={data.adminName}
                onChange={(e) => updateData('adminName', e.target.value)}
                placeholder="Contact person name"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Mobile Number *</label>
              <input
                type="tel"
                value={data.adminMobile}
                onChange={(e) => updateData('adminMobile', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Work Email *</label>
              <input
                type="email"
                value={data.adminEmail}
                onChange={(e) => updateData('adminEmail', e.target.value)}
                placeholder="email@company.com"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Registered Office Address */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Registered Office Address</h3>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Full Address *</label>
            <textarea
              value={data.address}
              onChange={(e) => updateData('address', e.target.value)}
              placeholder="Street, Area, Landmark"
              rows={3}
              className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors resize-none"
            />
          </div>

          <div className="w-1/3">
            <label className="text-sm text-gray-400 mb-2 block">PIN Code *</label>
            <input
              type="text"
              value={data.pinCode}
              onChange={(e) => updateData('pinCode', e.target.value)}
              placeholder="400001"
              maxLength={6}
              className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: KYC Documents
function KYCDocuments({ 
  data, 
  updateData, 
  isValidatingGST, 
  onGSTINChange 
}: { 
  data: OnboardingData; 
  updateData: (field: keyof OnboardingData, value: any) => void;
  isValidatingGST: boolean;
  onGSTINChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">KYC Documents</h2>
        <p className="text-gray-400">Upload clear digital copies of the following documents</p>
      </div>

      <div className="space-y-4">
        {/* PAN Card */}
        <DocumentCard
          title="PAN Card"
          description="Permanent Account Number"
          file={data.panDocument}
          onFileSelect={(file) => updateData('panDocument', file)}
          textValue={data.panNumber}
          onTextChange={(value) => updateData('panNumber', value.toUpperCase())}
          textPlaceholder="Enter PAN Number (e.g., ABCDE1234F)"
          textMaxLength={10}
        />

        {/* GST Certificate */}
        <DocumentCard
          title="GST Certificate"
          description="Goods and Services Tax Number"
          file={data.gstDocument}
          onFileSelect={(file) => updateData('gstDocument', file)}
          textValue={data.gstin}
          onTextChange={onGSTINChange}
          textPlaceholder="Enter GSTIN (15 characters)"
          textMaxLength={15}
          isValidating={isValidatingGST}
        />

        {/* Certificate of Incorporation */}
        <DocumentCard
          title="Certificate of Incorporation"
          description="Company registration certificate"
          file={data.incorporationDocument}
          onFileSelect={(file) => updateData('incorporationDocument', file)}
        />
      </div>
    </div>
  );
}

// Step 3: Banking & Settlement
function BankingSettlement({ 
  data, 
  updateData,
  onIFSCChange 
}: { 
  data: OnboardingData; 
  updateData: (field: keyof OnboardingData, value: any) => void;
  onIFSCChange: (value: string) => void;
}) {
  const accountsMatch = data.accountNumber && data.confirmAccountNumber && 
                        data.accountNumber === data.confirmAccountNumber;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Banking & Settlement</h2>
        <p className="text-gray-400">Bank account details for revenue payouts</p>
      </div>

      <div className="space-y-4">
        {/* Bank Account Details */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Bank Account Details</h3>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Account Holder Name *</label>
            <input
              type="text"
              value={data.accountHolderName}
              onChange={(e) => updateData('accountHolderName', e.target.value)}
              placeholder="Must match PAN/Cheque"
              className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">This should match your PAN card name</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Account Number *</label>
              <input
                type="text"
                value={data.accountNumber}
                onChange={(e) => updateData('accountNumber', e.target.value)}
                placeholder="Enter account number"
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Confirm Account Number *</label>
              <input
                type="text"
                value={data.confirmAccountNumber}
                onChange={(e) => updateData('confirmAccountNumber', e.target.value)}
                placeholder="Re-enter account number"
                className={`w-full bg-[#112240] text-white px-4 py-3 rounded-lg border transition-colors font-mono ${
                  data.confirmAccountNumber && !accountsMatch
                    ? 'border-[#FF4D4D] focus:border-[#FF4D4D]'
                    : 'border-[#233554] focus:border-[#64FFDA]'
                } focus:outline-none`}
              />
              {data.confirmAccountNumber && !accountsMatch && (
                <p className="text-xs text-[#FF4D4D] mt-1">Account numbers do not match</p>
              )}
              {accountsMatch && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Accounts match
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">IFSC Code *</label>
            <input
              type="text"
              value={data.ifscCode}
              onChange={(e) => onIFSCChange(e.target.value.toUpperCase())}
              placeholder="11-character IFSC code"
              maxLength={11}
              className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
            />
            {data.bankName && (
              <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500">
                  ✓ {data.bankName} - {data.branchName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cancelled Cheque */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Cancelled Cheque</h3>
          <p className="text-sm text-gray-400 mb-4">Upload a cancelled cheque for account verification</p>
          
          <FileUploadZone
            file={data.cancelledCheque}
            onFileSelect={(file) => updateData('cancelledCheque', file)}
            accept="image/*,application/pdf"
            label="Upload Cancelled Cheque (JPG, PNG, or PDF)"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4: Commercial Terms
function CommercialTerms({ data, updateData }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: any) => void }) {
  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];

  const toggleCity = (city: string) => {
    if (data.targetCities.includes(city)) {
      updateData('targetCities', data.targetCities.filter(c => c !== city));
    } else {
      updateData('targetCities', [...data.targetCities, city]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Commercial Terms</h2>
        <p className="text-gray-400">Define the business relationship and contract terms</p>
      </div>

      <div className="space-y-4">
        {/* Revenue Share */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Share Agreement</h3>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Partner Share (%) *</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={data.revenueShare}
                onChange={(e) => updateData('revenueShare', e.target.value)}
                min="0"
                max="100"
                className="w-32 bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors text-center text-2xl font-semibold"
              />
              <span className="text-2xl text-white">%</span>
              <span className="text-gray-400">to Partner</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              GaliGali receives {100 - parseInt(data.revenueShare || "0")}%
            </p>
          </div>
        </div>

        {/* Contract Validity */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Contract Validity Period</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Start Date *</label>
              <input
                type="date"
                value={data.contractStartDate}
                onChange={(e) => updateData('contractStartDate', e.target.value)}
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">End Date *</label>
              <input
                type="date"
                value={data.contractEndDate}
                onChange={(e) => updateData('contractEndDate', e.target.value)}
                className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Target Cities */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Target Cities *</h3>
          <p className="text-sm text-gray-400 mb-4">Select cities where partner will operate</p>
          
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  data.targetCities.includes(city)
                    ? 'bg-[#64FFDA] border-[#64FFDA] text-[#0A192F] font-semibold'
                    : 'bg-[#112240] border-[#233554] text-gray-400 hover:border-[#64FFDA] hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          
          {data.targetCities.length > 0 && (
            <p className="text-sm text-[#64FFDA]">
              {data.targetCities.length} {data.targetCities.length === 1 ? 'city' : 'cities'} selected
            </p>
          )}
        </div>

        {/* Deployment Target */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Deployment Target</h3>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Number of Assets Committed *</label>
            <input
              type="number"
              value={data.deploymentTarget}
              onChange={(e) => updateData('deploymentTarget', e.target.value)}
              placeholder="e.g., 50"
              min="1"
              className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Initial commitment for device deployment</p>
          </div>
        </div>

        {/* Auto-Provisioning */}
        <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.sendWelcomeEmail}
              onChange={(e) => updateData('sendWelcomeEmail', e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-[#233554] text-[#64FFDA] focus:ring-[#64FFDA] focus:ring-offset-0"
            />
            <div>
              <div className="text-white font-medium">Automatically send 'Welcome to GaliGali' email</div>
              <div className="text-sm text-gray-400 mt-1">
                Partner admin will receive login credentials and onboarding materials
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Helper Components

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  accept?: string;
  label: string;
}

function FileUploadZone({ file, onFileSelect, accept, label }: FileUploadZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      {!file ? (
        <label className="block border-2 border-dashed border-[#233554] rounded-lg p-8 text-center hover:border-[#64FFDA] transition-colors cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <div className="text-white mb-1">{label}</div>
          <div className="text-sm text-gray-500">Click to browse or drag and drop</div>
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
        </label>
      ) : (
        <div className="bg-[#112240] rounded-lg border border-green-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-white font-medium">{file.name}</div>
              <div className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null as any)}
            className="p-2 hover:bg-[#0A192F] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}

interface DocumentCardProps {
  title: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  textValue?: string;
  onTextChange?: (value: string) => void;
  textPlaceholder?: string;
  textMaxLength?: number;
  isValidating?: boolean;
}

function DocumentCard({
  title,
  description,
  file,
  onFileSelect,
  textValue,
  onTextChange,
  textPlaceholder,
  textMaxLength,
  isValidating
}: DocumentCardProps) {
  return (
    <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {textValue !== undefined && onTextChange && (
        <div className="relative">
          <input
            type="text"
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={textPlaceholder}
            maxLength={textMaxLength}
            className="w-full bg-[#112240] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors font-mono"
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-yellow-500">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Validating...</span>
            </div>
          )}
        </div>
      )}

      <FileUploadZone
        file={file}
        onFileSelect={onFileSelect}
        accept="image/*,application/pdf"
        label="Upload Document"
      />
    </div>
  );
}

// Summary Modal
interface SummaryModalProps {
  data: OnboardingData;
  onClose: () => void;
  onConfirm: () => void;
}

function SummaryModal({ data, onClose, onConfirm }: SummaryModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-[#112240] rounded-lg border border-[#233554] z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Review Partner Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#0A192F] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Business Profile Summary */}
          <SummarySection title="Business Profile">
            <SummaryItem label="Legal Entity Name" value={data.legalEntityName} />
            <SummaryItem label="Brand Name" value={data.brandName} />
            <SummaryItem label="Admin Contact" value={`${data.adminName} (${data.adminEmail})`} />
            <SummaryItem label="Mobile" value={data.adminMobile} />
          </SummarySection>

          {/* KYC Summary */}
          <SummarySection title="KYC Documents">
            <SummaryItem label="PAN Number" value={data.panNumber} />
            <SummaryItem label="GSTIN" value={data.gstin} />
            <SummaryItem label="Documents Uploaded" value="3 files" />
          </SummarySection>

          {/* Banking Summary */}
          <SummarySection title="Banking Details">
            <SummaryItem label="Account Holder" value={data.accountHolderName} />
            <SummaryItem label="Account Number" value={`****${data.accountNumber.slice(-4)}`} />
            <SummaryItem label="IFSC Code" value={data.ifscCode} />
            <SummaryItem label="Bank" value={data.bankName} />
          </SummarySection>

          {/* Commercial Terms Summary */}
          <SummarySection title="Commercial Terms">
            <SummaryItem label="Revenue Share" value={`${data.revenueShare}% to Partner`} />
            <SummaryItem label="Contract Period" value={`${data.contractStartDate} to ${data.contractEndDate}`} />
            <SummaryItem label="Target Cities" value={data.targetCities.join(', ')} />
            <SummaryItem label="Deployment Target" value={`${data.deploymentTarget} assets`} />
          </SummarySection>

          {/* Alerts */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-500">
                <strong>Final Review:</strong> Please verify all information is correct before activating this partner. Once activated, the partner will have immediate access to their dashboard.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-[#233554]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#233554] text-white rounded-lg hover:bg-[#0A192F] transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
          >
            Finalize & Activate Partner
          </button>
        </div>
      </div>
    </>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0A192F] rounded-lg border border-[#233554] p-4">
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}:</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
