// components/Layout/Navbar.js
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiBars3BottomRight } from 'react-icons/hi2';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useCart } from '../../context/CartContext';
import React from 'react';
import { useLocation } from "react-router-dom";


const Navbar = () => {
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { getCartItemCount } = useCart();

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const cartItemCount = getCartItemCount();

    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]);

    return (
        <>
            <nav className="bg-[#c9c9bf6b] shadow-sm">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <div>
                        <Link to="/" className='text-2xl font-medium'>
                            Raw & Roots
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <Link to="/shops/all" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                            Men
                        </Link>
                        <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                            Women
                        </Link>
                        <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                            Top Wear
                        </Link>
                        <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                            Bottom Wear
                        </Link>
                    </div>
                    <div className='flex items-center space-x-4'>
                        {/* Favorites icon */}
                        <Link to="/favorites" className="hover:text-black">
                            <HiOutlineHeart className='h-6 w-6 text-gray-700' />
                        </Link>

                        {/* Profile icon */}
                        <Link to={isLoggedIn ? "/profile" : "/login"} className="hover:text-black">
                            <HiOutlineUser className='h-6 w-6 text-gray-700' />
                        </Link>

                        {/* Cart icon */}
                        <Link to="/cart" className="relative hover:text-black">
                            <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Search bar */}
                        <div className='overflow-hidden'>
                            <SearchBar />
                        </div>

                        {/* Mobile nav toggle */}
                        <button onClick={toggleNavDrawer} className="md:hidden">
                            <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile navigation drawer */}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-[#f5f5dc] shadow-lg transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className='flex justify-end p-4'>
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className='h-6 w-6 text-gray-600' />
                    </button>
                </div>
                <div className='p-4'>
                    <h2 className='text-xl font-semibold mb-4'>Menu</h2>
                    <nav className='space-y-4'>
                        <Link to="/shops/all" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black'>
                            Men
                        </Link>
                        <Link to="#" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black'>
                            Women
                        </Link>
                        <Link to="#" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black'>
                            Top Wear
                        </Link>
                        <Link to="#" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black'>
                            Bottom Wear
                        </Link>
                        <hr className="my-4" />
                        <Link to="/cart" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black flex items-center'>
                            <HiOutlineShoppingBag className='h-5 w-5 mr-2' />
                            Cart {cartItemCount > 0 && `(${cartItemCount})`}
                        </Link>
                        <Link to="/favorites" onClick={toggleNavDrawer} className='block text-gray-700 hover:text-black flex items-center'>
                            <HiOutlineHeart className='h-5 w-5 mr-2' />
                            Favorites
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
