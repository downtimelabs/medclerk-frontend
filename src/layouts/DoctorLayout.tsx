import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Activity,
  Search,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDoctorProfile } from '../api/doctor';
import type { CompleteDoctorProfile } from '../interfaces/doctor';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [profile, setProfile] = useState<CompleteDoctorProfile | null>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDoctorProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch doctor profile', error);
      }
    };
    fetchProfile();
  }, []);

  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { icon: LayoutDashboard, label: 'Overview', path: '/doctor/dashboard' },
        { icon: Users, label: 'Patients', path: '/doctor/patients' },
      ]
    },
    {
      title: "Settings",
      items: [
        { icon: Settings, label: 'Settings', path: '/doctor/settings' },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/doctor/dashboard' && location.pathname === '/doctor/dashboard') return true;
    if (path !== '/doctor/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-50/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 dark:text-white leading-none">MedClerk</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Doctor</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
                        ${active 
                          ? 'text-[#0277BD] bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0277BD] rounded-r-full"></div>
                      )}
                      <item.icon size={20} className={active ? 'text-[#0277BD] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dark Mode Toggle & Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Dark mode</span>
            <button 
              onClick={() => toggleDarkMode()}
              className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-[#0277BD]' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors px-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 transition-all duration-300 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-3 w-full bg-slate-50 dark:bg-slate-700/50 px-4 py-2.5 rounded-xl border-none focus-within:ring-2 focus-within:ring-[#0277BD]/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patients, appointments..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            
            <div 
              className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-1.5 rounded-xl transition-colors"
              onClick={() => navigate('/doctor/settings')}
            >
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {profile?.name || 'Dr. Loading...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Doctor Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth bg-[#F8FAFC] dark:bg-slate-950">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
