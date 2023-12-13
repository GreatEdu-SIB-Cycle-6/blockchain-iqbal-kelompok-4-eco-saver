import React from "react";

const About = () => {
  return (
    <div className="max-w-[1200px] mt-[-60px] md:mt-[-120px] w-full h-screen mx-auto text-left flex flex-col justify-center">
      <h1 className="mt-[60px] text-[30px] md:text-[40px] p-5 md:p-3 font-normal text-white font-['Poppins']">
        Apa itu EcoSaver?
      </h1>
      <article className='md:text-[20px] text-white font-light p-5 font-["Poppins"]'>
        <b className="text-emerald-400">Ecosaver</b> adalah sebuah platform
        crowdfunding berbasis blockchain yang beroperasi di jaringan Binance
        Smart Chain (BSC). Kami berkomitmen untuk menyediakan solusi inovatif
        bagi individu yang peduli tentang lingkungan dan ingin berpartisipasi
        dalam perbaikan lingkungan yang berkelanjutan.
      </article>
      <h1 className="text-[30px] md:text-[40px] p-5 md:p-3 font-normal text-white font-['Poppins']">
        Mengapa EcoSaver?
      </h1>
      <article className='md:text-[20px] text-white font-light p-5 font-["Poppins"]'>
        <h1 className="font-bold text-emerald-500 uppercase">
          Blockchain Technology
        </h1>
        Ecosaver menggunakan teknologi blockchain untuk memberikan keamanan,
        transparansi dalam setiap donasi yang diberikan. Setiap transaksi dapat
        dengan mudah dilacak dan diverifikasi oleh pengguna.
      </article>
    </div>
  );
};

export default About;
