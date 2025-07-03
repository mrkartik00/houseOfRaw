import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import profile from "../assets/profile.webp";
import { getUserDetails } from '../services/authService';
import { toast } from 'sonner';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasChildRoute, setHasChildRoute] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setHasChildRoute(location.pathname !== '/profile');
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails();
        if (res.success) {
          setUser(res.user);
        } else {
          toast.error(res.message);
          navigate('/login');
        }
      } catch (err) {
        toast.error("Failed to fetch user details");
        navigate('/login');
      }
    };

    fetchUser();
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow container mx-auto p-4 md:p-6'>
        <div className={`flex flex-col md:flex-row ${hasChildRoute ? 'md:space-x-6' : 'md:justify-center'} space-y-6 md:space-y-0`}>
          {/* Sidebar */}
          <motion.div
            layout
            initial={false}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut", type: "spring", stiffness: 100, damping: 20 }}
            className={`w-full ${hasChildRoute ? 'md:w-1/3 lg:w-1/4' : 'md:w-1/3 lg:w-1/4 md:max-w-sm'} shadow-md rounded-lg p-6 bg-white`}
          >
            <div className='flex flex-col items-center mb-6'>
              <img src={profile} alt='Profile' className='w-24 h-24 rounded-full mb-3' />
              <h1 className='text-xl font-semibold'>{user?.name || "..."}</h1>
              <p className='text-sm text-gray-600'>+91 {user?.phone || "..."}</p>
            </div>
            <nav className='space-y-3 text-center md:text-left'>
              <Link to='orders' className={`block px-4 py-2 rounded-lg hover:text-blue-500 ${isActive('/profile/orders') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-50'}`}>
                My Orders
              </Link>
              <Link to='shipping' className={`block px-4 py-2 rounded-lg hover:text-blue-500 ${isActive('/profile/shipping') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-50'}`}>
                Shipping Address
              </Link>
              <Link to='promocode' className={`block px-4 py-2 rounded-lg hover:text-blue-500 ${isActive('/profile/promocode') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-50'}`}>
                Promo Code
              </Link>
              <Link to='payment' className={`block px-4 py-2 rounded-lg hover:text-blue-500 ${isActive('/profile/payment') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-50'}`}>
                Payment
              </Link>
              <Link to='settings' className={`block px-4 py-2 rounded-lg hover:text-blue-500 ${isActive('/profile/settings') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-50'}`}>
                Settings
              </Link>
            </nav>
            <button
              onClick={handleLogout}
              className='mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-100'
            >
              Logout
            </button>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode='wait'>
            {hasChildRoute && (
              <motion.div
                key={location.pathname}
                initial={{ x: 300, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 300, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut", type: "spring", stiffness: 100, damping: 20 }}
                className='w-full md:w-2/3 lg:w-3/4 bg-white p-6 rounded-lg shadow-md'
              >
                <Outlet />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
