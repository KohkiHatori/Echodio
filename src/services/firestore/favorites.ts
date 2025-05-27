import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, serverTimestamp } from "firebase/firestore";

export async function addFavorite(userId: string, musicTaskId: string, imageTaskId: string) {
  const favoritesRef = collection(db, "users", userId, "favorites");
  await setDoc(doc(favoritesRef, musicTaskId), {
    imageTaskId,
    favoritedAt: serverTimestamp()
  });
}

export async function getUserFavorites(userId: string) {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));
  return snapshot.docs.map(doc => ({
    musicTaskId: doc.id,
    ...doc.data()
  }));
}