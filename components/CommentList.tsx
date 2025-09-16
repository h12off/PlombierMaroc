
import React from 'react';
import { Comment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    const { t } = useLanguage();

    const timeAgo = (date: string): string => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        if (seconds < 30) {
            return t('timeAgo.justNow');
        }

        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const count = Math.floor(seconds / secondsInUnit);
            if (count > 0) {
                return t(`timeAgo.${unit}`, { count });
            }
        }
        return t('timeAgo.justNow');
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>{t('plumberDetail.noComments')}</p>
            </div>
        );
    }

  return (
    <div className="space-y-6">
      {[...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(comment => (
        <div key={comment.id} className="flex space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-500">{comment.author.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h4 className="font-semibold text-gray-800">{comment.author}</h4>
              <p className="text-xs text-gray-400">{timeAgo(comment.created_at)}</p>
            </div>
            <p className="text-gray-600 mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
