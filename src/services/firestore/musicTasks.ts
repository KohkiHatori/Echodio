import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Save any subset of music task fields independently
export async function saveMusicTask(
  id: string,
  data: Partial<{ url: string; prompt: string; lyricsType: string; genre: string, title: string }>
) {
  await setDoc(doc(db, "musicTasks", id), data, { merge: true });
}
export async function getMusicTask(id: string) {
  const taskRef = doc(db, "musicTasks", id);
  const snapshot = await getDoc(taskRef);

  if (!snapshot.exists()) {
    return null; // or throw new Error("Task not found");
  }

  return { id: snapshot.id, ...snapshot.data() };
}