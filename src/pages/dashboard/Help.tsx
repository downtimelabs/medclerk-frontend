import { Mail, Phone, MessageCircle, HelpCircle as HelpIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">Help & Support</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg leading-relaxed">Find answers to your questions or get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#0277BD] dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <Phone size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">Call Us</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 font-medium">Available 24/7 for medical emergencies</p>
          <a href="tel:+1234567890" className="text-[#0277BD] dark:text-blue-400 font-bold hover:underline tracking-tight text-lg">+1 (234) 567-890</a>
        </Card>

        <Card className="p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            <Mail size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">Email Us</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 font-medium">For general inquiries and feedback</p>
          <a href="mailto:support@medclerk.com" className="text-[#0277BD] dark:text-blue-400 font-bold hover:underline tracking-tight">support@medclerk.com</a>
        </Card>

        <Card className="p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">Live Chat</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 font-medium">Chat with our dedicated support team</p>
          <Button className="w-full bg-[#0277BD] dark:bg-blue-600 hover:bg-[#015f96] dark:hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Start Chat</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              "How do I book an appointment?",
              "Where can I find my medical reports?",
              "How do I update my profile information?",
              "Is my data secure?"
            ].map((q, i) => (
              <Card key={i} className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl group transition-all">
                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors">{q}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-all">
                  <HelpIcon size={18} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-6 tracking-tight">Send us a message</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Subject</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 outline-none transition-all resize-none font-medium"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <Button className="w-full h-12 bg-[#0277BD] dark:bg-blue-600 hover:bg-[#015f96] dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-2">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Help;
