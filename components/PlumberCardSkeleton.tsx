
import React from 'react';

const PlumberCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2 mt-4 h-16">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="mt-4 flex justify-center py-1">
            <div className="h-6 w-36 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="p-6 pt-2 mt-auto">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default PlumberCardSkeleton;
