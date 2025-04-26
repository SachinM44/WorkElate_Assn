import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">📚 BookReview</Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/profile">{user.username}</Link>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="text-blue-500">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
