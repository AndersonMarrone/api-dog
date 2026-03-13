import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Pet, PetFormData, LocationAlert } from "@/types/pet";

const PETS_COLLECTION = "pets";
const ALERTS_COLLECTION = "locationAlerts";

export async function createPet(userId: string, data: PetFormData): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const payload = {
    ...data,
    userId,
    photoUrl: data.photoUrl ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, PETS_COLLECTION), payload);
  return ref.id;
}

export async function getPetById(id: string): Promise<Pet | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, PETS_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Pet;
}

export async function getPetsByUserId(userId: string): Promise<Pet[]> {
  if (!db) return [];
  const q = query(collection(db, PETS_COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  const pets = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Pet));
  pets.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  return pets;
}

export async function updatePet(id: string, data: Partial<PetFormData>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, PETS_COLLECTION, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePet(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, PETS_COLLECTION, id));
}

export async function uploadPetPhoto(file: File, petId: string): Promise<string> {
  if (!storage) throw new Error("Firebase not configured");
  const path = `pets/${petId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function saveLocationAlert(alert: Omit<LocationAlert, "timestamp">): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await addDoc(collection(db, ALERTS_COLLECTION), {
    ...alert,
    timestamp: serverTimestamp(),
  });
}
