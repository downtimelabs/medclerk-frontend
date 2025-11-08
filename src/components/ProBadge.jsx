import React from 'react';
import { motion } from 'framer-motion';

export const ProBadge = ({ isPro, onClick }) => {
  if (!isPro) return null;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
    >
      Pro
    </motion.span>
  );
};

export default ProBadge;
