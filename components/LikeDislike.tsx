
import React from 'react';
import { ThumbUpOutlineIcon, ThumbUpSolidIcon, ThumbDownOutlineIcon, ThumbDownSolidIcon } from './IconComponents';

interface LikeDislikeProps {
  plumberId: string;
  likes: number;
  dislikes: number;
  onVote: (id: string, voteType: 'like' | 'dislike') => void;
  userVote?: 'like' | 'dislike';
}

const LikeDislike: React.FC<LikeDislikeProps> = ({ plumberId, likes, dislikes, onVote, userVote }) => {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(plumberId, 'like');
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(plumberId, 'dislike');
  };

  const likeClasses = userVote === 'like' 
    ? 'text-green-600' 
    : 'text-gray-400 hover:text-green-600';
  
  const dislikeClasses = userVote === 'dislike' 
    ? 'text-red-600'
    : 'text-gray-400 hover:text-red-600';

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button onClick={handleLike} className={`transition-colors duration-200 ${likeClasses}`} aria-pressed={userVote === 'like'}>
          {userVote === 'like' ? <ThumbUpSolidIcon className="w-5 h-5" /> : <ThumbUpOutlineIcon className="w-5 h-5" />}
        </button>
        <span className="font-medium text-gray-700 w-4 text-center">{likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={handleDislike} className={`transition-colors duration-200 ${dislikeClasses}`} aria-pressed={userVote === 'dislike'}>
          {userVote === 'dislike' ? <ThumbDownSolidIcon className="w-5 h-5" /> : <ThumbDownOutlineIcon className="w-5 h-5" />}
        </button>
        <span className="font-medium text-gray-700 w-4 text-center">{dislikes}</span>
      </div>
    </div>
  );
};

export default LikeDislike;
