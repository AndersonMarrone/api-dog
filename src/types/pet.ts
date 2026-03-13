/**
 * Tipos do domínio Pet - Identificação Digital para Pets
 */

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  photoUrl: string | null;
  healthConditions: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: string;
  photoUrl?: string;
  healthConditions: string;
  ownerName: string;
  ownerPhone: string;
}

export interface LocationAlert {
  petId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  foundBy?: string;
}
