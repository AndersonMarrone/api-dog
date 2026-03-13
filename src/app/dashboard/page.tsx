"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getPetsByUserId } from "@/lib/pets";
import type { Pet } from "@/types/pet";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { PetCard } from "@/components/pets/PetCard";
import { QRCodeModal } from "@/components/pets/QRCodeModal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [qrPet, setQrPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
    if (!user) return;

    setLoadingPets(true);
    setFetchError("");
    let cancelled = false;

    const loadPets = async () => {
      try {
        const timeoutPromise = new Promise<Pet[]>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 8000)
        );
        const data = await Promise.race([getPetsByUserId(user.id), timeoutPromise]);
        if (!cancelled) setPets(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const code =
            err && typeof err === "object" && "code" in err
              ? String((err as { code?: string }).code ?? "")
              : "";
          const messageByCode: Record<string, string> = {
            "permission-denied":
              "Firestore bloqueou a leitura (permission-denied). Ajuste as regras no Firebase Console.",
            unavailable:
              "Firestore indisponivel no momento. Tente novamente em alguns segundos.",
            timeout:
              "A leitura demorou demais (timeout). Verifique Firestore e conexao.",
          };
          setFetchError(
            messageByCode[code] ??
              (code ? `Erro ao carregar pets: ${code}` : "Nao foi possivel carregar seus pets agora.")
          );
          setPets([]);
        }
      } finally {
        if (!cancelled) setLoadingPets(false);
      }
    };

    void loadPets();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  const openQR = useCallback((pet: Pet) => setQrPet(pet), []);
  const closeQR = useCallback(() => setQrPet(null), []);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "";

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-primary-600 dark:text-primary-400">Carregando...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
          Meus Pets
        </h1>
        <Link href="/dashboard/pet/new">
          <Button variant="primary">+ Adicionar pet</Button>
        </Link>
      </div>
      {fetchError && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          {fetchError}
        </p>
      )}
      {loadingPets && (
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Carregando pets...
        </p>
      )}
      {pets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary-300 bg-primary-50/50 p-12 text-center dark:border-primary-700 dark:bg-primary-900/30">
          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 w-36 opacity-80">
            <ellipse cx="80" cy="95" rx="50" ry="10" fill="#f2c77a" opacity="0.3"/>
            <ellipse cx="80" cy="72" rx="32" ry="26" fill="#e8a73a"/>
            <ellipse cx="80" cy="48" rx="22" ry="20" fill="#e8a73a"/>
            <ellipse cx="70" cy="36" rx="9" ry="13" fill="#d98b1a" transform="rotate(-15 70 36)"/>
            <ellipse cx="90" cy="36" rx="9" ry="13" fill="#d98b1a" transform="rotate(15 90 36)"/>
            <circle cx="74" cy="50" r="3.5" fill="#361c09"/>
            <circle cx="86" cy="50" r="3.5" fill="#361c09"/>
            <ellipse cx="80" cy="57" rx="5" ry="3" fill="#b86f14"/>
            <circle cx="74" cy="49" r="1.5" fill="white"/>
            <circle cx="86" cy="49" r="1.5" fill="white"/>
            <rect x="55" y="85" width="50" height="18" rx="9" fill="#f2c77a" opacity="0.6"/>
            <circle cx="112" cy="30" r="12" fill="#fdf0d9" stroke="#f2c77a" strokeWidth="1.5"/>
            <text x="112" y="35" textAnchor="middle" fontSize="13" fill="#d98b1a">?</text>
          </svg>
          <p className="text-lg font-semibold text-primary-800 dark:text-primary-200">
            Nenhum pet cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
            Cadastre seu pet e gere o QR Code para a coleira
          </p>
          <Link href="/dashboard/pet/new" className="mt-5 inline-block">
            <Button variant="primary">Cadastrar primeiro pet</Button>
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <li key={pet.id}>
              <PetCard pet={pet} onGenerateQR={openQR} />
            </li>
          ))}
        </ul>
      )}
      <QRCodeModal pet={qrPet} onClose={closeQR} baseUrl={baseUrl} />
    </AppLayout>
  );
}
