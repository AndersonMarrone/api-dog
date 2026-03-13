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
    <Card className="flex flex-col gap-0 p-0 overflow-hidden">
      <div className="relative h-40 w-full bg-primary-100 dark:bg-primary-900/50">
        {pet.photoUrl ? (
          <Image
            src={pet.photoUrl}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">
            🐕
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="truncate font-semibold text-primary-900 dark:text-primary-100">
            {pet.name}
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            {pet.breed}{pet.age ? ` • ${pet.age}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/pet/${pet.id}`} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" fullWidth>Ver perfil</Button>
          </Link>
          {onGenerateQR && (
            <Button variant="secondary" type="button" onClick={() => onGenerateQR(pet)} className="flex-1">
              QR Code
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
