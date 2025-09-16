

import React, { useState, useMemo } from 'react';
import { Plumber } from '../types';
import PlumberCard from '../components/PlumberCard';
import { MOROCCAN_CITIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { SearchIcon, RefreshIcon } from '../components/IconComponents';
import PlumberCardSkeleton from '../components/PlumberCardSkeleton';
import AdBanner from '../components/AdBanner';

interface DirectoryPageProps {
  plumbers: Plumber[];
  onRate: (id: string, rating: number) => void;
  isLoading: boolean;
  fetchError: string | null;
  onRetry: () => void;
  onPlumberSelect: (plumber: Plumber) => void;
  onVote: (id: string, voteType: 'like' | 'dislike') => void;
  userVotes: { [key: string]: 'like' | 'dislike' };
}

const calculateAverageRating = (ratings: number[] | undefined) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
};

type SortBy = 'rating' | 'likes';

const DirectoryPage: React.FC<DirectoryPageProps> = ({ plumbers, onRate, isLoading, fetchError, onRetry, onPlumberSelect, onVote, userVotes }) => {
  const { t } = useLanguage();
  const [filterCity, setFilterCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('rating');

  const sortedAndFilteredPlumbers = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase().trim();

    const filteredPlumbers = plumbers.filter(p => {
        const isInCity = filterCity === 'All' || p.city === filterCity;
        if (!isInCity) return false;

        if (lowercasedQuery === '') return true;

        const nameMatch = p.name.toLowerCase().includes(lowercasedQuery);
        const cityMatch = p.city.toLowerCase().includes(lowercasedQuery);
        const addressMatch = p.address?.toLowerCase().includes(lowercasedQuery) || false;

        return nameMatch || cityMatch || addressMatch;
    });
      
    return filteredPlumbers.sort((a, b) => {
      if (sortBy === 'likes') {
        if (b.likes !== a.likes) {
          return b.likes - a.likes;
        }
        // Tie-breaker: rating
        return calculateAverageRating(b.ratings) - calculateAverageRating(a.ratings);
      }
      
      // Default sort by rating
      const ratingA = calculateAverageRating(a.ratings);
      const ratingB = calculateAverageRating(b.ratings);
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      // Tie-breaker: number of ratings
      return (b.ratings?.length || 0) - (a.ratings?.length || 0);
    });
  }, [plumbers, filterCity, searchQuery, sortBy]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <PlumberCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-red-700">{t('error.title')}</h3>
          <p className="text-gray-600 mt-2 mb-6">{t('error.message')}</p>
          <button 
            onClick={onRetry}
            className="bg-red-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition flex items-center justify-center mx-auto gap-2"
          >
            <RefreshIcon className="w-5 h-5" />
            {t('error.retry')}
          </button>
        </div>
      );
    }
    
    if (sortedAndFilteredPlumbers.length > 0) {
      const contentWithAds: React.ReactNode[] = [];
      
      sortedAndFilteredPlumbers.forEach((plumber, index) => {
        contentWithAds.push(<PlumberCard key={plumber.id} plumber={plumber} onRate={onRate} onSelect={onPlumberSelect} onVote={onVote} userVote={userVotes[plumber.id]} />);
        
        // Insert an ad after every 6th plumber
        if ((index + 1) % 6 === 0) {
            contentWithAds.push(<AdBanner key={`infeed-ad-${index}`} is_infeed={true} adSlot="YOUR_AD_SLOT_ID_INFEED" />);
        }
      });

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentWithAds}
        </div>
      );
    }

    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">{t('directory.noPlumbersTitle')}</h3>
        <p className="text-gray-500 mt-2">
          {searchQuery.trim() !== '' 
            ? t('directory.noSearchResults', { query: searchQuery }) 
            : t('directory.noPlumbersMessage', { city: filterCity })}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">{t('directory.title')}</h1>
        <p className="mt-2 text-lg text-gray-600">{t('directory.subtitle')}</p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-3 rtl:right-3" />
          <input
            type="text"
            placeholder={t('directory.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600"
            aria-label={t('directory.searchPlaceholder')}
          />
        </div>
        <div className="relative sm:w-1/3">
          <label htmlFor="city-filter" className="sr-only">{t('directory.filterLabel')}</label>
          <select
            id="city-filter"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-red-600 focus:border-red-600 sm:text-sm rounded-lg shadow-sm"
          >
            <option value="All">{t('directory.allCities')}</option>
            {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8">
        <button
          onClick={() => setSortBy('rating')}
          className={`px-5 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-200 ${
            sortBy === 'rating'
              ? 'bg-red-700 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {t('directory.bestRated')}
        </button>
        <button
          onClick={() => setSortBy('likes')}
          className={`px-5 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-200 ${
            sortBy === 'likes'
              ? 'bg-red-700 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {t('directory.mostLiked')}
        </button>
      </div>
      
      {!isLoading && !fetchError && (
        <div className="text-center mb-6">
          <p className="text-md text-gray-700">
            {t('directory.plumbersFound', { count: sortedAndFilteredPlumbers.length })}
          </p>
        </div>
      )}

      <div className="mb-8">
        <AdBanner adSlot="YOUR_AD_SLOT_ID_BANNER" />
      </div>

      {renderContent()}

    </div>
  );
};

export default DirectoryPage;
