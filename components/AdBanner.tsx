
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdBannerProps {
    is_infeed?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ is_infeed = false }) => {
    const { t } = useLanguage();
    
    const bannerClasses = is_infeed 
        ? "w-full h-full min-h-[300px] flex items-center justify-center p-4 bg-gray-100 border border-dashed border-gray-300 rounded-xl"
        : "w-full min-h-[90px] flex items-center justify-center p-4 bg-gray-100 border border-dashed border-gray-300 rounded-lg";


    return (
        <div className={bannerClasses}>
            <div className="text-center">
                <p className="text-gray-500 font-semibold">{t('common.advertisement')}</p>
                <p className="text-xs text-gray-400 mt-1">Ad Placement</p>
            </div>
        </div>
    );
};

export default AdBanner;
