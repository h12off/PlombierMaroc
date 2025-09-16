
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white mt-12 border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6 rtl:space-x-reverse">
                <button onClick={() => setPage('about')} className="text-sm text-gray-600 hover:text-red-700 transition">{t('footer.about')}</button>
                <button onClick={() => setPage('privacy')} className="text-sm text-gray-600 hover:text-red-700 transition">{t('footer.privacy')}</button>
                <button onClick={() => setPage('contact')} className="text-sm text-gray-600 hover:text-red-700 transition">{t('footer.contact')}</button>
            </div>
            <div className="text-center sm:text-right">
                <p className="text-sm text-gray-600">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                <p className="text-xs text-gray-500 mt-1">{t('footer.tagline')}</p>
                <p className="text-xs text-gray-500 mt-2">{t('footer.developedBy')}</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;