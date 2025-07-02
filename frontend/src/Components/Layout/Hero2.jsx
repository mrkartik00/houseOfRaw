import React from 'react';
import { Link } from 'react-router-dom';
import red from '../../assets/1st.png';
import yellow from '../../assets/2nd.png';
import black from '../../assets/3rd.png';
import white from '../../assets/4th.png';

const GenderCollectionSelection = () => {
    return (
        <div className="bg-white px-4 py-6">
            {/* ✅ Mobile Layout */}
            <div className="block md:hidden space-y-2">
                {/* New Collection - full width */}
                <Link to="/new-collection" className="relative block group overflow-hidden">
                    <img
                        src={red}
                        alt="New Collection"
                        className="w-full h-[220px] object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                        <span className="text-white text-2xl font-bold">New collection</span>
                    </div>
                </Link>

                {/* Grid: Summer + Black (Left), Hoodies (Right) */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Left Column */}
                    <div className="space-y-2">
                        {/* Summer Sale */}
                        <Link to="/summer-sale" className="relative block group overflow-hidden">
                            <img
                                src={white}
                                alt="Summer Sale"
                                className="w-full h-[110px] object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center px-2 text-center">
                                <span className="text-red-600 text-xl font-bold leading-tight">
                                    Summer<br />sale !!
                                </span>
                            </div>
                        </Link>

                        {/* Black (now taller to match Hoodies height) */}
                        <Link to="/black-style" className="relative block group overflow-hidden">
                            <img
                                src={black}
                                alt="Black"
                                className="w-full h-[182px] object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                                <span className="text-white text-xl font-semibold">Black</span>
                            </div>
                        </Link>
                    </div>

                    {/* Hoodies on right, tall */}
                    <Link to="/mens-hoodies" className="relative block group overflow-hidden h-full">
                        <img
                            src={yellow}
                            alt="Men’s Hoodies"
                            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                            <span className="text-white text-xl font-bold leading-tight">
                                Men’s<br />hoodies
                            </span>
                        </div>
                    </Link>
                </div>
            </div>


            {/* ✅ Desktop Layout */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[600px] mt-6">
                {/* New Collection */}
        <Link to="/new-collection" className="relative col-span-2 row-span-2 group overflow-hidden">
          <img
            src={red}
            alt="New Collection"
            className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-6">
            <span className="text-white text-3x1 md:text-6xl font-bold">New collection</span>
          </div>
        </Link>

                {/* Summer Sale */}
        <Link to="/summer-sale" className="relative col-span-1 group overflow-hidden">
          <img
            src={white}
            alt="Summer Sale"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-center px-4">
            <span className="text-red-600 text-xl md:text-6xl font-bold leading-tight">
              Summer<br />sale !!
            </span>
          </div>
        </Link>

                {/* Men's Hoodies */}
        <Link to="/mens-hoodies" className="relative col-span-1 row-span-2 group overflow-hidden">
          <img
            src={yellow}
            alt="Men’s Hoodies"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-6">
            <span className="text-white text-xl md:text-4xl font-bold leading-tight">
              Men’s<br />hoodies
            </span>
          </div>
        </Link>

                {/* Black */}
        <Link to="/black-style" className="relative col-span-1 group overflow-hidden">
          <img
            src={black}
            alt="Black"
            className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
            <span className="text-white text-xl md:text-5xl font-semibold">Black</span>
          </div>
        </Link>
            </div>
        </div>
    );
};

export default GenderCollectionSelection;
