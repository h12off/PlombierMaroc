import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactUsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-8">{t('contact.title')}</h1>
        <div className="prose prose-lg text-gray-600 mx-auto text-center space-y-6">
          <p>{t('contact.p1')}</p>
          <p>
            <strong>{t('contact.emailLabel')}:</strong> <a href="mailto:contact@plumberfinder.ma" className="text-red-600 hover:underline">contact@plumberfinder.ma</a>
          </p>
          <p>
            <strong>{t('contact.phoneLabel')}:</strong> <a href="tel:+212500000000" className="text-red-600 hover:underline">+212 500 000 000</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
