// services/firestore/imageTasks.ts
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function saveImageTask(
  id: string,
  data: Partial<{ url: string; prompt: string }>
) {
  await setDoc(doc(db, "imageTasks", id), data, { merge: true });
}