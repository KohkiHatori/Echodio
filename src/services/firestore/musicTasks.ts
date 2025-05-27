import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// Save any subset of music task fields independently
export async function saveMusicTask(id: string, data: Partial<{ url: string; prompt: string; lyricsType: string; genre: string }>) {
  await setDoc(doc(db, "musicTasks", id), data, { merge: true });
}