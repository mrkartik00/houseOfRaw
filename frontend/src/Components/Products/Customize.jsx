import React from 'react';
import { Link } from 'react-router-dom';
import feature from "../../assets/Choose Color.png";

const Customize = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col lg:flex-row items-center bg-yellow-50 rounded-2xl">
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Design Your Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get it Customized
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover high-quality comfortable clothing that effortlessly blends with your fashion. Designed to make you look and feel great every day.
          </p>
          <br />
          <Link
            to="/customize"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
        <div className="lg:w-1/2">
          <img
            src={feature}
            alt="Features Collection"
            className="w-full h-full object-cover lg:rounded-tr-2xl lg:rounded-br"
          />
        </div>
      </div>
    </section>
  );
};

export default Customize;
