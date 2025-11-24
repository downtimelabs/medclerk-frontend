import { useState } from 'react';
import { Search, MapPin, Star, Stethoscope, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';


const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialization: "Cardiologist",
    experience: "12 years",
    clinic: "Heart Care Center",
    address: "123 Medical Ave, New York",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    status: "connect"
  },
  {
    id: 2,
    name: "Dr. James Chen",
    specialization: "Dermatologist",
    experience: "8 years",
    clinic: "Skin & Glow Clinic",
    address: "456 Park Lane, New York",
    rating: 4.8,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    status: "pending"
  },
  {
    id: 3,
    name: "Dr. Emily Parker",
    specialization: "Pediatrician",
    experience: "15 years",
    clinic: "Little Stars Pediatrics",
    address: "789 Broadway, New York",
    rating: 5.0,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    status: "connected"
  },
  {
    id: 4,
    name: "Dr. Michael Ross",
    specialization: "General Physician",
    experience: "20 years",
    clinic: "City Health Clinic",
    address: "321 5th Ave, New York",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    status: "connect"
  }
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctorsData.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find Doctors</h1>
          <p className="text-slate-500">Connect with specialists for seamless record sharing.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name or specialization..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{doctor.name}</h3>
                  <div className="flex items-center gap-1 text-[#0277BD] text-sm font-medium mb-1">
                    <Stethoscope size={14} />
                    {doctor.specialization}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <MapPin size={12} />
                    {doctor.clinic}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-slate-900">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.reviews})</span>
                </div>
                <div className="text-slate-500">
                  {doctor.experience} exp
                </div>
              </div>

              <div className="mt-6">
                {doctor.status === 'connected' ? (
                  <Button variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100" disabled>
                    Connected
                  </Button>
                ) : doctor.status === 'pending' ? (
                  <Button variant="outline" className="w-full border-slate-200 bg-slate-50 text-slate-500" disabled>
                    Request Pending
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
