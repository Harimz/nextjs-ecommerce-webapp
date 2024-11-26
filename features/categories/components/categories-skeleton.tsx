import React from "react";

export const CategorySkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-6 bg-gray-300 rounded w-full"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    </div>
  );
};