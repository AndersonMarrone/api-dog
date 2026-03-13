import { notFound } from "next/navigation";
import { getPetById } from "@/lib/pets";
import { PetPublicView } from "./PetPublicView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PetPage({ params }: PageProps) {
  const { id } = await params;
  const pet = await getPetById(id);
  if (!pet) notFound();
  return <PetPublicView pet={pet} />;
}
