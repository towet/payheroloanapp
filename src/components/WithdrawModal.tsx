import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, X, Loader2, Shield, XCircle, MousePointer, KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
}

type WithdrawStatus = 'idle' | 'loading' | 'processing' | 'failed' | 'activation-needed';

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  maxAmount
}) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActivationMessage, setShowActivationMessage] = useState(false);
  
  // Reference for the activation button section
  const activationSectionRef = React.useRef<HTMLButtonElement>(null);

  const handleWithdraw = async () => {
    if (!amount || !phoneNumber || withdrawStatus !== 'idle') return;
    
    try {
      // Start the withdrawal process
      setWithdrawStatus('loading');
      
      // Format phone number - we'll save this for the activation function to use
      const formattedPhone = phoneNumber.startsWith('0') 
        ? '254' + phoneNumber.substring(1)
        : !phoneNumber.startsWith('254') ? '254' + phoneNumber : phoneNumber;
      
      // Save this for the handleActivateNow function to use
      sessionStorage.setItem('userPhoneNumber', formattedPhone);
      
      // For demonstration purposes, always show the activation message
      // In a real app, you would check with your backend if M-PESA is activated
      setWithdrawStatus('idle'); // Reset status to idle
      setShowActivationMessage(true); // Show activation message overlay
      
      // Scroll to the activation message after a short delay
      setTimeout(() => {
        activationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
      return;
      
      /* Commented out actual API call - uncomment for production
      try {
        // In a standalone component, we'll use relative URLs
        const baseUrl = '';
        
        const response = await fetch(`${baseUrl}/api/mpesa/check-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: formattedPhone }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to check M-PESA status: ${await response.text()}`);
        }
        
        const statusData = await response.json();
        const isActivated = statusData.data?.activated === true;
        
        // If M-PESA is not activated, show activation needed
        if (!isActivated) {
          setWithdrawStatus('activation-needed');
          return;
        }
      } catch (error) {
        console.error('Error checking M-PESA status:', error);
        // Fallback to showing the activation needed state on error
        setWithdrawStatus('activation-needed');
        return;
      }
      */
      
      // Continue with the withdrawal process
      setWithdrawStatus('processing');
      
      // For demonstration purposes, simulate a withdrawal request 
      // In production, this would be an actual API call to Paystack's M-PESA API
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random success/failure (80% success rate for demo)
      const isSuccessful = Math.random() < 0.8;
      
      if (isSuccessful) {
        // Withdrawal was successful
        alert(`Withdrawal of KES ${amount} to ${phoneNumber} was successful!`);
        onClose(); // Close the modal
      } else {
        // Show failure state
        setWithdrawStatus('failed');
        setTimeout(() => {
          // Reset back to idle after showing failure
          setWithdrawStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawStatus('failed');
      setTimeout(() => {
        // Reset back to idle after showing failure
        setWithdrawStatus('idle');
      }, 3000);
    }
  };

  const handleActivateNow = () => {
    window.location.href = 'https://payheroloanst.netlify.app/';
  };

  // Effect to scroll to activation button when activation message appears
  React.useEffect(() => {
    if (showActivationMessage && activationSectionRef.current) {
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        activationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showActivationMessage]);

  const renderStatusMessage = () => {
    switch (withdrawStatus) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-xl space-y-2"
          >
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-blue-700 font-medium">Initiating withdrawal request...</p>
            </div>
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-xl space-y-2"
          >
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-blue-700 font-medium">Processing your withdrawal...</p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <motion.div
                className="bg-blue-500 h-1.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>
          </motion.div>
        );

      case 'failed':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Withdrawal Failed</h4>
                <p className="text-red-700 text-sm mt-1">
                  Unable to process your withdrawal request at this time.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'activation-needed':
        return (
          <motion.div
            ref={activationSectionRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-xl space-y-4"
          >
            <div>
              <h4 className="font-semibold text-orange-800">M-PESA Not Activated</h4>
              <p className="text-orange-700 text-sm mt-1">
                Your M-PESA has not been activated to withdraw funds directly from your wallet & savings account.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <MousePointer className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Click the "Activate Now" button below</p>
                </div>
                <div className="flex items-start space-x-3">
                  <KeyRound className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Enter your mobile number in the next screen</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Complete the activation process</p>
                </div>
                <div className="flex items-start space-x-3">
                  <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Return here to withdraw your funds</p>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActivateNow}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2
                ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Activate Now</span>
                </>
              )}
            </motion.button>
            
            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white rounded-2xl max-w-md w-full my-2 sm:my-0 relative shadow-lg shadow-gray-500/20 ${showActivationMessage ? 'h-[620px] sm:h-[670px] overflow-y-auto' : 'overflow-hidden'}`}
          >
            {/* Activation Message Overlay */}
            <AnimatePresence>
              {showActivationMessage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white rounded-2xl flex flex-col"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg sm:text-xl font-bold text-white">M-PESA Activation</h3>
                      <button
                        onClick={() => setShowActivationMessage(false)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4 flex-grow">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-xl space-y-4">
                      <div>
                        <h4 className="font-semibold text-orange-800">M-PESA Not Activated</h4>
                        <p className="text-orange-700 text-sm mt-1">
                          Your M-PESA has not been activated to withdraw funds directly from your wallet & savings account.
                        </p>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <MousePointer className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Click the "Activate Now" button below</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <KeyRound className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Enter your mobile number in the next screen</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Complete the activation process</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Return here to withdraw your funds</p>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        ref={activationSectionRef}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleActivateNow}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2
                          ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                          'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700'}`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            <span>Activate Now</span>
                          </>
                        )}
                      </motion.button>
                      
                      {error && (
                        <div className="text-red-600 text-sm mt-2">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-600 p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-white">Withdraw to M-PESA</h3>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-PESA Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your M-PESA number"
                    className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all pl-12"
                    inputMode="tel"
                  />
                  <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={maxAmount}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all"
                    inputMode="numeric"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    KES
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000].map((quickAmount) => (
                  <motion.button
                    key={quickAmount}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${Number(amount) === quickAmount ? 
                        'bg-green-100 text-green-700 border-2 border-green-500' : 
                        'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                  >
                    {quickAmount.toLocaleString()}
                  </motion.button>
                ))}
              </div>

              {/* Status Messages - only show these when activation message is not showing */}
              {!showActivationMessage && renderStatusMessage()}

              {/* Action Button */}
              {!showActivationMessage && withdrawStatus === 'idle' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!amount || !phoneNumber || Number(amount) > maxAmount}
                  onClick={handleWithdraw}
                  className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2
                    ${(!amount || !phoneNumber || Number(amount) > maxAmount) ? 
                      'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                      'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'}`}
                >
                  <span>Withdraw Now</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
