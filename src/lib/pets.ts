import { supabase } from "./supabase";
import type { Pet, PetFormData, LocationAlert } from "@/types/pet";

// Upload de foto via Cloudinary (unsigned)
export async function uploadPetPhoto(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Falha ao fazer upload da foto");
  const data = await res.json();
  return data.secure_url as string;
}

export async function createPet(userId: string, data: PetFormData): Promise<string> {
  const { data: pet, error } = await supabase
    .from("pets")
    .insert({
      user_id: userId,
      name: data.name,
      breed: data.breed ?? null,
      age: data.age ?? null,
      health_conditions: data.healthConditions ?? null,
      owner_name: data.ownerName,
      owner_phone: data.ownerPhone,
      photo_url: data.photoUrl ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return pet.id;
}

export async function getPetById(id: string): Promise<Pet | null> {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    breed: data.breed ?? "",
    age: data.age ?? "",
    healthConditions: data.health_conditions ?? "",
    ownerName: data.owner_name,
    ownerPhone: data.owner_phone,
    photoUrl: data.photo_url ?? null,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getPetsByUserId(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    name: d.name,
    breed: d.breed ?? "",
    age: d.age ?? "",
    healthConditions: d.health_conditions ?? "",
    ownerName: d.owner_name,
    ownerPhone: d.owner_phone,
    photoUrl: d.photo_url ?? null,
    userId: d.user_id,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
}

export async function updatePet(id: string, data: Partial<PetFormData>): Promise<void> {
  const { error } = await supabase
    .from("pets")
    .update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.breed !== undefined && { breed: data.breed }),
      ...(data.age !== undefined && { age: data.age }),
      ...(data.healthConditions !== undefined && { health_conditions: data.healthConditions }),
      ...(data.ownerName !== undefined && { owner_name: data.ownerName }),
      ...(data.ownerPhone !== undefined && { owner_phone: data.ownerPhone }),
      ...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deletePet(id: string): Promise<void> {
  const { error } = await supabase.from("pets").delete().eq("id", id);
  if (error) throw error;
}

export async function saveLocationAlert(
  alert: Omit<LocationAlert, "timestamp">
): Promise<void> {
  const { error } = await supabase.from("location_alerts").insert({
    pet_id: alert.petId,
    latitude: alert.latitude,
    longitude: alert.longitude,
  });
  if (error) throw error;
}
