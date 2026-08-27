"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { exchangeCode } from "@/lib/auth/api";

export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeLogin, login } = useAuth();
  const code = searchParams.get("code");
  const [error, setError] = useState<string | null>(
    code ? null : "Nenhum código de autenticação foi recebido.",
  );
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!code || ranOnce.current) return;
    ranOnce.current = true;

    async function completeExchange(code: string) {
      try {
        const tokenPair = await exchangeCode(code);
        await completeLogin({
          accessToken: tokenPair.access_token,
          refreshToken: tokenPair.refresh_token,
        });
        router.replace("/");
      } catch {
        setError("Não foi possível concluir o login. O código pode ter expirado.");
      }
    }

    completeExchange(code);
  }, [code, completeLogin, router]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <p className="text-text-primary text-lg font-medium">{error}</p>
        <Button onClick={login}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-text-secondary text-sm">Concluindo login…</p>
    </div>
  );
}
