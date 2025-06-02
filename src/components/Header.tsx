// src/components/Header.tsx
'use client';

import Image from 'next/image';
import { Spinner } from './Spinner';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  musicTaskId: string | null;
  imageTaskId: string | null;
}

export default function Header({ musicTaskId, imageTaskId }: HeaderProps) {
  const { userId } = useAuth();
  return (
    <header
      className="fixed top-4 right-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center space-y-2">
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full ring-2 ring-white"
        />
        <Spinner />
      </div>
    </header>
  );
}