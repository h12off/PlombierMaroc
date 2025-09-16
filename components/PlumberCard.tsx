
import React from 'react';
import { Plumber } from '../types';
import { PhoneIcon, LocationMarkerIcon, UserIcon, BadgeCheckIcon, HomeIcon, ChatAltIcon } from './IconComponents';
import { useLanguage } from '../contexts/LanguageContext';
import StarRating from './StarRating';
import { useToast } from '../contexts/ToastContext';
import LikeDislike from './LikeDislike';

interface PlumberCardProps {
  plumber: Plumber;
  onRate: (id: string, rating: number) => void;
  onSelect: (plumber: Plumber) => void;
  onVote: (id: string, voteType: 'like' | 'dislike') => void;
  userVote?: 'like' | 'dislike';
}

const PlumberCard: React.FC<PlumberCardProps> = ({ plumber, onRate, onSelect, onVote, userVote }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();

  const handleRate = (rating: number) => {
    onRate(plumber.id, rating);
    addToast(t('card.ratingThankYou'), 'success');
  };

  const getAverageRating = () => {
    if (!plumber.ratings || plumber.ratings.length === 0) {
      return 0;
    }
    const sum = plumber.ratings.reduce((a, b) => a + b, 0);
    return sum / plumber.ratings.length;
  };
  
  const averageRating = getAverageRating();
  const totalRatings = plumber.ratings?.length || 0;
  const isVerified = plumber.is_verified;
  
  const createdAt = plumber.created_at ? new Date(plumber.created_at) : null;
  const isNew = createdAt && (new Date().getTime() - createdAt.getTime()) < 48 * 60 * 60 * 1000;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer h-full"
      onClick={() => onSelect(plumber)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(plumber); } }}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0">
             {plumber.imageUrl ? (
                <img className="w-16 h-16 rounded-full object-cover" src={plumber.imageUrl} alt={plumber.name} />
             ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-red-700" />
                </div>
             )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-xl font-bold text-gray-900 truncate">{plumber.name}</h3>
              {isNew && (
                <span className="flex-shrink-0 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {t('card.new')}
                </span>
              )}
              {isVerified && (
                  <div className="flex-shrink-0 flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <BadgeCheckIcon className="w-3.5 h-3.5" />
                    {t('card.verified')}
                  </div>
              )}
            </div>
            <p className="flex items-center text-sm text-gray-500 mt-1">
              <LocationMarkerIcon className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5 text-gray-400" />
              {plumber.city}
            </p>
            {plumber.address && (
              <p className="flex items-center text-sm text-gray-500 mt-1">
                <HomeIcon className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{plumber.address}</span>
              </p>
            )}
          </div>
        </div>
        <p className="text-gray-600 mt-4 text-sm min-h-[4rem]">{plumber.bio}</p>
        
        <div className="mt-4" onClick={e => e.stopPropagation()}>
            <StarRating rating={averageRating} onRate={handleRate} />
            <p className="text-xs text-gray-500 text-center mt-1">
                 {totalRatings > 0 
                    ? `${averageRating.toFixed(1)} ${t('card.ratingAverage', { count: totalRatings })}` 
                    : t('card.noRatings')}
            </p>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
                <ChatAltIcon className="w-5 h-5 text-gray-400" />
                <span className='font-medium'>{t('card.comments', { count: plumber.comment_count || 0 })}</span>
            </div>
            <LikeDislike
              plumberId={plumber.id}
              likes={plumber.likes}
              dislikes={plumber.dislikes}
              onVote={onVote}
              userVote={userVote}
            />
        </div>
        <a
          href={`tel:${plumber.phone}`}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
        >
          <PhoneIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          {t('card.call', { phone: plumber.phone })}
        </a>
      </div>
    </div>
  );
};

export default PlumberCard;