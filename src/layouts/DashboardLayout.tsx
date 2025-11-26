import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Stethoscope, 
  Settings, 
  LogOut,
  Menu,
  X,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Report Centre', path: '/dashboard/documents' },
    { icon: MessageSquare, label: 'AI Chat', path: '/dashboard/chat' },
    { icon: Stethoscope, label: 'Find Doctors', path: '/dashboard/doctors' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-sm
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col relative">
          {/* Collapse Button (Desktop Only) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-slate-600 shadow-sm z-10"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Logo */}
          <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-slate-100 transition-all`}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-[#0277BD] p-1.5 rounded-lg flex-shrink-0">
                <Activity className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="font-bold text-lg text-slate-800 tracking-tight whitespace-nowrap"
                >
                  MedClerk
                </motion.span>
              )}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive(item.path) 
                    ? 'bg-blue-50 text-[#0277BD]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={20} className={`flex-shrink-0 ${isActive(item.path) ? 'text-[#0277BD]' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0">
                JD
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
                  <p className="text-xs text-slate-500 truncate">Patient Account</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/login')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && "Sign Out"}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">MedClerk</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
