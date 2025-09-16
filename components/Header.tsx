

import React, { useState } from 'react';
import { Page } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuIcon, XIcon } from './IconComponents';

interface HeaderProps {
  setPage: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ setPage, currentPage }) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClasses = (page: Page, isMobile: boolean = false) =>
    isMobile
      ? `flex items-center gap-2 w-full text-left px-4 py-2 rounded-md text-base font-medium transition-colors ${
          currentPage === page
            ? 'bg-red-700 text-white'
            : 'text-gray-700 hover:bg-red-100 hover:text-red-800'
        }`
      : `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentPage === page
            ? 'bg-red-700 text-white'
            : 'text-gray-700 hover:bg-red-100 hover:text-red-800'
        }`;
  
  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNavClick('home')} className="flex-shrink-0">
              <span className="text-xl font-bold text-red-700">{t('header.title')}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
                <button onClick={() => handleNavClick('home')} className={linkClasses('home')}>
                {t('header.register')}
                </button>
                <button onClick={() => handleNavClick('directory')} className={linkClasses('directory')}>
                {t('header.findPlumber')}
                </button>
            </div>
            <LanguageSwitcher />
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XIcon className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute w-full bg-white shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => handleNavClick('home')} className={linkClasses('home', true)}>
              {t('header.register')}
            </button>
            <button onClick={() => handleNavClick('directory')} className={linkClasses('directory', true)}>
              {t('header.findPlumber')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;