"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Pet } from "@/types/pet";
import { saveLocationAlert } from "@/lib/pets";

interface PetPublicViewProps {
  pet: Pet;
}

function formatWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function PetPublicView({ pet }: PetPublicViewProps) {
  const [locationSent, setLocationSent] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sendLocation = useCallback(async () => {
    if (!navigator.geolocation || locationSent || sending) return;
    setLocationError(null);
    setSending(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await saveLocationAlert({
            petId: pet.id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationSent(true);
        } catch (err) {
          setLocationError("Falha ao enviar localização.");
        } finally {
          setSending(false);
        }
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Permissão de localização negada."
            : "Não foi possível obter a localização."
        );
        setSending(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [pet.id, locationSent, sending]);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation || locationSent) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        saveLocationAlert({
          petId: pet.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then(() => setLocationSent(true))
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
    return () => {
      cancelled = true;
    };
  }, [pet.id, locationSent]);

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <div className="mx-auto max-w-md px-4 py-6 pb-10">
        {/* Banner de urgência */}
        <div className="mb-4 rounded-2xl bg-orange-500 px-5 py-4 text-center shadow-lg">
          <p className="text-lg font-bold text-white">🐾 Encontrei este pet!</p>
          <p className="mt-0.5 text-sm text-orange-100">Use os botões abaixo para avisar o dono</p>
        </div>

        <div className="rounded-3xl border border-primary-200/60 bg-white shadow-xl dark:border-primary-800 dark:bg-primary-900/50">
          <div className="relative h-56 w-full overflow-hidden rounded-t-3xl bg-primary-100 dark:bg-primary-900">
            {pet.photoUrl ? (
              <Image
                src={pet.photoUrl}
                alt={pet.name}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">
                🐕
              </div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {pet.name}
            </h1>
            {(pet.breed || pet.age) && (
              <p className="mt-1 text-primary-600 dark:text-primary-400">
                {[pet.breed, pet.age].filter(Boolean).join(" • ")}
              </p>
            )}
            {pet.healthConditions && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Condições de saúde
                </h2>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300 whitespace-pre-wrap">
                  {pet.healthConditions}
                </p>
              </div>
            )}
            <div className="mt-6 rounded-xl bg-primary-100 p-4 dark:bg-primary-800/50">
              <h2 className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                Contato do tutor
              </h2>
              <p className="mt-1 font-medium text-primary-900 dark:text-primary-100">
                {pet.ownerName}
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                {pet.ownerPhone}
              </p>
            </div>
            <a
              href={formatWhatsApp(pet.ownerPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-green-700 active:bg-green-800"
            >
              <span aria-hidden>💬</span>
              Entrar em contato com o dono (WhatsApp)
            </a>
            <div className="mt-4">
              {!locationSent ? (
                <button
                  type="button"
                  onClick={sendLocation}
                  disabled={sending}
                  className="w-full rounded-xl border-2 border-primary-400 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50 dark:border-primary-600 dark:bg-primary-800/50 dark:text-primary-200 dark:hover:bg-primary-800"
                >
                  {sending ? "Enviando..." : "Enviar minha localização ao dono"}
                </button>
              ) : (
                <p className="text-center text-sm text-green-700 dark:text-green-400">
                  ✓ Localização enviada ao tutor.
                </p>
              )}
              {locationError && (
                <p className="mt-2 text-center text-sm text-amber-600 dark:text-amber-400">
                  {locationError}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-primary-500 dark:text-primary-400">
          Pet encontrado? Use o botão acima para avisar o tutor.
        </p>
      </div>
    </div>
  );
}
