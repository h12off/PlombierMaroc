import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutUsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-8">{t('about.title')}</h1>
        <div className="prose prose-lg text-gray-600 mx-auto space-y-6">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
