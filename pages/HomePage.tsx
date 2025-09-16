import React from 'react';
import PlumberForm from '../components/PlumberForm';
import { Plumber } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import AdBanner from '../components/AdBanner';

type PlumberFormData = Omit<Plumber, 'id' | 'ratings' | 'imageUrl' | 'likes' | 'dislikes' | 'comment_count' | 'created_at'> & { imageUrl?: string };

interface HomePageProps {
  addPlumber: (plumberData: PlumberFormData, imageFile?: File | null) => Promise<void>;
}

const HomePage: React.FC<HomePageProps> = ({ addPlumber }) => {
  const { t } = useLanguage();
  const title = t('home.title');
  const titleParts = title.split('<1>');

  return (
    <>
      <div 
        className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.postimg.cc/MGSK6MSt/Whisk-9d26e254b6719feaaf047fd9419fc6d3dr.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {titleParts.length === 3 ? (
                <>
                  {titleParts[0]}
                  <span className="text-red-500">{titleParts[1]}</span>
                  {titleParts[2]}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="mt-10">
            <PlumberForm
              onSubmit={addPlumber}
              submitButtonText={t('form.submitButton')}
              clearOnSubmit={true}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdBanner adSlot="YOUR_AD_SLOT_ID_BANNER" />
      </div>
    </>
  );
};

export default HomePage;