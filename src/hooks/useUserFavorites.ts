'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserFavorites } from '@/services/firestore/favorites';
import { getMusicTask } from '@/services/firestore/musicTasks';
import { Timestamp } from 'firebase/firestore';

export interface FavoriteSong {
  musicTaskId: string;
  title: string | null;
  favoritedAt: Date | null;
}

interface FirestoreFavorite {
  musicTaskId: string;
  imageTaskId: string;
  favoritedAt: Timestamp;
}

export function useUserFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  const refreshFavorites = useCallback(async () => {
    if (user) {
      setLoadingFavorites(true);
      setFavoritesError(null);
      try {
        const favList: FirestoreFavorite[] = await getUserFavorites(user.uid) as FirestoreFavorite[];

        const withTitlesAndDates = await Promise.all(
          favList.map(async (fav) => {
            try {
              const task = await getMusicTask(fav.musicTaskId);
              let title: string | null = null;
              if (task && typeof task === 'object' && 'title' in task && typeof task.title === 'string') {
                title = task.title;
              } else {
                title = '(No Title)';
              }
              const favoritedAtDate = fav.favoritedAt instanceof Timestamp
                ? fav.favoritedAt.toDate()
                : null;
              return {
                musicTaskId: fav.musicTaskId,
                title,
                favoritedAt: favoritedAtDate
              };
            } catch (error) {
              console.error(`Failed to fetch title for ${fav.musicTaskId}:`, error);
              return {
                musicTaskId: fav.musicTaskId,
                title: '(Error fetching title)',
                favoritedAt: null
              };
            }
          })
        );

        const sortedFavorites = withTitlesAndDates.sort((a, b) => {
          if (b.favoritedAt && a.favoritedAt) {
            return b.favoritedAt.getTime() - a.favoritedAt.getTime();
          }
          if (b.favoritedAt) return 1;
          if (a.favoritedAt) return -1;
          return 0;
        });

        setFavorites(sortedFavorites);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setFavoritesError('Failed to load favorites');
      } finally {
        setLoadingFavorites(false);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return {
    favorites,
    loadingFavorites,
    favoritesError,
    refreshFavorites,
  };
}