import React from "react";

const SkeletonLoading = () => {
  return (
    <div className="w-[280px] h-[480px] mb-2 rounded-[15px] bg-[#f1f1f14e] animate-pulse">
      <div className="h-[264px] w-[280px] my-auto object-cover rounded-[15px] bg-[#f1f1f150]"></div>
      <div className="h-4 w-[100px] ml-3 mt-3 rounded-[10px] bg-[#f1f1f139]"></div>
      <div className="h-4 w-[200px] ml-3 mt-3 rounded-[10px] bg-[#f1f1f139]"></div>
      <div className="h-4 w-[150px] ml-3 mt-3 rounded-[10px] bg-[#f1f1f139]"></div>
      <div className="h-4 w-[250px] ml-3 mt-3 rounded-[10px] bg-[#f1f1f139]"></div>
      <div className="h-4 w-[80px] ml-3 mt-3 rounded-[10px] bg-[#f1f1f139]"></div>
    </div>
  );
};

export default SkeletonLoading;
