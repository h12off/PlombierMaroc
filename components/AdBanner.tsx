import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

interface AdBannerProps {
    is_infeed?: boolean;
    adSlot?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ is_infeed = false, adSlot = "6709710432" }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("Adsense error: ", e);
        }
    }, []);

    const bannerClasses = is_infeed
        ? "w-full h-full min-h-[300px] flex items-center justify-center p-4 bg-gray-100 rounded-xl"
        : "w-full min-h-[90px] flex items-center justify-center p-4 bg-gray-100 rounded-lg";

    return (
        <div className={bannerClasses}>
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-6987889246292686"
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdBanner;
