import React from "react";
import { Hero, Footer} from "../components";

import ParticleBackground from "../components/ParticleBackground";


const Home = () => {
  return (
    <div>
      <ParticleBackground/>
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
