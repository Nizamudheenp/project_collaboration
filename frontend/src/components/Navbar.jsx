import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toggleDarkMode } from '../../theme';
import {  FaUser } from 'react-icons/fa';
import { MdLightMode, MdOutlineLogout } from 'react-icons/md';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="w-full top-0 left-0 right-0 z-50 fixed bg-green-900 text-white dark:bg-green-700 shadow-md transition-colors">
      <nav className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div
          className="font-bold dark:text-black text-2xl tracking-wide cursor-pointer select-none"
        >
          Collabix
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className=" dark:text-black font-bold  text-sm px-3 py-1.5 rounded-md  hover:scale-105 transition"
          >
            Home
          </button>
          <button
            onClick={toggleDarkMode}
            className="dark:text-black font-bold  text-sm px-3 py-1.5 rounded-md  hover:scale-105 transition"
          >
            <MdLightMode size={18} />
          </button>
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="dark:text-black font-bold text-sm px-3 py-1.5 rounded-md  hover:scale-105 transition"
            >
              Login
            </button>
          ) : (
            <>
              <span className="flex items-center text-sm gap-1">
                <span className="text-lg dark:text-black font-bold"><FaUser/></span>
                <span className="hidden sm:inline dark:text-black ">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="dark:text-black font-bold text-sm px-3 py-1.5 rounded-md  hover:scale-105 transition"
              >
                <MdOutlineLogout />
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
