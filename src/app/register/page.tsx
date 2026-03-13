"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const fb = err as { code?: string; message?: string };
      const code = typeof fb?.code === "string" ? fb.code : "";
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "Este e-mail já está em uso. Tente entrar ou use outro e-mail.",
        "auth/invalid-email": "E-mail inválido. Verifique o formato.",
        "auth/weak-password": "A senha é fraca. Use pelo menos 6 caracteres.",
        "auth/operation-not-allowed": "Cadastro por e-mail está desativado. Ative em Firebase Console → Authentication → Sign-in method → E-mail/Senha.",
        "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
        "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
        "auth/configuration-not-found": "Projeto Firebase não encontrado. Confira o .env.local.",
      };
      const fallback = code ? `Erro: ${code}` : (fb?.message || "Não foi possível criar a conta. Tente novamente.");
      setError(messages[code] ?? fallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="mb-6 text-2xl font-bold text-primary-900 dark:text-primary-100">
            Criar conta
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              required
              autoComplete="new-password"
            />
            {error && (
              <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>
            )}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-primary-600 dark:text-primary-400">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-300">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
