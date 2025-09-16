
import React, { useState, useEffect } from 'react';
import { Plumber, Comment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PhoneIcon, LocationMarkerIcon, UserIcon, BadgeCheckIcon, HomeIcon } from '../components/IconComponents';
import StarRating from '../components/StarRating';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import AdBanner from '../components/AdBanner';

interface PlumberDetailPageProps {
  plumber: Plumber;
  onBack: () => void;
  onRate: (id: string, rating: number) => void;
}

const PlumberDetailPage: React.FC<PlumberDetailPageProps> = ({ plumber, onBack, onRate }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingComments(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('plumber_id', plumber.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data);
      }
      setIsLoadingComments(false);
    };

    fetchComments();

    const channel = supabase
      .channel(`comments:${plumber.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `plumber_id=eq.${plumber.id}`,
        },
        (payload) => {
            const newComment = payload.new as Comment;
            // Safeguard against null/incomplete payloads to prevent crashes
            if (!newComment || !newComment.id) return;
            
            // Add comment only if it's not already in the list to prevent duplicates
            setComments(currentComments => 
                currentComments.some(c => c.id === newComment.id)
                    ? currentComments
                    : [newComment, ...currentComments]
            );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [plumber.id]);

  const handleRate = (rating: number) => {
    onRate(plumber.id, rating);
    addToast(t('card.ratingThankYou'), 'success');
  };

  const getAverageRating = () => {
    if (!plumber.ratings || plumber.ratings.length === 0) return 0;
    const sum = plumber.ratings.reduce((a, b) => a + b, 0);
    return sum / plumber.ratings.length;
  };
  
  const handleAddComment = async (author: string, content: string) => {
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([{ plumber_id: plumber.id, author, content }])
      .select()
      .single();

    if (error) {
      console.error('Failed to post comment:', error);
      addToast('Failed to post comment. Please try again.', 'error');
      throw error; // Propagate error to form to stop loading state
    }

    if (newComment) {
      // Instant UI update
      setComments(currentComments => [newComment, ...currentComments]);
      addToast('Comment posted successfully!', 'success');
    }
  };
  
  const averageRating = getAverageRating();
  const totalRatings = plumber.ratings?.length || 0;
  
  const createdAt = plumber.created_at ? new Date(plumber.created_at) : null;
  const isNew = createdAt && (new Date().getTime() - createdAt.getTime()) < 48 * 60 * 60 * 1000;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-red-700 font-semibold mb-6 hover:underline flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('plumberDetail.backToDirectory')}
      </button>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {plumber.imageUrl ? (
              <img className="h-56 w-full object-cover md:w-56" src={plumber.imageUrl} alt={plumber.name} />
            ) : (
              <div className="h-56 w-full md:w-56 bg-red-100 flex items-center justify-center">
                <UserIcon className="w-24 h-24 text-red-700" />
              </div>
            )}
          </div>
          <div className="p-8 flex-grow">
            <div className="flex items-center flex-wrap gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{plumber.name}</h1>
                {isNew && (
                  <span className="flex-shrink-0 bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                    {t('card.new')}
                  </span>
                )}
                {plumber.is_verified && (
                    <div className="flex-shrink-0 flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                        <BadgeCheckIcon className="w-4 h-4" />
                        {t('card.verified')}
                    </div>
                )}
            </div>
            
            <div className="flex items-center text-gray-500 text-md mb-1">
              <LocationMarkerIcon className="w-5 h-5 mr-2 text-gray-400" />
              {plumber.city}
            </div>
            {plumber.address && (
              <div className="flex items-center text-gray-500 text-md">
                <HomeIcon className="w-5 h-5 mr-2 text-gray-400" />
                {plumber.address}
              </div>
            )}
            
            <p className="mt-4 text-gray-700">{plumber.bio || 'No bio provided.'}</p>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center">
                <StarRating rating={averageRating} onRate={handleRate} size={8} />
                <p className="text-sm text-gray-600 mt-2">
                    {totalRatings > 0 
                        ? `${averageRating.toFixed(1)} ${t('card.ratingAverage', { count: totalRatings })}` 
                        : t('card.noRatings')}
                </p>
            </div>

            <a
              href={`tel:${plumber.phone}`}
              className="w-full md:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              <PhoneIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              {t('card.callNow', { phone: plumber.phone })}
            </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('plumberDetail.commentsTitle')}</h2>
          {isLoadingComments ? (
              <p className="text-gray-500">{t('loading')}</p>
          ) : (
              <CommentList comments={comments} />
          )}
          <div className="my-8">
            <AdBanner adSlot="YOUR_AD_SLOT_ID_BANNER" />
          </div>
          <CommentForm onCommentSubmit={handleAddComment} />
      </div>

    </div>
  );
};

export default PlumberDetailPage;