import { 
  Activity, 
  Calendar, 
  FileText, 
  Upload, 
  Settings, 
  ChevronRight, 
  Star, 
  Clock, 
  MapPin,
  Plus
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const navigate = useNavigate();

  // Mock Data
  const careTeam = [
    { id: 1, name: "Dr. Sarah Wilson", specialization: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300", nextAppt: "Tomorrow, 10:00 AM" },
    { id: 2, name: "Dr. James Chen", specialization: "Dermatologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300", nextAppt: "Oct 24, 2:30 PM" },
    { id: 3, name: "Dr. Emily Parker", specialization: "General Physician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300", nextAppt: "Nov 02, 9:15 AM" },
    { id: 4, name: "Dr. Michael Brown", specialization: "Neurologist", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300", nextAppt: "Nov 15, 11:00 AM" },
  ];

  const quickActions = [
    { icon: Calendar, label: "Book Appointment", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", path: "/dashboard/doctors" },
    { icon: Upload, label: "Upload Records", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", path: "/dashboard/documents" },
    { icon: Activity, label: "Vitals", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", path: "/dashboard/vitals" },
    { icon: Settings, label: "Settings", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800", path: "/dashboard/settings" },
  ];

  const recentDocuments = [
    { id: 1, title: "Blood Test Results", type: "Lab Report", date: "Oct 15, 2023", doctor: "Dr. Emily Parker" },
    { id: 2, title: "Cardiology Consultation", type: "Prescription", date: "Oct 10, 2023", doctor: "Dr. Sarah Wilson" },
    { id: 3, title: "MRI Scan Report", type: "Radiology", date: "Sep 28, 2023", doctor: "Dr. Michael Brown" },
  ];

  const recommendedDoctors = [
    { id: 101, name: "Dr. Alice M.", specialization: "Endocrinologist", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300" },
    { id: 102, name: "Dr. Robert F.", specialization: "Orthopedic", rating: 4.8, reviews: 95, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300" },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-8">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back, <span className="text-[#0277BD]">John</span></h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">You have <span className="font-semibold text-slate-900 dark:text-white">5 appointments</span> scheduled for today.</p>
          </div>
          <Button className="bg-[#0277BD] hover:bg-[#015f96] text-white shadow-lg shadow-blue-200/50 dark:shadow-none">
            <Plus className="w-4 h-4 mr-2" />
            Create Appointment
          </Button>
        </div>

        {/* Care Team Section - Horizontal Scroll */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Care Team</h2>
            <Button variant="ghost" className="text-sm text-[#0277BD] dark:text-blue-400 hover:text-[#015f96] dark:hover:text-blue-300 p-0 h-auto font-medium" onClick={() => navigate('/dashboard/doctors')}>
              View All
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {careTeam.map((doctor) => (
              <Card key={doctor.id} className="min-w-[280px] p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-600 group-hover:border-[#0277BD] transition-colors" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{doctor.name}</h3>
                  <p className="text-xs text-[#0277BD] dark:text-blue-400 font-medium truncate">{doctor.specialization}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <Clock size={10} />
                    <span className="truncate">{doctor.nextAppt}</span>
                  </div>
                </div>
              </Card>
            ))}
            <Card className="min-w-[100px] flex flex-col items-center justify-center gap-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0277BD] dark:hover:border-blue-400 cursor-pointer transition-all" onClick={() => navigate('/dashboard/doctors')}>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <Plus size={16} />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Add New</span>
            </Card>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Card 
                key={i} 
                className="p-4 hover:shadow-md transition-all cursor-pointer group border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{action.label}</span>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Documents</h2>
              <Button variant="ghost" className="text-sm text-[#0277BD] dark:text-blue-400 hover:text-[#015f96] dark:hover:text-blue-300 p-0 h-auto font-medium" onClick={() => navigate('/dashboard/documents')}>
                See All
              </Button>
            </div>
            <Card className="divide-y divide-slate-100 dark:divide-slate-700 border-slate-200 dark:border-slate-700">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0277BD] dark:text-blue-400 group-hover:bg-[#0277BD] group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{doc.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.type} • {doc.date}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                </div>
              ))}
            </Card>
          </section>

          {/* Recommended Doctors */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended</h2>
              <Button variant="ghost" className="text-sm text-[#0277BD] dark:text-blue-400 hover:text-[#015f96] dark:hover:text-blue-300 p-0 h-auto font-medium" onClick={() => navigate('/dashboard/doctors')}>
                Find More
              </Button>
            </div>
            <div className="space-y-4">
              {recommendedDoctors.map((doctor) => (
                <Card key={doctor.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer border-slate-200 dark:border-slate-700">
                  <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{doctor.name}</h4>
                    <p className="text-xs text-[#0277BD] dark:text-blue-400 font-medium">{doctor.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{doctor.rating}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">({doctor.reviews})</span>
                    </div>
                  </div>
                  <Button variant="outline" className="h-8 text-xs border-slate-200 dark:border-slate-600 hover:border-[#0277BD] dark:hover:border-blue-400 hover:text-[#0277BD] dark:hover:text-blue-400">
                    Profile
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Sidebar - Health Info */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-6">
        {/* Profile Summary Card */}
        <Card className="p-6 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-left mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Health</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">32 Years • Male</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="text-[10px] text-red-500 dark:text-red-400 uppercase font-bold mb-1">Blood</div>
                <div className="font-bold text-slate-900 dark:text-white text-lg">A+</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <div className="text-[10px] text-blue-500 dark:text-blue-400 uppercase font-bold mb-1">Height</div>
                <div className="font-bold text-slate-900 dark:text-white text-lg">182<span className="text-[10px] text-slate-500 ml-0.5">cm</span></div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-[10px] text-emerald-500 dark:text-emerald-400 uppercase font-bold mb-1">Weight</div>
                <div className="font-bold text-slate-900 dark:text-white text-lg">78<span className="text-[10px] text-slate-500 ml-0.5">kg</span></div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Profile Completion</span>
                  <span className="text-[#0277BD] dark:text-blue-400 font-bold">85%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0277BD] w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600" onClick={() => navigate('/dashboard/settings')}>
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Insurance / ID Card Mockup */}
        <div className="bg-gradient-to-br from-[#0277BD] to-[#015f96] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <Activity className="text-white/80" />
              <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-medium backdrop-blur-sm">PREMIUM</span>
            </div>
            <div className="space-y-1 mb-4">
              <div className="text-xs text-blue-200">Member ID</div>
              <div className="font-mono text-lg tracking-wider">8824 9921 4421</div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] text-blue-200">Exp Date</div>
                <div className="text-sm font-medium">12/26</div>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-80 grayscale brightness-200" />
            </div>
          </div>
        </div>

        {/* Upcoming Appointment Mini Widget */}
        <Card className="p-5 border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Next Appointment</h3>
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 min-w-[50px]">
              <span className="text-xs text-[#0277BD] dark:text-blue-400 font-bold uppercase">Oct</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">24</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Dr. James Chen</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dermatologist</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <MapPin size={10} />
                <span>City Clinic, Floor 2</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Overview;
