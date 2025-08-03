'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authAPI, User, getAuthToken } from '../utils/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authAPI.getCurrentUser()
        .then(setUser)
        .catch(() => authAPI.logout());
    }
  }, []);

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MiniLinkedIn
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href={`/profile/${user._id}`} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  
                  <span>Profile</span>
                </Link>
                <button
                  onClick={authAPI.logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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