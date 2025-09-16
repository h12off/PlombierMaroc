

import React, { useState, useEffect } from 'react';
import { Plumber } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Map from '../components/Map';

interface MapPageProps {
  plumbers: Plumber[];
  onPlumberSelect: (plumber: Plumber) => void;
}

const MapPage: React.FC<MapPageProps> = ({ plumbers, onPlumberSelect }) => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        () => {
          // Handle error or user denial
          setIsLoadingLocation(false);
        },
        { timeout: 10000 }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">{t('mapPage.title')}</h1>
        <p className="mt-2 text-lg text-gray-600">{t('mapPage.subtitle')}</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoadingLocation ? (
            <div className="h-[600px] flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">{t('mapPage.loadingLocation')}</p>
            </div>
        ) : (
             <Map 
                plumbers={plumbers} 
                userLocation={userLocation} 
                onPlumberSelect={onPlumberSelect} 
            />
        )}
      </div>
    </div>
  );
};

export default MapPage;