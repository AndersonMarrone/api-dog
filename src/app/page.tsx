"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <AppLayout>
      {/* Hero */}
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-accent-100 px-4 py-1 text-sm font-semibold text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">
              QR Code na coleira
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
              Seu pet{" "}
              <span className="text-accent-600">nunca mais</span>{" "}
              se perde
            </h1>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-400 lg:text-xl">
              Cadastre o perfil do seu pet, gere um QR Code único e coloque na coleira.
              Quem encontrar escaneia e fala com você em segundos.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/register">
                <Button variant="primary" className="min-w-[200px] py-3 text-base">
                  Cadastrar meu pet grátis
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="min-w-[160px] py-3 text-base">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Ilustração SVG */}
          <div className="w-72 shrink-0 lg:w-96">
            <svg viewBox="0 0 360 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
              {/* Card */}
              <rect x="20" y="20" width="320" height="420" rx="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5"/>

              {/* Foto do pet */}
              <rect x="40" y="40" width="280" height="160" rx="16" fill="#fdf0d9"/>
              {/* Pet */}
              <ellipse cx="180" cy="175" rx="60" ry="46" fill="#e8a73a"/>
              <ellipse cx="180" cy="128" rx="38" ry="36" fill="#e8a73a"/>
              <ellipse cx="162" cy="110" rx="15" ry="22" fill="#d98b1a" transform="rotate(-12 162 110)"/>
              <ellipse cx="198" cy="110" rx="15" ry="22" fill="#d98b1a" transform="rotate(12 198 110)"/>
              <circle cx="170" cy="132" r="6" fill="#361c09"/>
              <circle cx="190" cy="132" r="6" fill="#361c09"/>
              <circle cx="170" cy="130" r="2.5" fill="white"/>
              <circle cx="190" cy="130" r="2.5" fill="white"/>
              <ellipse cx="180" cy="144" rx="9" ry="6" fill="#b86f14"/>

              {/* Nome */}
              <text x="40" y="235" fill="#1e293b" fontSize="20" fontWeight="700" fontFamily="system-ui">Thor</text>
              <text x="40" y="258" fill="#64748b" fontSize="13" fontFamily="system-ui">Golden Retriever • 3 anos</text>

              {/* Divider */}
              <line x1="40" y1="275" x2="320" y2="275" stroke="#e2e8f0" strokeWidth="1"/>

              {/* QR Code — centralizado */}
              <rect x="120" y="290" width="120" height="120" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
              {/* QR pattern */}
              <rect x="130" y="300" width="30" height="30" rx="4" fill="#1e293b"/>
              <rect x="134" y="304" width="22" height="22" rx="2" fill="#f8fafc"/>
              <rect x="138" y="308" width="14" height="14" rx="1" fill="#1e293b"/>
              <rect x="200" y="300" width="30" height="30" rx="4" fill="#1e293b"/>
              <rect x="204" y="304" width="22" height="22" rx="2" fill="#f8fafc"/>
              <rect x="208" y="308" width="14" height="14" rx="1" fill="#1e293b"/>
              <rect x="130" y="370" width="30" height="30" rx="4" fill="#1e293b"/>
              <rect x="134" y="374" width="22" height="22" rx="2" fill="#f8fafc"/>
              <rect x="138" y="378" width="14" height="14" rx="1" fill="#1e293b"/>
              <rect x="168" y="300" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="180" y="300" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="168" y="312" width="8" height="8" rx="1" fill="#1e293b"/>
              <rect x="180" y="316" width="8" height="16" rx="1" fill="#1e293b"/>
              <rect x="200" y="340" width="12" height="8" rx="1" fill="#1e293b"/>
              <rect x="216" y="340" width="8" height="20" rx="1" fill="#1e293b"/>
              <rect x="168" y="328" width="20" height="8" rx="1" fill="#1e293b"/>
              <rect x="168" y="340" width="8" height="20" rx="1" fill="#1e293b"/>

              {/* Label QR */}
              <text x="180" y="424" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">Escaneie para ver o perfil</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto mt-20 max-w-4xl sm:mt-28">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Como funciona
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-3xl dark:bg-accent-900/40">
              📋
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Cadastre o pet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Adicione foto, raça, idade e condições de saúde do seu pet.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-3xl dark:bg-accent-900/40">
              📱
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Coloque na coleira</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Gere o QR Code e imprima para colocar na coleira do seu pet.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-3xl dark:bg-accent-900/40">
              📍
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Fica protegido</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Quem encontrar escaneia e fala com você pelo WhatsApp + localização.
            </p>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="mx-auto mt-16 max-w-2xl rounded-3xl bg-accent-600 px-8 py-12 text-center text-white sm:mt-20">
        <p className="text-3xl font-bold">Pronto para proteger seu pet?</p>
        <p className="mt-3 text-accent-100">Cadastro gratuito. Sem aplicativo. Funciona em qualquer celular.</p>
        <Link href="/register" className="mt-6 inline-block">
          <Button className="bg-white !text-teal-700 hover:bg-teal-50 min-w-[200px] py-3 text-base font-bold shadow-lg">
            Começar agora — é grátis
          </Button>
        </Link>
      </section>
    </AppLayout>
  );
}
