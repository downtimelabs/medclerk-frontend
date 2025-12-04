import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Star, Award, Phone, Mail } from 'lucide-react';

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
    image: doctor.image || doctor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'D')}&background=0D8ABC&color=fff`,
    address: doctor.address ? (typeof doctor.address === 'string' ? doctor.address : doctor.address.city) :
      (doctor.profile?.clinicAddress?.street || doctor.profile?.clinicAddress?.city || ''),
    rating: doctor.rating || 4.8, // Placeholder as API might not return it yet
    reviews: doctor.reviews || 124,
    experience: doctor.experience || (doctor.yearsOfExperience ? `${doctor.yearsOfExperience} Years` : null) || (doctor.profile?.yearsOfExperience ? `${doctor.profile.yearsOfExperience} Years` : '5+ Years'),
    about: doctor.about
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
                    <p className="text-[#0277BD] font-medium">{normalizedDoctor.specialization}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <MapPin size={14} />
                      {normalizedDoctor.clinic} {normalizedDoctor.address ? `• ${normalizedDoctor.address}` : ''}
                    </div>
                  </div>
                  {normalizedDoctor.rating && (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-slate-900">{normalizedDoctor.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1">{normalizedDoctor.reviews} reviews</span>
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <div className="flex justify-center mb-2 text-[#0277BD]">
                      <Award size={20} />
                    </div>
                    <div className="font-bold text-slate-900">{normalizedDoctor.experience}</div>
                    <div className="text-xs text-slate-500">Experience</div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {normalizedDoctor.about ||
                      `${normalizedDoctor.name} is a highly skilled ${normalizedDoctor.specialization} with over ${normalizedDoctor.experience} of experience. 
                      Dedicated to providing comprehensive care and building long-lasting relationships with patients. 
                      Specializes in preventive care, diagnosis, and treatment of various conditions.`}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                      <Phone size={14} />
                    </div>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                      <Mail size={14} />
                    </div>
                    <span>contact@{normalizedDoctor.clinic.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                  </div>
                </div>


              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DoctorProfileModal;
