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
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível entrar com o Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-primary-200 dark:bg-primary-700" />
            <span className="text-xs text-primary-500">ou</span>
            <div className="h-px flex-1 bg-primary-200 dark:bg-primary-700" />
          </div>
          <Button variant="outline" fullWidth disabled={loading} onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Cadastrar com Google
          </Button>
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
