import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import login from "../assets/new.jpg";
import { loginUser } from '../services/authService';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);

      if (res.success) {
        localStorage.setItem('token', res.token);
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="flex">
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-6'>
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-6 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-4'>
            <h2 className='text-xl font-medium'>Raw & Roots</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-4'>Hey There!</h2>
          <p className='text-center mb-4'>
            Enter your username and password to login
          </p>

          {errorMsg && <p className="text-red-600 text-center mb-2">{errorMsg}</p>}

          <div className='mb-3'>
            <label className='block text-sm font-semibold mb-1'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your email address'
            />
          </div>
          <div className='mb-3'>
            <label className='block text-sm font-semibold mb-1'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your password'
            />
          </div>
          <button
            type="submit"
            className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
            Sign In
          </button>
          <p className='mt-4 text-center text-sm'>
            Don't have an account?{" "}
            <Link to="/register" className='text-blue-500'>Register Now</Link>
          </p>
        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt="Login to Account"
            className='h-[750px] w-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
