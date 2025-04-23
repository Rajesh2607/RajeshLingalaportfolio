// components/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-[pulse_8s_ease-in-out_infinite] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Text Skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-[#1a2a3f] rounded w-2/3"></div>
          <div className="h-6 bg-[#1a2a3f] rounded w-1/3"></div>
          <div className="flex space-x-4 mt-6">
            <div className="w-10 h-10 bg-[#1a2a3f] rounded-full"></div>
            <div className="w-10 h-10 bg-[#1a2a3f] rounded-full"></div>
            <div className="w-24 h-10 bg-[#1a2a3f] rounded-lg"></div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="flex-1 flex justify-center">
          <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#1a2a3f] rounded-full border-4 border-[#17c0f8]"></div>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="bg-[#112240] p-12 sm:p-16 md:p-24 rounded-3xl border border-white/10 space-y-6 text-white max-w-6xl mx-auto mt-16">
        <div className="h-6 w-1/3 bg-[#1a2a3f] rounded"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-[#1a2a3f] rounded"></div>
          <div className="h-4 w-5/6 bg-[#1a2a3f] rounded"></div>
          <div className="h-4 w-3/4 bg-[#1a2a3f] rounded"></div>
          <div className="h-4 w-2/3 bg-[#1a2a3f] rounded"></div>
          <div className="h-4 w-1/2 bg-[#1a2a3f] rounded"></div>
        </div>
      </div>

    </div>
  );
};

export default SkeletonLoader;
