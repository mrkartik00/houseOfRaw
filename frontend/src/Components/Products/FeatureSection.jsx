import React from 'react';
import { HiShoppingBag, HiArrowPathRoundedSquare, HiOutlineCreditCard } from 'react-icons/hi2';

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 bg-[#c9c9bfab]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiShoppingBag className="text-3xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">FREE SHIPPING</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            On all orders over Rs. 1000
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiArrowPathRoundedSquare className="text-3xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">30 DAYS RETURN</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Money Back Guarantee
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiOutlineCreditCard className="text-3xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">SECURE CHECKOUT</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            100% secured checkout process
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
