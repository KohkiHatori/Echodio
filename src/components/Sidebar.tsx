'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { getMusicTask } from '@/services/firestore/musicTasks';

interface FavoriteSong {
  musicTaskId: string;
  title: string | null;
  favoritedAt: number | Date;
}

interface SidebarProps {
  themeColor: string;
  favorites: FavoriteSong[];
  loadingFavorites: boolean;
  favoritesError: string | null;
  setMusicQueue: React.Dispatch<React.SetStateAction<any[]>>;
  currentIndex: number;
  selectedGenre: string;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange?: (open: boolean) => void;
}

export default function Sidebar({
  themeColor,
  favorites,
  loadingFavorites,
  favoritesError,
  setMusicQueue,
  currentIndex,
  selectedGenre,
  setSelectedGenre,
  onOpenChange,

}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullyClosed, setFullyClosed] = useState(true);

  const { user } = useAuth();

  const closeSidebar = () => {
    setIsOpen(false);
    onOpenChange?.(false);
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
            style={{ mixBlendMode: "exclusion" }}
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
              style={{ mixBlendMode: "exclusion" }}
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

        <div className="mt-14 px-4">
          <label htmlFor="genre-select" className="block text-white text-sm mb-1" style={{ mixBlendMode: "exclusion" }}>ジャンル選択</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            className="w-full rounded-md p-2 bg-black text-white font-mono select-arrow-right"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2.5rem' }}
          >
            <option value="Jazz">ジャズ</option>
            <option value="Bossa Nova">ボサノバ</option>
            <option value="Ambient">アンビエント</option>
            <option value="Healing">ヒーリング</option>
            <option value="Lo-fi">Lo-fi</option>
          </select>
        </div>

        {/* Favorites List */}
        {user && (
          <div className="mt-6 px-4">
            <h2 className="text-lg font-semibold mb-2" style={{ mixBlendMode: "exclusion" }}>Favorites</h2>
            {loadingFavorites && <div className="text-sm text-gray-300">Loading...</div>}
            {favoritesError && <div className="text-sm text-red-400">{favoritesError}</div>}
            {!loadingFavorites && !favoritesError && favorites.length === 0 && (
              <div className="text-sm text-gray-300" style={{ mixBlendMode: "exclusion" }}>No favorites yet.</div>
            )}
            <ul className="space-y-1">
              {[...favorites]
                .sort((a, b) => {
                  const aTime = typeof a.favoritedAt === 'number' ? a.favoritedAt : new Date(a.favoritedAt).getTime();
                  const bTime = typeof b.favoritedAt === 'number' ? b.favoritedAt : new Date(b.favoritedAt).getTime();
                  return bTime - aTime;
                })
                .map((fav) => (
                  <li
                    key={fav.musicTaskId}
                    className="truncate text-sm text-white/90 cursor-pointer hover:underline"
                    style={{ mixBlendMode: "exclusion" }}
                    onClick={async () => {
                      const task = await getMusicTask(fav.musicTaskId) as { url?: string } | null;
                      const url = task?.url || '';
                      setMusicQueue((prev) => {
                        // Insert favorite at currentIndex
                        const newSong = { url, title: fav.title, task_id: fav.musicTaskId };
                        return [
                          ...prev.slice(0, currentIndex),
                          newSong,
                          ...prev.slice(currentIndex)
                        ];
                      });
                    }}
                  >
                    {fav.title}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Open Sidebar Button */}
      {!isOpen && fullyClosed && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            onOpenChange?.(true);
          }}
        >
          {user?.photoURL ? (
            <Image src={user.photoURL} alt="User Avatar" width={32} height={32} className="rounded-full ring-2 ring-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </button>
      )}
    </>
  );
}