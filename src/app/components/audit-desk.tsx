import { useState } from "react";
import { Filter, MapPin, CheckCircle, XCircle, ZoomIn, ExternalLink, AlertCircle, Calendar, User, Car, X } from "lucide-react";

interface AuditSubmission {
  id: string;
  submissionDate: string;
  partner: string;
  deviceId: string;
  vehicleNumber: string;
  distanceLog: string;
  urgent: boolean;
  city: string;
  photos: {
    front: string;
    rear: string;
    right: string;
    left: string;
    interior1: string;
    interior2: string;
  };
  geoLocation: {
    lat: number;
    lng: number;
  };
  assignedLocation: {
    lat: number;
    lng: number;
  };
}

const mockSubmissions: AuditSubmission[] = [
  {
    id: "AUD-001",
    submissionDate: "09-02-2026 04:50 PM",
    partner: "MetaCabs",
    deviceId: "GG-2024-XP",
    vehicleNumber: "KA 01 AF 5566",
    distanceLog: "Verified: 10m from asset",
    urgent: true,
    city: "Bangalore",
    photos: {
      front: "front.jpg",
      rear: "rear.jpg",
      right: "right.jpg",
      left: "left.jpg",
      interior1: "interior1.jpg",
      interior2: "interior2.jpg"
    },
    geoLocation: { lat: 12.9716, lng: 77.5946 },
    assignedLocation: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: "AUD-002",
    submissionDate: "09-02-2026 02:30 PM",
    partner: "UrbanFleet Media",
    deviceId: "GG-2024-YQ",
    vehicleNumber: "MH 02 BN 7788",
    distanceLog: "Verified: 5m from asset",
    urgent: false,
    city: "Mumbai",
    photos: {
      front: "front.jpg",
      rear: "rear.jpg",
      right: "right.jpg",
      left: "left.jpg",
      interior1: "interior1.jpg",
      interior2: "interior2.jpg"
    },
    geoLocation: { lat: 19.0760, lng: 72.8777 },
    assignedLocation: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: "AUD-003",
    submissionDate: "08-02-2026 11:15 AM",
    partner: "SkyAds",
    deviceId: "GG-2024-ZR",
    vehicleNumber: "DL 03 CK 9988",
    distanceLog: "Verified: 8m from asset",
    urgent: true,
    city: "Delhi",
    photos: {
      front: "front.jpg",
      rear: "rear.jpg",
      right: "right.jpg",
      left: "left.jpg",
      interior1: "interior1.jpg",
      interior2: "interior2.jpg"
    },
    geoLocation: { lat: 28.7041, lng: 77.1025 },
    assignedLocation: { lat: 28.7041, lng: 77.1025 }
  }
];

type View = 'queue' | 'review';

