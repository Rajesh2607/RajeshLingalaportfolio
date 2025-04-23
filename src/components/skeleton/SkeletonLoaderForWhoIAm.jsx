import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoaderForWhoIAm = () => {
  return (
    <div className="px-6 py-12 bg-[#0a192f] text-white min-h-screen">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Skeleton height={40} width={200} baseColor="#1e293b" highlightColor="#334155" />
        <Skeleton count={3} height={20} baseColor="#1e293b" highlightColor="#334155" />
      </div>

      <div className="mt-16 space-y-12 max-w-4xl mx-auto">
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            height={150}
            baseColor="#1e293b"
            highlightColor="#334155"
            className="rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoaderForWhoIAm;
