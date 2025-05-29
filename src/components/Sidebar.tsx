'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface SidebarProps {
  themeColor: string;
}

export default function Sidebar({ themeColor }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullyClosed, setFullyClosed] = useState(true);

  const { user } = useAuth();

  const closeSidebar = () => {
    setIsOpen(false);
    setFullyClosed(false);
    setTimeout(() => setFullyClosed(true), 500); // match transition
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 text-white transition-colors duration-500 transform transition-transform duration-500 ease-in-out opacity-92 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } z-30`}
        style={{ backgroundColor: themeColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between px-2">
          {/* Close Sidebar Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }}
            className="p-2 cursor-pointer"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>

          {/* Login/Logout Button */}
          {user ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="text-white underline text-sm cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="text-white underline text-sm cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* Open Sidebar Button */}
      {!isOpen && fullyClosed && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}