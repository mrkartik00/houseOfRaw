import heroImg from "../../assets/home_img.png";
import heroImage2 from "../../assets/mobile-view.png";
import { Link } from "react-router-dom";
import React from "react";


const Hero = () => {
  return (
    <section className="relative">
      <div className="relative">
        {/* Desktop image */}
        <img
          src={heroImg}
          alt="Raw"
          className="hidden md:block w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover object-[center_20%]"
        />

        {/* Mobile image */}
        <img
          src={heroImage2}
          alt="Mobile Hero"
          className="block md:hidden w-full h-[400px] object-cover object-[center_30%]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-start md:items-center justify-center md:justify-end px-4 md:px-16">
          <div className="text-white pt-44 md:pt-0 p-6 text-center md:text-right">
            <h1 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-4 leading-tight">
              Raw.
               Real. <br /> Street.
            </h1>
            <Link
              to="/shops/all"
              className="inline-block border border-white text-white px-8 py-3 text-sm rounded-md bg-transparent hover:bg-white hover:text-black transition-all duration-200"
            >
              <b>Shop Now..</b>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
