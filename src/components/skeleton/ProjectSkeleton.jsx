import React from 'react';

const ProjectSkeleton = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-12">
      {[1, 2, 3, 4].map((_, idx) => (
        <div
          key={idx}
          className="bg-[#112240] rounded-lg overflow-hidden shadow-lg"
        >
          <div className="h-64 bg-gray-700 w-full"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="flex gap-2 mt-4">
              <div className="w-16 h-6 bg-gray-600 rounded-full"></div>
              <div className="w-20 h-6 bg-gray-600 rounded-full"></div>
              <div className="w-12 h-6 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectSkeleton;
