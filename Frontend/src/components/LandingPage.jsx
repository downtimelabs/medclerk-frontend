import React from 'react';
import { FaShieldAlt, FaBolt, FaGlobe, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';

const LandingPage = ({ selectedLanguage, onLanguageSelect }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };


  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main text-dark-300">
      <motion.header 
        className="flex justify-between items-center px-6 py-4 border-b border-dark-200 bg-white/90 shadow-sm sticky top-0 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="font-bold tracking-wide text-dark-950"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('app_brand')}
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <select
              className="appearance-none bg-white text-dark-700 border border-dark-200 rounded-lg px-3 py-2 pr-7 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en" className="bg-white text-dark-700">English</option>
              <option value="es" className="bg-white text-dark-700">Español</option>
              <option value="fr" className="bg-white text-dark-700">Français</option>
              <option value="de" className="bg-white text-dark-700">Deutsch</option>
              <option value="it" className="bg-white text-dark-700">Italiano</option>
              <option value="pt" className="bg-white text-dark-700">pt</option>
              <option value="ru" className="bg-white text-dark-700">ru</option>
              <option value="zh" className="bg-white text-dark-700">zh</option>
              <option value="ja" className="bg-white text-dark-700">ja</option>
              <option value="ko" className="bg-white text-dark-700">ko</option>
              <option value="ar" className="bg-white text-dark-700">ar</option>
              <option value="hi" className="bg-white text-dark-700">Hindi</option>
            </select>
          </div>
          <button className="btn btn-link" onClick={() => navigate('/start')}>App</button>
          <button className="btn btn-secondary" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/start')}>Get Started</button>
        </motion.div>
      </motion.header>

      <main className="grid grid-cols-1 gap-8 p-14 max-w-4xl mx-auto">
        <motion.div 
          className="space-y-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold leading-tight text-dark-900 animate-float"
            variants={fadeInUp}
          >
            {t('landing_title')}
          </motion.h1>
          <motion.p 
            className="text-dark-400 text-lg mb-5"
            variants={fadeInUp}
          >
            {t('landing_sub')}
          </motion.p>
          <motion.div 
            className="flex gap-3 mb-3"
            variants={fadeInUp}
          >
            <motion.button 
              className="btn btn-primary" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('start_free')} <FaArrowRight />
            </motion.button>
            <motion.button 
              className="btn btn-secondary" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('live_demo')}
            </motion.button>
          </motion.div>
          <motion.div 
            className="text-dark-500 text-sm animate-float"
            variants={fadeInUp}
            style={{ animationDelay: '3s' }}
          >
            <FaShieldAlt className="inline mr-1" /> HIPAA-style privacy • <FaBolt className="inline mr-1" /><FaGlobe className="inline mr-1" /> 12 languages
          </motion.div>
        </motion.div>
      </main>

      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-10 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="bg-white border border-dark-100 rounded-xl p-4 text-left hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Smart Summary</h3>
          <p className="text-dark-400 text-sm">Extract key values and get human-readable summaries of complex reports.</p>
        </motion.div>
        <motion.div 
          className="bg-white border border-dark-100 rounded-xl p-4 text-left hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Ask Questions</h3>
          <p className="text-dark-400 text-sm">Chat with your documents: "What changed since last test?"</p>
        </motion.div>
        <motion.div 
          className="bg-white border border-dark-100 rounded-xl p-4 text-left hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Multilingual</h3>
          <p className="text-dark-400 text-sm">Use the app in your preferred language. Switch anytime.</p>
        </motion.div>
        <motion.div 
          className="bg-white border border-dark-100 rounded-xl p-4 text-left hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Your Data Always Secure</h3>
          <p className="text-dark-400 text-sm">Your data stays yours.You can export or delete anytime.</p>
        </motion.div>
      </motion.section>

      <motion.section 
        className="p-5 pb-15 text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-2xl font-bold text-dark-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Simple pricing
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white border border-dark-100 rounded-xl p-4 text-left flex flex-col gap-2 hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-sm"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-bold text-dark-900">Starter</div>
            <div className="text-3xl font-extrabold text-dark-900">Free</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> 10 uploads/month</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Basic OCR</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Community support</li>
            </ul>
            <motion.button 
              className="btn btn-secondary mt-auto" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try free
            </motion.button>
          </motion.div>
          <motion.div 
            className="bg-white border border-primary-500 border-opacity-60 rounded-xl p-4 text-left flex flex-col gap-2 hover:scale-105 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden shadow-sm"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="font-bold text-dark-900">Pro</div>
            <div className="text-3xl font-extrabold text-dark-900">$9/mo</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Unlimited uploads</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> AI summaries & chat</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Priority support</li>
            </ul>
            <motion.button 
              className="btn btn-primary mt-auto" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Pro
            </motion.button>
          </motion.div>
          <motion.div 
            className="bg-white border border-dark-100 rounded-xl p-4 text-left flex flex-col gap-2 hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-sm"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="font-bold text-dark-900">Teams</div>
            <div className="text-3xl font-extrabold text-dark-900">Custom</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Shared workspace</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> Admin controls</li>
              <li className="flex items-center gap-2 text-dark-300"><FaCheckCircle className="text-primary-500" /> SLA</li>
            </ul>
            <motion.button 
              className="btn btn-secondary mt-auto" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact us
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.footer 
        className="px-6 py-4 border-t border-dark-100 flex justify-between text-dark-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-sm"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} AI Report Organizer
        </motion.div>
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="bg-transparent border-0 text-dark-300 cursor-pointer hover:text-dark-900 transition-colors" 
            onClick={() => navigate('/signin')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in
          </motion.button>
          <motion.button 
            className="bg-transparent border-0 text-dark-300 cursor-pointer hover:text-dark-900 transition-colors" 
            onClick={() => navigate('/start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get started
          </motion.button>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;


