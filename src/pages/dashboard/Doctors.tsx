import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Stethoscope, Filter, Clock, ChevronRight, UserPlus } from 'lucide-react';
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

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
      active 
        ? 'border-[#FF9800] text-[#FF9800]' 
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {children}
  </button>
);

const LinkedDoctorCard = ({ doctor }: { doctor: typeof linkedDoctors[0] }) => (
  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#FF9800]">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#FF9800] transition-colors"
        />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{doctor.name}</h3>
        <p className="text-sm text-[#FF9800] font-medium truncate">{doctor.specialization}</p>
        <p className="text-xs text-slate-500 truncate">{doctor.clinic}</p>
      </div>
      <Button variant="ghost" className="text-slate-400 hover:text-[#FF9800]">
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

const PendingRequestItem = ({ request }: { request: typeof pendingRequests[0] }) => (
  <div className="flex items-center justify-between p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
    <div className="flex items-center gap-3">
      <img 
        src={request.image} 
        alt={request.name} 
        className="w-12 h-12 rounded-full object-cover opacity-90 grayscale-[20%]"
      />
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{request.name}</h4>
        <div className="text-xs text-slate-600">{request.specialization}</div>
        <div className="text-[10px] text-orange-600 font-medium mt-0.5">{request.date}</div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="h-8 text-xs px-3 border-slate-200 hover:bg-white text-slate-500">
        Cancel
      </Button>
    </div>
  </div>
);


const DoctorResultCard = ({ doctor }: { doctor: typeof exploreDoctors[0] }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
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
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#FF9800] transition-colors">{doctor.name}</h3>
                <div className="flex items-center gap-1 text-[#FF9800] text-sm font-medium mb-1">
                  <Stethoscope size={14} />
                  {doctor.specialization}
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-slate-900 text-xs">{doctor.rating}</span>
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

        <div className="flex gap-3 mt-6">
          <Button 
              onClick={() => navigate(`/dashboard/doctors/${doctor.id}`)}
              className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold"
          >
              View Profile
          </Button>
          <Button className="flex-1 bg-[#0277BD] hover:bg-[#01579B] text-white shadow-md shadow-blue-100 transition-all font-semibold">
              Connect
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Doctors = () => {
  const [activeTab, setActiveTab] = useState<'my-doctors' | 'find-doctors'>('my-doctors');
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <div className="flex border-b border-slate-100 px-2">
          <TabButton active={activeTab === 'my-doctors'} onClick={() => setActiveTab('my-doctors')}>
            My Care Team
          </TabButton>
          <TabButton active={activeTab === 'find-doctors'} onClick={() => setActiveTab('find-doctors')}>
            Find Doctors
          </TabButton>
        </div>
      </div>

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
                  <LinkedDoctorCard key={doctor.id} doctor={doctor} />
                ))}
                
                {/* Add New Placeholder */}
                <div 
                  onClick={() => setActiveTab('find-doctors')}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-[#FF9800] hover:text-[#FF9800] hover:bg-orange-50 transition-all cursor-pointer min-h-[160px]"
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search by name, clinic, or condition..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition-all"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition-all"
                  />
                </div>
                <Button variant="outline" className="px-3 hover:text-[#FF9800] hover:border-[#FF9800]">
                  <Filter size={18} />
                </Button>
              </div>
            </div>

            {/* Popular Specializations Chips */}
            <div className="flex flex-wrap gap-2">
              {popularSpecializations.map((spec, i) => (
                <button 
                  key={i}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-[#FF9800] hover:text-[#FF9800] transition-colors"
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {exploreDoctors.map(doctor => (
                <DoctorResultCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;


