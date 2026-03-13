"use client";

import { useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Pet } from "@/types/pet";
import { Button } from "@/components/ui/Button";

interface QRCodeModalProps {
  pet: Pet | null;
  onClose: () => void;
  baseUrl: string;
}

export function QRCodeModal({ pet, onClose, baseUrl }: QRCodeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) onClose();
    },
    [onClose]
  );

  if (!pet) return null;

  const petUrl = `${baseUrl}/pet/${pet.id}`;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="QR Code do pet"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-primary-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-center font-semibold text-primary-900 dark:text-primary-100">
          QR Code – {pet.name}
        </h3>
        <p className="mb-4 text-center text-sm text-primary-600 dark:text-primary-400">
          Imprima e cole na coleira. Quem escanear verá os dados de contato.
        </p>
        <div className="flex justify-center rounded-xl bg-white p-4 dark:bg-primary-950">
          <QRCodeSVG value={petUrl} size={220} level="M" includeMargin />
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="primary" type="button" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
