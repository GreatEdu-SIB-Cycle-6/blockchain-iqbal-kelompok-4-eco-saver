import React from "react";

const About = () => {
  return (
    <div className="max-w-[1200px] mt-[-150px] w-full h-screen mx-auto text-left flex flex-col justify-center">
      <h1 className="mt-9 text-[30px] md:text-[50px] p-5 md:p-3 font-normal text-white font-['Poppins']">What is EcoSaver?</h1>
      <article className='md:text-[28px] sm:text-8 text-white font-normal p-5 font-["Poppins"]'>
        <b className="text-emerald-400">Ecosaver</b> adalah sebuah platform crowdfunding berbasis blockchain yang
        beroperasi di jaringan Binance Smart Chain (BSC). Kami berkomitmen untuk
        menyediakan solusi inovatif bagi individu yang peduli tentang lingkungan
        dan ingin berpartisipasi dalam perbaikan lingkungan yang berkelanjutan.
        Di Ecosaver, kami memungkinkan pengguna untuk memberikan donasi
        menggunakan stablecoin, membantu pengembang lingkungan dalam upaya
        membersihkan sampah, merestorasi ekosistem, dan menjalankan
        proyek-proyek lain yang mendukung keberlanjutan planet kita.
      </article>
    </div>
  );
};

export default About;
