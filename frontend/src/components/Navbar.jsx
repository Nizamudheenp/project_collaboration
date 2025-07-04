import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <nav className=" px-4 py-3 flex items-center justify-between">
        <div
          className="font-bold text-2xl tracking-wide cursor-pointer select-none"
        >
          Collabix
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
            >
              Login
            </button>
          ) : (
            <>
              <span className="flex items-center text-sm gap-1">
                <span className="text-lg">👤</span>
                <span className="hidden sm:inline">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
