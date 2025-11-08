import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, CheckCircle, Loader2, Crown, Shield } from 'lucide-react';

const GoProModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form states
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardChange = (field, value) => {
    if (field === 'number') {
      setCardData({ ...cardData, [field]: formatCardNumber(value) });
    } else if (field === 'expiry') {
      setCardData({ ...cardData, [field]: formatExpiry(value) });
    } else if (field === 'cvv') {
      setCardData({ ...cardData, [field]: value.replace(/[^0-9]/gi, '').slice(0, 3) });
    } else {
      setCardData({ ...cardData, [field]: value });
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Store in localStorage
      localStorage.setItem('isPro', 'true');
      
      // Notify parent component after animation
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          // Reset form
          setCardData({ name: '', number: '', expiry: '', cvv: '' });
          setUpiId('');
          setIsSuccess(false);
        }, 1500);
      }, 2000);
    }, 2000);
  };

  const features = [
    'Unlimited uploads',
    'AI summaries & chat',
    'Priority support'
  ];

  const paymentTabs = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI / Wallets', icon: Wallet },
    { id: 'paypal', label: 'PayPal', icon: Shield }
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={!isProcessing ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!isProcessing && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mb-3"
                >
                  Payment Successful!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-2"
                >
                  You're now a Pro member! 🎉
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-700 font-medium text-sm"
                >
                  <Crown className="w-4 h-4" />
                  Pro Plan Active
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Upgrade to Pro Plan</h2>
                  </div>
                  <p className="text-3xl font-bold">
                    $9 <span className="text-lg font-normal text-white/80">/mo</span>
                  </p>
                </div>

                <div className="p-8">
                  {/* Payment Tabs */}
                  <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                    {paymentTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                          activeTab === tab.id
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <tab.icon size={18} />
                        <span className="hidden sm:inline">{tab.label.split(' / ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Payment Form */}
                  <form onSubmit={handlePayment}>
                    <AnimatePresence mode="wait">
                      {activeTab === 'card' && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4 mb-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardData.name}
                              onChange={(e) => handleCardChange('name', e.target.value)}
                              placeholder="John Doe"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardData.number}
                              onChange={(e) => handleCardChange('number', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={(e) => handleCardChange('expiry', e.target.value)}
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="password"
                                value={cardData.cvv}
                                onChange={(e) => handleCardChange('cvv', e.target.value)}
                                placeholder="123"
                                maxLength="3"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'upi' && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4 mb-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              UPI ID
                            </label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="user@okaxis"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-800">
                              💡 Enter your UPI ID and click "Verify and Pay" to complete the transaction.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'paypal' && (
                        <motion.div
                          key="paypal"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="mb-6"
                        >
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                            <p className="text-gray-700 mb-4">
                              You'll be redirected to PayPal to complete your payment securely.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Summary Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Plan Summary</h3>
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-purple-200">
                        <span className="text-gray-700">Pro Plan</span>
                        <span className="font-bold text-gray-900">$9/mo</span>
                      </div>
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing payment...
                          </>
                        ) : (
                          <>
                            {activeTab === 'upi' ? 'Verify and Pay' : activeTab === 'paypal' ? 'Pay with PayPal' : 'Complete Payment'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment • SSL encrypted • Cancel anytime</span>
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoProModal;
