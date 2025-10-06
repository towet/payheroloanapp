import { useState, useCallback } from 'react';

interface AdSequenceItem {
  delay: number;
  adIndex: number;
}

export const useSurveyAds = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adQueue, setAdQueue] = useState<AdSequenceItem[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const showPopupAd = useCallback((delay: number = 2000, adIndex: number | null = null) => {
    setTimeout(() => {
      setCurrentAdIndex(adIndex !== null ? adIndex : Math.floor(Math.random() * 6));
      setPopupVisible(true);
      
      // Auto-close after 8 seconds
      setTimeout(() => {
        setPopupVisible(false);
      }, 8000);
    }, delay);
  }, []);

  const hidePopupAd = useCallback(() => {
    setPopupVisible(false);
  }, []);

  const processAdQueue = useCallback(() => {
    if (isProcessingQueue || adQueue.length === 0) {
      return;
    }
    
    setIsProcessingQueue(true);
    const nextAd = adQueue[0];
    setAdQueue(prev => prev.slice(1));
    
    setTimeout(() => {
      setCurrentAdIndex(nextAd.adIndex);
      setPopupVisible(true);
      
      // Auto-close after 8 seconds
      setTimeout(() => {
        setPopupVisible(false);
        setIsProcessingQueue(false);
        
        // Process next ad in queue after 1 second
        setTimeout(() => {
          processAdQueue();
        }, 1000);
      }, 8000);
    }, nextAd.delay);
  }, [adQueue, isProcessingQueue]);

  const showAdSequence = useCallback((adsArray: AdSequenceItem[]) => {
    setAdQueue(prev => [...prev, ...adsArray]);
    
    if (!isProcessingQueue) {
      processAdQueue();
    }
  }, [isProcessingQueue, processAdQueue]);

  return {
    popupVisible,
    currentAdIndex,
    showPopupAd,
    hidePopupAd,
    showAdSequence
  };
};
