"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { describeApiError } from "@/lib/api/errors";

const LIMITE_LISTA = 50;

export default function AdminPage() {
  const router = useRouter();
  const [idInput, setIdInput] = useState("");
  const [idError, setIdError] = useState(false);
  const { status, data, error } = useImoveis({ limit: LIMITE_LISTA });

  function handleOpenById(event: FormEvent) {
    event.preventDefault();
    const trimmed = idInput.trim();
    if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) {
      setIdError(true);
      return;
    }
    setIdError(false);
    router.push(`/admin/imoveis/${Number(trimmed)}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-semibold">
          Abrir imóvel por ID
        </h2>
        <p className="text-text-secondary text-sm">
          Use o ID para moderar imóveis em qualquer status, inclusive os ainda
          não publicados.
        </p>
        <form onSubmit={handleOpenById} className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imovel-id">ID do imóvel</Label>
            <Input
              id="imovel-id"
              inputMode="numeric"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              className="w-40"
            />
          </div>
          <Button type="submit">Abrir</Button>
        </form>
        {idError && (
          <p className="text-feedback-error text-sm">
            Informe um ID válido (número inteiro maior que zero).
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-semibold">
          Imóveis publicados
        </h2>

        {status === "pending" && (
          <div role="status" className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-background-muted h-16 animate-pulse rounded-lg"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="text-feedback-error text-sm">
            {describeApiError(
              error,
              "Não foi possível carregar os imóveis agora. Tente novamente em instantes.",
            )}
          </p>
        )}

        {status === "success" && data.items.length === 0 && (
          <p className="text-text-secondary text-sm">
            Não há imóveis publicados no momento.
          </p>
        )}

        {status === "success" && data.items.length > 0 && (
          <ul className="flex flex-col gap-2">
            {data.items.map((imovel) => (
              <li key={imovel.id}>
                <Link
                  href={`/admin/imoveis/${imovel.id}`}
                  className="border-border-default bg-background-default hover:bg-background-muted flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-text-primary text-sm font-semibold">
                      #{imovel.id} · {imovel.titulo}
                    </span>
                    <span className="text-text-secondary text-xs">
                      {imovel.unidade.bairro} · {imovel.unidade.cidade}
                    </span>
                  </div>
                  <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
                    {imovel.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
