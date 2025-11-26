import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Award, Building2, Clock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Mock Data (In a real app, fetch based on ID)
const doctorsData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@medclerk.com',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    specialization: 'Cardiologist',
    licenseNumber: 'MD-2015-8842',
    clinicName: 'Heart Care Center',
    yearsOfExperience: 12,
    clinicAddress: '123 Medical Plaza, Suite 400, New York, NY 10001'
  },
  '2': {
    id: '2',
    name: 'Dr. James Chen',
    email: 'james.chen@medclerk.com',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    specialization: 'Dermatologist',
    licenseNumber: 'MD-2018-1123',
    clinicName: 'Clear Skin Clinic',
    yearsOfExperience: 8,
    clinicAddress: '456 Wellness Blvd, Beverly Hills, CA 90210'
  },
  '3': {
    id: '3',
    name: 'Dr. Emily Brooks',
    email: 'emily.brooks@medclerk.com',
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    specialization: 'Pediatrician',
    licenseNumber: 'MD-2012-5591',
    clinicName: 'Little Steps Pediatrics',
    yearsOfExperience: 15,
    clinicAddress: '789 Kids Way, Chicago, IL 60614'
  }
};

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fallback if ID not found or for demo purposes
  const doctor = (id && doctorsData[id]) || doctorsData['1'];

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans">
      {/* Header / Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/doctors')} 
          className="pl-0 hover:bg-transparent hover:text-[#0277BD] text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Doctors
        </Button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner flex-shrink-0">
          <img 
            src={doctor.avatarUrl} 
            alt={doctor.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{doctor.name}</h1>
                <p className="text-lg text-[#0277BD] font-medium mt-1">{doctor.specialization}</p>
            </div>
            <Button className="bg-[#0277BD] hover:bg-[#01579B] text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all">
                Connect
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-600">
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Mail size={16} className="text-slate-400" />
                <span>{doctor.email}</span>
             </div>
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <User size={16} className="text-slate-400" />
                <span>ID: {doctor.id}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Professional Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Award size={24} className="text-[#FF9800]" />
                    Professional Details
                </h2>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">License Number</p>
                        <p className="text-slate-900 font-medium">{doctor.licenseNumber}</p>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Years of Experience</p>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            <p className="text-slate-900 font-medium">{doctor.yearsOfExperience} Years</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 size={24} className="text-[#FF9800]" />
                    Clinic Information
                </h2>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Clinic Name</p>
                        <p className="text-slate-900 font-medium">{doctor.clinicName}</p>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-900 font-medium leading-relaxed">{doctor.clinicAddress}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
