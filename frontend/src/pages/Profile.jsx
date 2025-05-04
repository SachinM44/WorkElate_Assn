import { useAuth } from '../contexts/AuthContext';
import React from 'react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Simple Profile Header */}
        <div className="bg-blue-500 p-5 text-white">
          <div className="flex items-center">
            <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center text-blue-500 text-xl font-bold mr-4">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-xl font-semibold">{user.username}</h1>
          </div>
        </div>
        
        {/* Simple Profile Content */}
        <div className="p-5">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
