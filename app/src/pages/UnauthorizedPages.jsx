import React from "react";
import imageNotAdmin from "../assets/notAdmin.png";

const UnauthorizedPages = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src={imageNotAdmin}
        className="w-[500px] h-[500px] mx-auto py-10 ml-[140px] mb-40"
        alt="not-admin"
      />
      <div className="text-center mb-40">
        <h1 className="text-[89px] font-bold text-white mb-5 mx-auto">
          401 - Unauthorized Pages
        </h1>
        <p className="text-lg text-gray-300 py-2 my-auto font-bold">
          Kamu tuh ga <mark className="bg-red-500 text-white">diajak</mark> 😋
        </p>
        <p className="text-lg text-gray-300 my-auto font-bold">
          Cuman <mark className="bg-blue-500 text-white">Admin</mark> yang diajakkk 😎
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPages;
