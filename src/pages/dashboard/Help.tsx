import { Mail, Phone, MessageCircle, HelpCircle as HelpIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Find answers to your questions or get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#0277BD] dark:text-blue-400 mb-4">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Available 24/7 for emergencies</p>
          <a href="tel:+1234567890" className="text-[#0277BD] dark:text-blue-400 font-medium hover:underline">+1 (234) 567-890</a>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">For general inquiries</p>
          <a href="mailto:support@medclerk.com" className="text-[#0277BD] dark:text-blue-400 font-medium hover:underline">support@medclerk.com</a>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Live Chat</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Chat with our support team</p>
          <Button className="bg-[#0277BD] hover:bg-[#015f96] text-white">Start Chat</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              "How do I book an appointment?",
              "Where can I find my medical reports?",
              "How do I update my profile information?",
              "Is my data secure?"
            ].map((q, i) => (
              <Card key={i} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800 dark:border-slate-700 group">
                <span className="font-medium text-slate-700 dark:text-slate-200">{q}</span>
                <HelpIcon size={18} className="text-slate-400 group-hover:text-[#0277BD] transition-colors" />
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0277BD] focus:border-transparent outline-none transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0277BD] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe your issue..."
              />
            </div>
            <Button className="w-full bg-[#0277BD] hover:bg-[#015f96] text-white">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Help;
