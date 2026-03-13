import Link from "next/link";
import Image from "next/image";
import type { Pet } from "@/types/pet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PetCardProps {
  pet: Pet;
  onGenerateQR?: (pet: Pet) => void;
}

export function PetCard({ pet, onGenerateQR }: PetCardProps) {
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-100 dark:bg-primary-900/50">
        {pet.photoUrl ? (
          <Image
            src={pet.photoUrl}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            🐕
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-primary-900 dark:text-primary-100">
          {pet.name}
        </h3>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          {pet.breed} {pet.age ? `• ${pet.age}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/pet/${pet.id}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">Ver perfil</Button>
        </Link>
        {onGenerateQR && (
          <Button variant="secondary" type="button" onClick={() => onGenerateQR(pet)}>
            QR Code
          </Button>
        )}
      </div>
    </Card>
  );
}
