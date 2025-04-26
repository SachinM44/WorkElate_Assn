import { useAuth } from '../contexts/AuthContext';
import React from 'react';
export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
