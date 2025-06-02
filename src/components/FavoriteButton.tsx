'use client';

import { useEffect, useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface FavoriteButtonProps {
  musicTaskId: string | null;
  onFavoriteChange?: () => void;
}

export default function FavoriteButton({
  musicTaskId,
  onFavoriteChange,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { userId } = useAuth();
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!userId || !musicTaskId) return;
      const docRef = doc(db, 'users', userId, 'favorites', musicTaskId);
      const snap = await getDoc(docRef);
      setIsFavorited(snap.exists());
    };
    checkIfFavorited();
  }, [userId, musicTaskId]);

  const toggleFavorite = async () => {
    if (!userId || !musicTaskId) return;

    const docRef = doc(db, 'users', userId, 'favorites', musicTaskId);

    const optimisticState = !isFavorited;
    setIsFavorited(optimisticState); // Update UI immediately

    try {
      if (optimisticState) {
        await setDoc(docRef, {
          favoritedAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(docRef);
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      //  Rollback UI if error occurs
      setIsFavorited(!optimisticState);
    }
  };

  const Icon = isFavorited ? HeartSolid : HeartOutline;

  if (!userId) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      className="fixed top-4 right-4 z-50 p-2 bg-black/50 rounded-full cursor-pointer flex items-center justify-center"
      style={{ width: 40, height: 40 }}
    >
      <Icon className={`w-6 h-6 ${isFavorited ? 'text-red-500' : 'text-white'}`} />
    </button>
  );
}