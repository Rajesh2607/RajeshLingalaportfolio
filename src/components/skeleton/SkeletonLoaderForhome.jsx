// components/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-[pulse_2s_ease-in-out_infinite] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">

      <div className="flex-1 space-y-4">
        <div className="h-10 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-600 rounded w-1/2"></div>
        <div className="flex space-x-4 mt-4">
          <div className="h-6 w-6 bg-gray-600 rounded-full" />
          <div className="h-6 w-6 bg-gray-600 rounded-full" />
          <div className="h-6 w-6 bg-gray-600 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-[300px] h-[300px] bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
