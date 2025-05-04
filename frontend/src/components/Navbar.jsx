import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show back button if not on the home page
  const showBackButton = location.pathname !== '/';
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="text-gray-700 hover:text-blue-600 transition duration-200"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <Link to="/" className="text-2xl font-bold text-blue-600">📚 BookReview</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/add-book" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Add Book
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  {user.username}
                </Link>
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-600 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
