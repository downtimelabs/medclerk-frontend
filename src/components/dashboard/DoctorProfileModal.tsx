import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Award, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import StarRating from '../common/StarRating';
import RatingModal from '../common/RatingModal';
import { getRatingStats, getMyRating, type RatingStats, type Rating } from '../../api/rating';
import { Button } from '../../components/ui/Button';

interface DoctorProfileModalProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
}

const DoctorProfileModal = ({ doctor, isOpen, onClose }: DoctorProfileModalProps) => {
  if (!doctor) return null;

  // Normalize data from different API responses (LinkedDoctor vs PublicDoctorProfile)
  const normalizedDoctor = {
    name: doctor.name || 'Unknown Doctor',
    specialization: doctor.specialization || doctor.profile?.specialization || 'General Physician',
    clinic: doctor.clinic || doctor.clinicName || doctor.profile?.clinicName || 'Private Clinic',
    image: doctor.image || doctor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'D')}&background=0277BD&color=fff`,
    address: doctor.address ? (typeof doctor.address === 'string' ? doctor.address : doctor.address.city) :
      (doctor.profile?.clinicAddress?.street || doctor.profile?.clinicAddress?.city || ''),
    // Removed hardcoded rating and reviews
    experience: doctor.experience || (doctor.yearsOfExperience ? `${doctor.yearsOfExperience} Years` : null) || (doctor.profile?.yearsOfExperience ? `${doctor.profile.yearsOfExperience} Years` : null),
    about: doctor.about, // Only show if explicitly provided
    email: doctor.email,
    id: doctor.userId || doctor.id // Ensure we have an ID
  };

  const [stats, setStats] = useState<RatingStats | null>(null);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  // Fetch stats and my rating when modal opens
  useEffect(() => {
    if (isOpen && normalizedDoctor.id) {
      // Reset state
      setStats(null);
      setMyRating(null);

      const fetchData = async () => {
        try {
          const [statsData, myRatingData] = await Promise.all([
            getRatingStats(normalizedDoctor.id),
            getMyRating(normalizedDoctor.id).catch(() => null) // Ignore error if not logged in or other issue
          ]);
          setStats(statsData);
          setMyRating(myRatingData);
        } catch (error) {
          console.error('Failed to fetch rating data:', error);
        }
      };

      fetchData();
    }
  }, [isOpen, normalizedDoctor.id]);

  const handleRatingSuccess = () => {
    // Refresh data after successful rating
    if (normalizedDoctor.id) {
      getRatingStats(normalizedDoctor.id).then(setStats);
      getMyRating(normalizedDoctor.id).then(setMyRating);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors z-10"
              >
                <X size={20} className="text-slate-500" />
              </button>

              {/* Header Image/Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-[#0277BD] relative">
                <div className="absolute -bottom-10 left-6">
                  <img
                    src={normalizedDoctor.image}
                    alt={normalizedDoctor.name}
                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md bg-white"
                  />
                </div>
              </div>

              <div className="pt-12 px-6 pb-6">
                {/* Basic Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{normalizedDoctor.name}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-[#0277BD] font-medium">{normalizedDoctor.specialization}</p>
                      {stats && stats.totalReviews > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                          <StarRating rating={stats.averageRating} size={12} readOnly />
                          <span className="text-xs font-bold text-slate-700">{stats.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-slate-400">({stats.totalReviews})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <MapPin size={14} />
                      {normalizedDoctor.clinic} {normalizedDoctor.address ? `• ${normalizedDoctor.address}` : ''}
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Only show if experience exists */}
                {normalizedDoctor.experience && (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                      <div className="flex justify-center mb-2 text-[#0277BD]">
                        <Award size={20} />
                      </div>
                      <div className="font-bold text-slate-900">{normalizedDoctor.experience}</div>
                      <div className="text-xs text-slate-500">Experience</div>
                    </div>
                  </div>
                )}

                {/* About Section - Only show if bio exists */}
                {normalizedDoctor.about && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {normalizedDoctor.about}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
                  {normalizedDoctor.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                        <Mail size={14} />
                      </div>
                      <span>{normalizedDoctor.email}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Rating Action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {myRating ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-700">Your Rating</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={myRating.rating} size={16} readOnly />
                      <span className="text-sm text-slate-500">
                        {myRating.rating}/5
                        {myRating.comment && ' • "' + myRating.comment + '"'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsRateModalOpen(true)}
                    className="w-full justify-center"
                  >
                    Rate Doctor
                  </Button>
                )}
              </div>

            </motion.div>
          </motion.div>

          <RatingModal
            isOpen={isRateModalOpen}
            onClose={() => setIsRateModalOpen(false)}
            targetName={normalizedDoctor.name}
            targetId={normalizedDoctor.id}
            onSuccess={handleRatingSuccess}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default DoctorProfileModal;
