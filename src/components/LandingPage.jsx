import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBolt, FaGlobe, FaArrowRight, FaCheckCircle, FaFileAlt, FaQuestionCircle, FaLanguage, FaLock, FaChevronDown, FaCrown } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n.jsx';
import GoProModal from './GoProModal';
import { useProStatus } from '../hooks/useProStatus';
import ProBadge from './ProBadge';

const LandingPage = ({ isAuthenticated, user }) => {
  const { isPro, activatePro } = useProStatus();
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  
  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen flex flex-col relative text-dark-700 dark:text-dark-100">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("/Infographic medical with photo _ Premium Vector[1].jpg")',
            opacity: '0.55'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-100/60 dark:from-black/60 dark:via-slate-900/60 dark:to-slate-900/60"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header 
        className={`flex items-center px-4 py-1 sticky top-0 z-40 transition-all duration-300 ease-in-out backdrop-blur-md bg-white/95 dark:bg-dark-900/90 shadow-md`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div 
          className="flex items-center group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <div className="py-0 ml-4">
            <img 
              src="/logo1.jpg" 
              alt="MedClerk Logo" 
              className="h-12 md:h-14 object-contain transition-all duration-300 hover:opacity-90"
            />
          </div>
        </motion.div>
        
        {/* Right Side - All Navigation */}
        <motion.div 
          className="flex gap-3 items-center ml-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative h-full flex items-center">
            <button 
              className={`relative px-3 py-2 transition-all duration-300 ease-in-out group text-dark-700 dark:text-dark-200 ${
                isActive('/') ? 'text-primary-600' : 'hover:text-primary-600'
              }`}
              onClick={() => navigate('/')}
            >
              <span className="relative flex flex-col items-center">
                <span>{t('home')}</span>
                <span
                  className={`mt-1 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-in-out ${
                    isActive('/')
                      ? 'w-full opacity-100'
                      : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                ></span>
              </span>
            </button>
          </div>
          
          <div className="relative h-full flex items-center">
            <button 
              className={`relative px-3 py-2 transition-all duration-300 ease-in-out group text-dark-700 dark:text-dark-200 ${
                isActive('/services') ? 'text-primary-600' : 'hover:text-primary-600'
              }`}
              onClick={() => navigate('/services')}
            >
              <span className="relative flex flex-col items-center">
                <span>{t('services')}</span>
                <span
                  className={`mt-1 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-in-out ${
                    isActive('/services')
                      ? 'w-full opacity-100'
                      : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                ></span>
              </span>
            </button>
          </div>
          
          <div className="relative h-full flex items-center">
            <button 
              className={`relative px-3 py-2 transition-all duration-300 ease-in-out group text-dark-700 dark:text-dark-200 ${
                isActive('/about') ? 'text-primary-600' : 'hover:text-primary-600'
              }`}
              onClick={() => navigate('/about')}
            >
              <span className="relative flex flex-col items-center">
                <span>{t('about_us')}</span>
                <span
                  className={`mt-1 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-in-out ${
                    isActive('/about')
                      ? 'w-full opacity-100'
                      : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                ></span>
              </span>
            </button>
          </div>
          
{/* Get Started or Dashboard/Logout */}
          {isAuthenticated ? (
            <>
              <button 
                className={`transition-all duration-300 px-4 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-600`} 
                onClick={() => navigate('/dashboard')}
              >
                {t('dashboard')}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProModalOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled
                      ? isPro
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                      : isPro
                      ? 'bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-white hover:opacity-90'
                      : 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white hover:opacity-90'
                  }`}
                >
                  {isPro ? (
                    <>
                      <FaCrown className="text-yellow-300" />
                      <span>{t('pro_member')}</span>
                    </>
                  ) : (
                    <>
                      <FaCrown />
                      <span>{t('go_pro')}</span>
                    </>
                  )}
                </button>
                <ProBadge isPro={isPro} />

                <button 
                  className={`transition-all duration-300 px-4 py-2 rounded-lg bg-white text-dark-700 dark:bg-dark-800 dark:text-dark-200 border border-dark-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700`}
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('selectedRole');
                    window.location.reload();
                  }}
                >
                  {t('logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                className="transition-all px-4 py-1.5 rounded-lg text-sm border border-dark-200 bg-white text-dark-700 hover:bg-gray-50 shadow-sm" 
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
              <motion.button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all px-4 py-1.5 rounded-lg text-sm shadow-md"
                onClick={() => navigate('/start')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('get_started')}
              </motion.button>
            </div>
            )}
          </motion.div>
          
          {/* Go Pro Modal */}
          <AnimatePresence>
            {isProModalOpen && (
              <GoProModal
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
                onSuccess={() => {
                  activatePro();
                  // You can add a success toast here if needed
                }}
              />
            )}
          </AnimatePresence>
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
          {!isAuthenticated && (
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
          )}
          <motion.div 
            className="text-dark-500 text-sm animate-float"
            variants={fadeInUp}
            style={{ animationDelay: '3s' }}
          >
            <FaShieldAlt className="inline mr-1" /> {t('hipaa_privacy')} • <FaBolt className="inline mr-1" /><FaGlobe className="inline mr-1" /> {t('languages_count')}
          </motion.div>
        </motion.div>
      </main>

      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Feature Card 1 */}
        <motion.div 
          className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-dark-200/60"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg">
              <FaFileAlt className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">{t('feature_smart_summary_title')}</h3>
            <p className="text-dark-600 leading-relaxed text-sm">{t('feature_smart_summary_desc')}</p>
          </div>
        </motion.div>

        {/* Feature Card 2 */}
        <motion.div 
          className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-dark-200/60"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg">
              <FaQuestionCircle className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">{t('feature_ask_questions_title')}</h3>
            <p className="text-dark-600 leading-relaxed text-sm">{t('feature_ask_questions_desc')}</p>
          </div>
        </motion.div>

        {/* Feature Card 3 */}
        <motion.div 
          className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-dark-200/60"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg">
              <FaLanguage className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">{t('feature_multilingual_title')}</h3>
            <p className="text-dark-600 leading-relaxed text-sm">{t('feature_multilingual_desc')}</p>
          </div>
        </motion.div>

        {/* Feature Card 4 */}
        <motion.div 
          className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-dark-200/60"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg">
              <FaLock className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-3">{t('feature_secure_data_title')}</h3>
            <p className="text-dark-600 leading-relaxed text-sm">{t('feature_secure_data_desc')}</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Smart Report Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-4">
              {t('smart_report_title')}
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto mb-8">
              {t('smart_report_subtitle')}
            </p>
            <motion.button
              className="btn btn-primary text-lg px-8 py-4"
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('smart_report_cta')} <FaArrowRight className="inline ml-2" />
            </motion.button>
          </motion.div>

          {/* Smart Report Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6].map((num, index) => (
              <motion.div
                key={num}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl text-white font-bold">{num}</span>
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">
                  {t(`report_feature_${num}_title`)}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {t(`report_feature_${num}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 px-6 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-extrabold text-dark-900 text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('how_it_works_title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={step}
                className="text-center relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                    <span className="text-4xl font-bold text-white">{step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-4">
                  {t(`how_it_works_step${step}_title`)}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {t(`how_it_works_step${step}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-extrabold text-dark-900 text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('benefits_title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((num, index) => (
              <motion.div
                key={num}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">
                  {t(`benefit_${num}_title`)}
                </h3>
                <p className="text-dark-600">
                  {t(`benefit_${num}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-dark-700 dark:to-dark-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('cta_title')}
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-primary-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('cta_subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-white text-indigo-700 hover:bg-primary-50 transition-all px-10 py-4 rounded-lg text-lg font-bold shadow-2xl"
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('cta_button')} <FaArrowRight className="inline ml-2" />
            </motion.button>
            <p className="text-sm text-primary-100 mt-4">{t('cta_no_credit_card')}</p>
          </motion.div>
        </div>
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
          {t('pricing_title')}
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="group bg-white border-2 border-primary-500/80 rounded-xl p-4 text-left flex flex-col gap-2 transform transition-all duration-200 ease-out hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
            variants={scaleIn}
            whileHover={{ scale: 1.04, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-bold text-dark-900">{t('pricing_free_plan')}</div>
            <div className="text-3xl font-extrabold text-dark-900">{t('pricing_free_price')}</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_free_feature1')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_free_feature2')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_free_feature3')}</li>
            </ul>
            <motion.button 
              className="btn btn-secondary mt-auto" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('pricing_free_button')}
            </motion.button>
          </motion.div>
          <motion.div 
            className="group bg-white border-2 border-transparent rounded-xl p-4 text-left flex flex-col gap-2 transform transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary-100 relative"
            variants={scaleIn}
            whileHover={{ scale: 1.03, y: -6 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="font-bold text-dark-900">{t('pricing_pro_plan')}</div>
            <div className="text-3xl font-extrabold text-dark-900">{t('pricing_pro_price')}</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_pro_feature1')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_pro_feature2')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_pro_feature3')}</li>
            </ul>
            <motion.button 
              className="btn btn-primary mt-auto" 
              onClick={() => setIsProModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('pricing_pro_button')}
            </motion.button>
          </motion.div>
          <motion.div 
            className="group bg-white border-2 border-primary-500/80 rounded-xl p-4 text-left flex flex-col gap-2 transform transition-all duration-200 ease-out hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
            variants={scaleIn}
            whileHover={{ scale: 1.04, y: -8 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="font-bold text-dark-900">{t('pricing_teams_plan')}</div>
            <div className="text-3xl font-extrabold text-dark-900">{t('pricing_teams_price')}</div>
            <ul className="list-none p-0 m-2 space-y-1.5">
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_teams_feature1')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_teams_feature2')}</li>
              <li className="flex items-center gap-2 text-dark-500 font-medium"><FaCheckCircle className="text-primary-500" /> {t('pricing_teams_feature3')}</li>
            </ul>
            <motion.button 
              className="btn btn-secondary mt-auto" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('pricing_teams_button')}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.footer 
        className="bg-white border-t border-dark-200 mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <motion.div
              className="md:col-span-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-22 object-contain" />
              </div>
              <p className="text-dark-600 text-sm leading-relaxed">
                Organize and understand your medical reports with AI.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-dark-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-indigo-600 transition-colors text-sm block w-full text-left"
                    onClick={() => navigate('/start')}
                    whileHover={{ x: 5 }}
                  >
                    How it Works
                  </motion.button>
                </li>
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-primary-600 transition-colors text-sm block w-full text-left"
                    onClick={() => navigate('/signin')}
                    whileHover={{ x: 5 }}
                  >
                    Sign In
                  </motion.button>
                </li>
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-primary-600 transition-colors text-sm block w-full text-left"
                    onClick={() => navigate('/start')}
                    whileHover={{ x: 5 }}
                  >
                    Get Started
                  </motion.button>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-dark-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-primary-600 transition-colors text-sm block w-full text-left"
                    whileHover={{ x: 5 }}
                  >
                    Help Center
                  </motion.button>
                </li>
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-primary-600 transition-colors text-sm block w-full text-left"
                    whileHover={{ x: 5 }}
                  >
                    Privacy Policy
                  </motion.button>
                </li>
                <li>
                  <motion.button 
                    className="text-dark-600 hover:text-primary-600 transition-colors text-sm block w-full text-left"
                    whileHover={{ x: 5 }}
                  >
                    Contact Us
                  </motion.button>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border-dark-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-dark-500 text-sm mb-2 md:mb-0">
              © {new Date().getFullYear()} MedClerk. All rights reserved.
            </div>
            <div className="text-dark-500 text-sm">
              Made with MedClerk for better healthcare
            </div>
          </motion.div>
        </div>
      </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
