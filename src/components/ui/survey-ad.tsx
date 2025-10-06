import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

// Survey ads data
const surveyAds = [
  {
    id: 'survey-1',
    title: 'Quick Survey - Earn KSh 500',
    description: 'Share your opinion and earn money instantly',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    ctaText: 'Start Survey',
    ctaUrl: 'https://surveypay.co.ke/survey/1',
    reward: 'KSh 500'
  },
  {
    id: 'survey-2',
    title: 'Product Review Survey',
    description: 'Review products and get paid for your feedback',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    ctaText: 'Review Now',
    ctaUrl: 'https://surveypay.co.ke/survey/2',
    reward: 'KSh 300'
  },
  {
    id: 'survey-3',
    title: 'Market Research Survey',
    description: 'Help businesses improve their services',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    ctaText: 'Participate',
    ctaUrl: 'https://surveypay.co.ke/survey/3',
    reward: 'KSh 400'
  },
  {
    id: 'survey-4',
    title: 'Consumer Behavior Study',
    description: 'Share your shopping habits and earn rewards',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&h=200&fit=crop',
    ctaText: 'Join Study',
    ctaUrl: 'https://surveypay.co.ke/survey/4',
    reward: 'KSh 600'
  },
  {
    id: 'survey-5',
    title: 'Technology Usage Survey',
    description: 'Tell us about your tech preferences',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop',
    ctaText: 'Take Survey',
    ctaUrl: 'https://surveypay.co.ke/survey/5',
    reward: 'KSh 350'
  },
  {
    id: 'survey-6',
    title: 'Financial Services Survey',
    description: 'Help improve financial products in Kenya',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
    ctaText: 'Get Started',
    ctaUrl: 'https://surveypay.co.ke/survey/6',
    reward: 'KSh 450'
  }
];

interface SurveyAdProps {
  adIndex: number;
  className?: string;
}

export const SurveyAd: React.FC<SurveyAdProps> = ({ adIndex, className = '' }) => {
  const ad = surveyAds[adIndex % surveyAds.length];

  const handleClick = () => {
    // Track ad click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_ad_click', {
        ad_id: ad.id,
        ad_title: ad.title
      });
    }
    
    window.open(ad.ctaUrl, '_blank');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}>
      <div className="relative">
        <img 
          src={ad.image} 
          alt={ad.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Survey+Ad';
          }}
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {ad.reward}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">{ad.title}</h3>
        <p className="text-xs text-gray-600 mb-3">{ad.description}</p>
        
        <button
          onClick={handleClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

interface PopupSurveyAdProps {
  isOpen: boolean;
  onClose: () => void;
  adIndex: number;
}

export const PopupSurveyAd: React.FC<PopupSurveyAdProps> = ({ isOpen, onClose, adIndex }) => {
  const ad = surveyAds[adIndex % surveyAds.length];

  const handleClick = () => {
    // Track ad click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_popup_click', {
        ad_id: ad.id,
        ad_title: ad.title
      });
    }
    
    window.open(ad.ctaUrl, '_blank');
    onClose();
  };

  const handleClose = () => {
    // Track ad close
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_popup_close', {
        ad_id: ad.id,
        ad_title: ad.title
      });
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={ad.image} 
                alt={ad.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Survey+Ad';
                }}
              />
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-3 left-3 bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                Earn {ad.reward}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{ad.title}</h3>
              <p className="text-gray-600 mb-4">{ad.description}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
