
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../types';

interface GDPRBannerProps {
  setPage: (page: Page) => void;
}

const GDPRBanner: React.FC<GDPRBannerProps> = ({ setPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('gdpr_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr_consent', 'accepted');
    setIsVisible(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem('gdpr_consent', 'declined');
    setIsVisible(false);
  };
  
  const handlePrivacyLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPage('privacy');
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-800 text-white p-4 z-[100] transition-transform duration-500 transform translate-y-0">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left flex-grow">
          {t('gdpr.message')}{' '}
          <button onClick={handlePrivacyLinkClick} className="underline hover:text-red-400 font-semibold">
            {t('gdpr.privacyLink')}
          </button>
          .
        </p>
        <div className="flex-shrink-0 flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 transition"
          >
            {t('gdpr.decline')}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-700 hover:bg-red-600 transition"
          >
            {t('gdpr.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRBanner;
