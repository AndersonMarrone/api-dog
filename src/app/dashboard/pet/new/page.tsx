"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createPet, uploadPetPhoto, updatePet } from "@/lib/pets";
import type { PetFormData } from "@/types/pet";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const initial: PetFormData = {
  name: "",
  breed: "",
  age: "",
  healthConditions: "",
  ownerName: "",
  ownerPhone: "",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export default function NewPetPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<PetFormData>(initial);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof PetFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    if (!form.name.trim()) {
      setError("Nome do pet é obrigatório.");
      return;
    }
    setSubmitting(true);
    try {
      const id = await withTimeout(createPet(user.id, form), 8000);

      // Upload da foto em segundo plano para nao bloquear o salvamento principal.
      if (photoFile) {
        void (async () => {
          try {
            const photoUrl = await uploadPetPhoto(photoFile);
            await updatePet(id, { photoUrl });
          } catch (uploadErr) {
            console.error("Falha ao enviar foto do pet:", uploadErr);
          }
        })();
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code ?? "")
          : "";
      if (code === "permission-denied") {
        setError("Sem permissao no Firestore para salvar pet. Verifique as regras.");
      } else if (code === "unavailable") {
        setError("Firestore indisponivel no momento. Tente novamente.");
      } else if (err instanceof Error && err.message === "timeout") {
        setError("Salvamento demorou demais (timeout). Verifique conexao e Firestore.");
      } else {
        setError("Não foi possível salvar. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-primary-600 dark:text-primary-400">Carregando...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-4 inline-block text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          ← Voltar ao dashboard
        </Link>
        <Card>
          <h1 className="mb-6 text-2xl font-bold text-primary-900 dark:text-primary-100">
            Cadastrar pet
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome do pet"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex: Thor"
              required
            />
            <Input
              label="Raça"
              value={form.breed}
              onChange={(e) => update("breed", e.target.value)}
              placeholder="Ex: Golden Retriever"
            />
            <Input
              label="Idade"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="Ex: 2 anos"
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-800 dark:text-primary-200">
                Foto
              </label>
              {photoPreview && (
                <div className="mb-3 flex justify-center">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-xl object-cover border-2 border-primary-200 dark:border-primary-700"
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="block w-full text-sm text-primary-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-medium file:text-primary-700 dark:file:bg-primary-800 dark:file:text-primary-200"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setPhotoFile(file);
                  setPhotoPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>
            <Textarea
              label="Condições de saúde (alergias, medicamentos)"
              value={form.healthConditions}
              onChange={(e) => update("healthConditions", e.target.value)}
              placeholder="Ex: Alérgico a frango. Uso de anticoncepcional injetável."
              rows={3}
            />
            <Input
              label="Nome do dono"
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
              placeholder="Seu nome"
              required
            />
            <Input
              label="Telefone (WhatsApp)"
              value={form.ownerPhone}
              onChange={(e) => update("ownerPhone", e.target.value)}
              placeholder="Ex: 5511999999999"
              type="tel"
              required
            />
            {error && (
              <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>
            )}
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" fullWidth>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" fullWidth disabled={submitting} className="flex-1">
                {submitting ? "Salvando..." : "Cadastrar pet"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
