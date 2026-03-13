import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <AppLayout>
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-6 text-5xl sm:text-6xl">🐾</div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-100 sm:text-5xl">
          Identificação Digital para Pets
        </h1>
        <p className="mb-8 text-lg text-primary-600 dark:text-primary-400">
          Cadastre seu pet, gere um QR Code único para a coleira e, se alguém encontrar
          seu amigo, basta escanear para ver contato e dados de saúde.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button variant="primary" fullWidth className="min-w-[180px]">
              Criar conta
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" fullWidth className="min-w-[180px]">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>
      <section className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3 sm:mt-24">
        <div className="rounded-2xl border border-primary-200/60 bg-white p-6 text-center dark:border-primary-800 dark:bg-primary-950/50">
          <span className="text-3xl" aria-hidden>📋</span>
          <h2 className="mt-3 font-semibold text-primary-900 dark:text-primary-100">
            Perfil do pet
          </h2>
          <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
            Nome, raça, idade, foto e condições de saúde em um só lugar.
          </p>
        </div>
        <div className="rounded-2xl border border-primary-200/60 bg-white p-6 text-center dark:border-primary-800 dark:bg-primary-950/50">
          <span className="text-3xl" aria-hidden>📱</span>
          <h2 className="mt-3 font-semibold text-primary-900 dark:text-primary-100">
            QR na coleira
          </h2>
          <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
            Imprima o QR Code e coloque na coleira. Qualquer um pode escanear.
          </p>
        </div>
        <div className="rounded-2xl border border-primary-200/60 bg-white p-6 text-center dark:border-primary-800 dark:bg-primary-950/50">
          <span className="text-3xl" aria-hidden>📍</span>
          <h2 className="mt-3 font-semibold text-primary-900 dark:text-primary-100">
            Contato rápido
          </h2>
          <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
            Quem encontrar vê seus dados e pode avisar por WhatsApp e localização.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