export function AuditDesk() {
  const [currentView, setCurrentView] = useState<View>('queue');
  const [selectedSubmission, setSelectedSubmission] = useState<AuditSubmission | null>(null);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterPartner, setFilterPartner] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const handleStartReview = (submission: AuditSubmission) => {
    setSelectedSubmission(submission);
    setCurrentView('review');
  };

  const handleBackToQueue = () => {
    setCurrentView('queue');
    setSelectedSubmission(null);
  };

  const filteredSubmissions = mockSubmissions.filter(sub => {
    if (filterUrgent && !sub.urgent) return false;
    if (filterPartner && sub.partner !== filterPartner) return false;
    if (filterCity && sub.city !== filterCity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {currentView === 'queue' && (
        <AuditQueue
          submissions={filteredSubmissions}
          onStartReview={handleStartReview}
          filterUrgent={filterUrgent}
          setFilterUrgent={setFilterUrgent}
          filterPartner={filterPartner}
          setFilterPartner={setFilterPartner}
          filterCity={filterCity}
          setFilterCity={setFilterCity}
        />
      )}

      {currentView === 'review' && selectedSubmission && (
        <PhotoReviewer
          submission={selectedSubmission}
          onBack={handleBackToQueue}
          onApprove={handleBackToQueue}
          onReject={handleBackToQueue}
        />
      )}
    </div>
  );
}

interface AuditQueueProps {
  submissions: AuditSubmission[];
  onStartReview: (submission: AuditSubmission) => void;
  filterUrgent: boolean;
  setFilterUrgent: (value: boolean) => void;
  filterPartner: string;
  setFilterPartner: (value: string) => void;
  filterCity: string;
  setFilterCity: (value: string) => void;
}

function AuditQueue({
  submissions,
  onStartReview,
  filterUrgent,
  setFilterUrgent,
  filterPartner,
  setFilterPartner,
  filterCity,
  setFilterCity
}: AuditQueueProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Pending Approvals</h1>
          <p className="text-gray-400">Review and verify device installation submissions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#112240] rounded-lg border border-[#233554]">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-white font-semibold">{submissions.filter(s => s.urgent).length}</span>
          <span className="text-gray-400">Urgent (Stalled &gt; 48h)</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Filters:</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUrgent}
              onChange={(e) => setFilterUrgent(e.target.checked)}
              className="w-4 h-4 rounded border-[#233554] text-[#64FFDA] focus:ring-[#64FFDA] focus:ring-offset-0"
            />
            <span className="text-white">Urgent Only</span>
          </label>

          <select
            value={filterPartner}
            onChange={(e) => setFilterPartner(e.target.value)}
            className="bg-[#0A192F] text-white px-3 py-2 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
          >
            <option value="">All Partners</option>
            <option value="MetaCabs">MetaCabs</option>
            <option value="UrbanFleet Media">UrbanFleet Media</option>
            <option value="SkyAds">SkyAds</option>
          </select>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-[#0A192F] text-white px-3 py-2 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          {(filterUrgent || filterPartner || filterCity) && (
            <button
              onClick={() => {
                setFilterUrgent(false);
                setFilterPartner("");
                setFilterCity("");
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#112240] rounded-lg border border-[#233554] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0A192F] border-b border-[#233554]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Submission Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Partner</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Device ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Vehicle Number</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Distance Log</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className={`border-b border-[#233554] last:border-0 hover:bg-[#0A192F]/50 transition-colors ${
                    submission.urgent ? 'border-l-4 border-l-yellow-500' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{submission.submissionDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{submission.partner}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-mono font-semibold">{submission.deviceId}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-mono">{submission.vehicleNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm">{submission.distanceLog}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onStartReview(submission)}
                      className="px-4 py-2 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#64FFDA]/90 transition-colors font-semibold"
                    >
                      Start Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-20">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">All Caught Up!</h3>
          <p className="text-gray-400">No pending submissions to review</p>
        </div>
      )}
    </>
  );
}

interface PhotoReviewerProps {
  submission: AuditSubmission;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function PhotoReviewer({ submission, onBack, onApprove, onReject }: PhotoReviewerProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [photoStatuses, setPhotoStatuses] = useState({
    front: true,
    rear: true,
    right: true,
    left: true,
    interior1: true,
    interior2: true
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customNote, setCustomNote] = useState("");

  const photoLabels = {
    front: "Front View",
    rear: "Rear View",
    right: "Right Side",
    left: "Left Side",
    interior1: "Interior 1",
    interior2: "Interior 2"
  };

  const handleApprove = () => {
    // In real app, this would call API
    onApprove();
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    // In real app, this would call API with rejection reason
    onReject();
  };

  const togglePhotoStatus = (photo: keyof typeof photoStatuses) => {
    setPhotoStatuses(prev => ({
      ...prev,
      [photo]: !prev[photo]
    }));
  };

  const allPhotosApproved = Object.values(photoStatuses).every(status => status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#112240] rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-white rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              Audit Review: {submission.deviceId}
            </h1>
            <p className="text-gray-400">
              {submission.partner} • {submission.vehicleNumber} • Submitted {submission.submissionDate}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Keyboard Shortcuts</div>
          <div className="text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-[#112240] rounded border border-[#233554] font-mono">Space</kbd> Approve •{' '}
            <kbd className="px-2 py-1 bg-[#112240] rounded border border-[#233554] font-mono">Esc</kbd> Reject
          </div>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Photo Grid (70%) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Installation Photos (6)</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(photoLabels).map(([key, label]) => (
                <PhotoCard
                  key={key}
                  label={label}
                  photoKey={key as keyof typeof photoStatuses}
                  isApproved={photoStatuses[key as keyof typeof photoStatuses]}
                  onToggleStatus={() => togglePhotoStatus(key as keyof typeof photoStatuses)}
                  onZoom={() => setLightboxPhoto(label)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Metadata & Actions (30%) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Device Card */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Device Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Device ID</div>
                <div className="text-white font-mono font-semibold">{submission.deviceId}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Partner</div>
                <div className="text-white">{submission.partner}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Vehicle Number</div>
                <div className="text-white font-mono">{submission.vehicleNumber}</div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#64FFDA] text-[#64FFDA] rounded-lg hover:bg-[#64FFDA]/10 transition-colors text-sm">
                <ExternalLink className="w-4 h-4" />
                View Lifecycle
              </button>
            </div>
          </div>

          {/* Geo-Validation Card */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Geo-Validation</h3>
            
            {/* Mini Map Placeholder */}
            <div className="bg-[#0A192F] rounded-lg border border-[#233554] h-40 flex items-center justify-center mb-3 relative overflow-hidden">
              {/* Simple map visualization */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #233554 0px, #233554 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #233554 0px, #233554 1px, transparent 1px, transparent 20px)'
                }}></div>
              </div>
              <div className="relative z-10 text-center">
                <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-green-500">Location Match: 10m</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Submitted Location:</span>
                <span className="text-white">{submission.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assigned Zone:</span>
                <span className="text-white">{submission.city}</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-xs">Within acceptable range</span>
              </div>
            </div>
          </div>

          {/* Decision Box */}
          <div className="bg-[#112240] rounded-lg border border-[#233554] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Verification Decision</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleApprove}
                disabled={!allPhotosApproved}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  allPhotosApproved
                    ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#64FFDA]/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Approve All
              </button>
              <p className="text-xs text-gray-500 text-center">
                This will activate monetization immediately
              </p>

              <button
                onClick={handleReject}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#FF4D4D] text-[#FF4D4D] rounded-lg hover:bg-[#FF4D4D]/10 transition-colors font-semibold"
              >
                <XCircle className="w-5 h-5" />
                Reject Audit
              </button>
            </div>

            {!allPhotosApproved && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-500">
                    Mark all photos as verified before approving
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <RejectionModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleConfirmReject}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          customNote={customNote}
          setCustomNote={setCustomNote}
        />
      )}
    </div>
  );
}

interface PhotoCardProps {
  label: string;
  photoKey: string;
  isApproved: boolean;
  onToggleStatus: () => void;
  onZoom: () => void;
}

function PhotoCard({ label, isApproved, onToggleStatus, onZoom }: PhotoCardProps) {
  return (
    <div className={`relative bg-[#0A192F] rounded-lg border-2 overflow-hidden transition-colors ${
      isApproved ? 'border-green-500/50' : 'border-[#FF4D4D]/50'
    }`}>
      {/* Photo Placeholder */}
      <div
        onClick={onZoom}
        className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <ZoomIn className="w-8 h-8 text-gray-600" />
      </div>

      {/* Photo Label */}
      <div className="p-3 border-t border-[#233554]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">{label}</span>
          <button
            onClick={onToggleStatus}
            className={`p-1 rounded ${
              isApproved ? 'text-green-500 hover:bg-green-500/10' : 'text-[#FF4D4D] hover:bg-[#FF4D4D]/10'
            }`}
          >
            {isApproved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
        isApproved ? 'bg-green-500 text-white' : 'bg-[#FF4D4D] text-white'
      }`}>
        {isApproved ? 'Pass' : 'Fail'}
      </div>
    </div>
  );
}

interface LightboxProps {
  photo: string;
  onClose: () => void;
}

function Lightbox({ photo, onClose }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-[#112240] hover:bg-[#0A192F] rounded-lg transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-5xl w-full">
        <div className="bg-[#112240] rounded-lg p-4">
          <h3 className="text-xl text-white mb-4">{photo}</h3>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video rounded-lg flex items-center justify-center">
            <ZoomIn className="w-16 h-16 text-gray-600" />
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Click image to zoom • Use mouse wheel to pan
          </p>
        </div>
      </div>
    </div>
  );
}

interface RejectionModalProps {
  onClose: () => void;
  onConfirm: () => void;
  rejectionReason: string;
  setRejectionReason: (value: string) => void;
  customNote: string;
  setCustomNote: (value: string) => void;
}

function RejectionModal({
  onClose,
  onConfirm,
  rejectionReason,
  setRejectionReason,
  customNote,
  setCustomNote
}: RejectionModalProps) {
  const reasons = [
    "Plate Not Visible / Blurry",
    "Wrong Car Model",
    "Device Not Visible in Interior",
    "Geo-Location Mismatch",
    "Other (Type custom note)"
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#112240] rounded-lg border border-[#233554] z-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Reject Audit Submission</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#0A192F] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Rejection Reason</label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            >
              <option value="">Select a reason...</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {(rejectionReason === "Other (Type custom note)" || rejectionReason) && (
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Additional Notes</label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Provide specific details to help the partner fix the issue..."
                rows={4}
                className="w-full bg-[#0A192F] text-white px-4 py-3 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#233554] text-white rounded-lg hover:bg-[#0A192F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!rejectionReason}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                rejectionReason
                  ? 'bg-[#FF4D4D] text-white hover:bg-[#FF4D4D]/90'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send Rejection to Partner
            </button>
          </div>
        </div>
      </div>
    </>
  );
}