import React from 'react';
import { FaShieldAlt, FaBolt, FaGlobe, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import { useI18n } from '../i18n';

const LandingPage = ({ selectedLanguage, onLanguageSelect }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
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
    <div className="landing">
      <motion.header 
        className="landing-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('app_brand')}
        </motion.div>
        <motion.div 
          className="nav-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="lang-switcher">
            <select
              className="lang-select"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">pt</option>
              <option value="ru">ru</option>
              <option value="zh">zh</option>
              <option value="ja">ja</option>
              <option value="ko">ko</option>
              <option value="ar">ar</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <button className="btn btn-link" onClick={() => navigate('/start')}>App</button>
          <button className="btn btn-secondary" onClick={() => navigate('/start')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/start')}>Get Started</button>
        </motion.div>
      </motion.header>

      <main className="landing-hero">
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 variants={fadeInUp}>
            {t('landing_title')}
          </motion.h1>
          <motion.p variants={fadeInUp}>
            {t('landing_sub')}
          </motion.p>
          <motion.div className="hero-cta" variants={fadeInUp}>
            <motion.button 
              className="btn btn-primary cta" 
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
          <motion.div className="hero-trust" variants={fadeInUp}>
            <FaShieldAlt /> HIPAA-style privacy • <FaBolt /> Fast OCR • <FaGlobe /> 12 languages
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-card"
          variants={fadeInRight}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="hero-preview"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="preview-header">Upload & Analyze</div>
            <motion.div 
              className="preview-body"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="preview-item"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <span className="dot"></span>
                blood_report_may.pdf
                <span className="status">Queued</span>
              </motion.div>
              <motion.div 
                className="preview-item"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <span className="dot"></span>
                prescription_2024.png
                <span className="status success">Analyzed</span>
              </motion.div>
              <motion.div 
                className="preview-item"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <span className="dot"></span>
                cholesterol_result.jpg
                <span className="status">Processing</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <motion.section 
        className="landing-features"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="feature-card"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h3>Smart OCR & Summary</h3>
          <p>Extract key values and get human-readable summaries of complex reports.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3>Ask Questions</h3>
          <p>Chat with your documents: "What changed since last test?"</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3>Multilingual</h3>
          <p>Use the app in your preferred language. Switch anytime.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          variants={scaleIn}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3>Private by Design</h3>
          <p>Your data stays yours. Export or delete anytime.</p>
        </motion.div>
      </motion.section>

      <motion.section 
        className="landing-pricing"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Simple pricing
        </motion.h2>
        <motion.div 
          className="pricing-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="price-card"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="price-header">Starter</div>
            <div className="price-value">Free</div>
            <ul>
              <li><FaCheckCircle /> 10 uploads/month</li>
              <li><FaCheckCircle /> Basic OCR</li>
              <li><FaCheckCircle /> Community support</li>
            </ul>
            <motion.button 
              className="btn btn-secondary" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try free
            </motion.button>
          </motion.div>
          <motion.div 
            className="price-card featured"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="price-header">Pro</div>
            <div className="price-value">$9/mo</div>
            <ul>
              <li><FaCheckCircle /> Unlimited uploads</li>
              <li><FaCheckCircle /> AI summaries & chat</li>
              <li><FaCheckCircle /> Priority support</li>
            </ul>
            <motion.button 
              className="btn btn-primary" 
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Pro
            </motion.button>
          </motion.div>
          <motion.div 
            className="price-card"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="price-header">Teams</div>
            <div className="price-value">Custom</div>
            <ul>
              <li><FaCheckCircle /> Shared workspace</li>
              <li><FaCheckCircle /> Admin controls</li>
              <li><FaCheckCircle /> SLA</li>
            </ul>
            <motion.button 
              className="btn btn-secondary" 
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
        className="landing-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} AI Report Organizer
        </motion.div>
        <motion.div 
          className="footer-links"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="link" 
            onClick={() => navigate('/start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in
          </motion.button>
          <motion.button 
            className="link" 
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


