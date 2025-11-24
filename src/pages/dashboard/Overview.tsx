import { 
  Activity, 
  Droplets, 
  Heart, 
  ChevronRight, 
  MoreHorizontal,
  Search,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Overview = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Overview of your health metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] w-64"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
              12 April 2025
            </div>
          </div>
        </div>

        {/* Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Heart Rate */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Heart size={24} fill="currentColor" className="text-blue-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Heart Rate</h3>
              <div className="text-3xl font-bold text-slate-900 mt-2">80 <span className="text-sm font-medium text-slate-500">BPM</span></div>
            </div>
            {/* Decorative BG */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          </Card>

          {/* Blood Pressure */}
          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cyan-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Activity size={24} className="text-cyan-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Blood Pressure</h3>
              <div className="text-3xl font-bold text-slate-900 mt-2">120/80 <span className="text-sm font-medium text-slate-500">mmHg</span></div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-cyan-200/30 rounded-full blur-2xl"></div>
          </Card>

          {/* Glucose Level */}
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Droplets size={24} className="text-pink-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Glucose Level</h3>
              <div className="text-3xl font-bold text-slate-900 mt-2">60 - 80 <span className="text-sm font-medium text-slate-500">mg/dl</span></div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl"></div>
          </Card>
        </div>

        {/* Activity Chart Section */}
        <Card className="p-6 border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900">Activity</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Weekly</button>
              <button className="px-3 py-1 text-xs font-medium bg-white text-[#0277BD] shadow-sm rounded-md">Monthly</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">Yearly</button>
            </div>
          </div>
          
          {/* Simple SVG Chart Mockup */}
          <div className="h-64 w-full relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
              {[800, 600, 400, 200, 0].map((val, i) => (
                <div key={i} className="flex items-center gap-4 w-full">
                  <span className="w-8 text-right">{val}</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
              ))}
            </div>
            
            {/* Chart Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pl-12 pb-6 pt-2" preserveAspectRatio="none">
              {/* Blue Line */}
              <path 
                d="M0,150 C50,150 100,120 150,130 C200,140 250,100 300,80 C350,60 400,90 450,70 C500,50 550,100 600,110 C650,120 700,100 750,110" 
                fill="none" 
                stroke="#0277BD" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              {/* Cyan Line */}
              <path 
                d="M0,180 C50,170 100,190 150,220 C200,250 250,180 300,160 C350,140 400,160 450,180 C500,200 550,180 600,160 C650,140 700,150 750,140" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="3" 
                strokeLinecap="round"
                opacity="0.6"
              />
              
              {/* Tooltip Point */}
              <circle cx="450" cy="70" r="6" fill="#0277BD" stroke="white" strokeWidth="3" />
            </svg>
            
            {/* Tooltip Label */}
            <div className="absolute top-[15%] left-[55%] bg-white p-2 rounded-lg shadow-lg border border-slate-100 text-xs z-10">
              <div className="font-bold text-slate-900">$27,632</div>
              <div className="text-slate-500">August</div>
            </div>
          </div>
        </Card>

        {/* Bottom Section: Recommendations & Treatment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommendations */}
          <Card className="p-6 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">Recommendation</h3>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { title: "What is Arteriosclerosis?", date: "12 April 2023", color: "bg-orange-100 text-orange-600" },
                { title: "Cardiologist Consultation", date: "14 April 2023", color: "bg-blue-100 text-blue-600" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${item.color}`}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Treatment */}
          <Card className="p-6 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">Treatment</h3>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Vitamin A", dose: "1 tablet twice a day", color: "bg-purple-100 text-purple-600" },
                { name: "Vitamin B", dose: "1 tablet twice a day", color: "bg-cyan-100 text-cyan-600" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${item.color}`}>
                    <Droplets size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.dose}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar (Desktop) */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-8">
        {/* Calendar Widget Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">April 2023</h3>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="rotate-180" size={16} /></button>
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
            </div>
          </div>
          {/* Simple Calendar Grid Mock */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
            {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-slate-400 font-medium">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({length: 30}, (_, i) => i + 1).map(d => (
              <div 
                key={d} 
                className={`
                  aspect-square flex items-center justify-center rounded-full cursor-pointer
                  ${d === 23 ? 'bg-[#0277BD] text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}
                `}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900">Doctors</h3>
            <button className="text-xs text-[#0277BD] font-medium hover:underline">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-slate-600">Dr. {['Lee', 'Kim', 'Raj', 'Roy'][i-1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Details */}
        <Card className="p-6 border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900">Details</h3>
            <button className="text-xs text-[#0277BD] font-medium hover:underline">See All</button>
          </div>
          <div className="flex justify-between text-center">
            <div>
              <div className="text-xs text-slate-500 mb-1">Blood</div>
              <div className="font-bold text-slate-900">A+</div>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Height</div>
              <div className="font-bold text-slate-900">170 cm</div>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Weight</div>
              <div className="font-bold text-slate-900">70 kg</div>
            </div>
          </div>
        </Card>

        {/* Upgrade Card */}
        <div className="relative rounded-2xl overflow-hidden bg-black text-white p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ArrowUpRight className="text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
            <p className="text-slate-400 text-xs mb-6">Get unlimited AI analysis and cloud storage.</p>
            <Button className="w-full bg-white text-black hover:bg-slate-100 font-bold h-10">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
