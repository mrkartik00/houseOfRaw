import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { TbBrandMeta } from 'react-icons/tb';
import { RiTwitterXLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { FiPhoneCall } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#f4f4f4] border-t border-gray-300 text-gray-700">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Newsletter</h3>
          <p className="text-sm mb-2">
            Be the first to hear about new products, exclusive offers, and more.
          </p>
          <p className="text-sm mb-4 text-gray-600">
            Sign up and get 10% off your first order.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-5 py-3 text-sm rounded-r-md hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-black transition">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-black transition">About Us</Link></li>
            <li><Link to="/faqs" className="hover:text-black transition">FAQs</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="hover:text-black transition">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Follow Us + Call */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex flex-wrap items-center justify-between md:block text-gray-700 mb-4 gap-3">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <TbBrandMeta className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <IoLogoInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <RiTwitterXLine className="w-5 h-5" />
              </a>
            </div>
<br />
            {/* Call Us (inline with icons on mobile, stacked on desktop) */}
            <div className="flex items-center gap-2 text-sm">
              <FiPhoneCall />
              8360-745-559
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 mt-8">
        <p className="text-center text-xs text-gray-500 tracking-tight">
          © 2025, CompileTab. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
