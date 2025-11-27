import { useState } from 'react';
import { Search, MapPin, Star, Stethoscope, Filter, Clock, ChevronRight, UserPlus, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const linkedDoctors = [
  {
    id: 101,
    name: "Dr. Sarah Wilson",
    specialization: "Cardiologist",
    clinic: "Heart Care Center",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    lastConsultation: "Oct 24, 2024",
    status: "active"
  },
  {
    id: 102,
    name: "Dr. Emily Parker",
    specialization: "Pediatrician",
    clinic: "Little Stars Pediatrics",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    lastConsultation: "Sep 12, 2024",
    status: "active"
  },
  {
    id: 103,
    name: "Dr. Ayesha Khan",
    specialization: "Gynecologist",
    clinic: "Women's Wellness",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
    lastConsultation: "Nov 01, 2024",
    status: "active"
  }
];

const pendingRequests = [
  {
    id: 201,
    name: "Dr. Rahul Sharma",
    specialization: "Orthopedic",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    date: "Sent 2 days ago"
  },
  {
    id: 202,
    name: "Dr. Anjali Mehta",
    specialization: "Dermatologist",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
    date: "Sent yesterday"
  }
];

const popularSpecializations = [
  "Cardiologist", "Dermatologist", "Pediatrician", "General Physician", "Neurologist", "Orthopedic"
];

const exploreDoctors = [
  {
    id: 301,
    name: "Dr. Michael Ross",
    specialization: "General Physician",
    experience: "20 years",
    clinic: "City Health Clinic",
    address: "321 5th Ave, New York",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    tags: ["Popular", "Nearby"]
  },
  {
    id: 302,
    name: "Dr. Lisa Chang",
    specialization: "Neurologist",
    experience: "15 years",
    clinic: "Brain & Spine Institute",
    address: "88 West End, New York",
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    tags: ["Top Rated"]
  },
  {
    id: 303,
    name: "Dr. Robert Fox",
    specialization: "Endocrinologist",
    experience: "10 years",
    clinic: "Metabolic Care",
    address: "12 Park St, New York",
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
    tags: ["Recommended"]
  }
];

// --- Components ---

import DoctorProfileModal from '../../components/dashboard/DoctorProfileModal';

// ... (keep existing imports)

const PendingRequestItem = ({ request }: { request: typeof pendingRequests[0] }) => (
  <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
    <div className="flex items-center gap-3">
      <img 
        src={request.image} 
        alt={request.name} 
        className="w-12 h-12 rounded-full object-cover opacity-90 grayscale-[20%]"
      />
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{request.name}</h4>
        <div className="text-xs text-slate-600">{request.specialization}</div>
        <div className="text-[10px] text-[#0277BD] font-medium mt-0.5">{request.date}</div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="h-8 text-xs px-3 border-slate-200 hover:bg-white text-slate-500">
        Cancel
      </Button>
    </div>
  </div>
);

// Update LinkedDoctorCard to accept onClick
const LinkedDoctorCard = ({ doctor, onClick }: { doctor: typeof linkedDoctors[0], onClick: () => void }) => (
  <Card onClick={onClick} className="p-4 hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#0277BD]">
    {/* ... (keep existing JSX) */}
    <div className="flex items-center gap-4">
      <div className="relative">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#0277BD] transition-colors"
        />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{doctor.name}</h3>
        <p className="text-sm text-[#0277BD] font-medium truncate">{doctor.specialization}</p>
        <p className="text-xs text-slate-500 truncate">{doctor.clinic}</p>
      </div>
      <Button variant="ghost" className="text-slate-400 hover:text-[#0277BD]">
        <ChevronRight size={20} />
      </Button>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-1">
        <Clock size={12} />
        Last Visit: {doctor.lastConsultation}
      </div>
      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium text-[10px] uppercase tracking-wide">
        Active
      </span>
    </div>
  </Card>
);

// Update DoctorResultCard to accept onClick
const DoctorResultCard = ({ doctor, onClick }: { doctor: typeof exploreDoctors[0], onClick: () => void }) => (
  <Card onClick={onClick} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
    {/* ... (keep existing JSX) */}
    <div className="p-5">
      <div className="flex gap-4">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-20 h-20 rounded-xl object-cover shadow-sm"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0277BD] transition-colors">{doctor.name}</h3>
              <div className="flex items-center gap-1 text-[#0277BD] text-sm font-medium mb-1">
                <Stethoscope size={14} />
                {doctor.specialization}
              </div>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-900">{doctor.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
            <MapPin size={12} />
            {doctor.address}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {doctor.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
        <Button variant="outline" className="flex-1 h-10 text-sm hover:border-[#0277BD] hover:text-[#0277BD]">
          View Profile
        </Button>
        <Button className="flex-1 h-10 text-sm bg-[#0277BD] hover:bg-[#015f96] text-white border-none shadow-md shadow-blue-200">
          <UserPlus size={16} className="mr-2" />
          Connect
        </Button>
      </div>
    </div>
  </Card>
);

const Doctors = () => {
  const [activeTab, setActiveTab] = useState<'my-doctors' | 'find-doctors'>('my-doctors');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null); // Using any for simplicity with mixed types

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="text-slate-500">Manage your care team and find new specialists</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('my-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my-doctors'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                My Care Team
              </div>
            </button>
            <button
              onClick={() => setActiveTab('find-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'find-doctors'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search size={16} />
                Find Doctors
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'my-doctors' ? (
              <motion.div 
                key="my-doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Pending Requests</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pendingRequests.map(req => (
                        <PendingRequestItem key={req.id} request={req} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Linked Doctors */}
                <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Connected Doctors</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{linkedDoctors.length} Total</span>
                  </div>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {linkedDoctors.map(doctor => (
                      <LinkedDoctorCard 
                        key={doctor.id} 
                        doctor={doctor} 
                        onClick={() => setSelectedDoctor(doctor)}
                      />
                    ))}
                    
                    {/* Add New Placeholder */}
                    <div 
                      onClick={() => setActiveTab('find-doctors')}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-[#0277BD] hover:text-[#0277BD] hover:bg-blue-50 transition-all cursor-pointer min-h-[160px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-white">
                        <UserPlus size={24} />
                      </div>
                      <span className="font-medium">Connect New Doctor</span>
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div 
                key="find-doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Search & Filter Bar */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search by name, clinic, or condition..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-48">
                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        type="text"
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
                      />
                    </div>
                    <Button variant="outline" className="px-3 hover:text-[#0277BD] hover:border-[#0277BD]">
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>

                {/* Popular Specializations Chips */}
                <div className="flex flex-wrap gap-2">
                  {popularSpecializations.map((spec, i) => (
                    <button 
                      key={i}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-[#0277BD] hover:text-[#0277BD] transition-colors"
                    >
                      {spec}
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {exploreDoctors.map(doctor => (
                    <DoctorResultCard 
                      key={doctor.id} 
                      doctor={doctor} 
                      onClick={() => setSelectedDoctor(doctor)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DoctorProfileModal 
        doctor={selectedDoctor} 
        isOpen={!!selectedDoctor} 
        onClose={() => setSelectedDoctor(null)} 
      />
    </div>
  );
};

export default Doctors;
