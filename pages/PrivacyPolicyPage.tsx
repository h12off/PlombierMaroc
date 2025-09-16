
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-8">{t('privacy.title')}</h1>
        <div className="prose prose-lg text-gray-600 mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('privacy.s1.title')}</h2>
          <p>{t('privacy.s1.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-800">{t('privacy.s2.title')}</h2>
          <p>{t('privacy.s2.p1')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.s2.l1')}</li>
            <li>{t('privacy.s2.l2')}</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-800">{t('privacy.s3.title')}</h2>
          <p>{t('privacy.s3.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-800">{t('privacy.s4.title')}</h2>
          <p>{t('privacy.s4.p1')}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
