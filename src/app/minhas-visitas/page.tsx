"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMinhasVisitas } from "@/lib/api/hooks/use-minhas-visitas";
import { describeApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { VisitaItem } from "@/app/minhas-visitas/_components/VisitaItem";

const VISITAS_POR_PAGINA = 20;

const ABAS = [
  { id: "proximas", label: "Próximas", status: "agendada" as const },
  { id: "todas", label: "Todas", status: undefined },
];

export default function MinhasVisitasPage() {
  const { status: authStatus, login } = useAuth();
  const [aba, setAba] = useState<"proximas" | "todas">("proximas");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (authStatus === "unauthenticated") login();
  }, [authStatus, login]);

  const abaAtual = ABAS.find((item) => item.id === aba) ?? ABAS[0];
  const { status, data, error } = useMinhasVisitas(
    {
      status: abaAtual.status,
      limit: VISITAS_POR_PAGINA,
      offset: (page - 1) * VISITAS_POR_PAGINA,
    },
    { enabled: authStatus === "authenticated" },
  );

  if (authStatus !== "authenticated") {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-secondary text-sm">Carregando…</p>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / VISITAS_POR_PAGINA) : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-semibold">
          Minhas visitas
        </h1>
        <p className="text-text-secondary text-sm">
          Horários de Salvador. Você pode cancelar uma visita agendada.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Filtro de visitas"
        className="border-border-default flex gap-4 border-b"
      >
        {ABAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={aba === item.id}
            onClick={() => {
              setAba(item.id as "proximas" | "todas");
              setPage(1);
            }}
            className={cn(
              "-mb-px flex min-h-11 items-center border-b-2 px-1 text-sm font-medium transition-colors md:min-h-0 md:pb-2",
              aba === item.id
                ? "border-brand-primary text-text-primary"
                : "text-text-secondary hover:text-text-primary border-transparent",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {status === "pending" && (
        <div role="status" className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-muted h-28 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-feedback-error text-sm">
          {describeApiError(
            error,
            "Não foi possível carregar suas visitas agora. Tente novamente em instantes.",
          )}
        </p>
      )}

      {status === "success" && data.items.length === 0 && (
        <p className="text-text-secondary text-sm">
          {aba === "proximas"
            ? "Você não tem visitas agendadas."
            : "Você ainda não tem visitas."}
        </p>
      )}

      {status === "success" && data.items.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {data.items.map((visita) => (
              <VisitaItem key={visita.id} visita={visita} />
            ))}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Paginação" className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  type="button"
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
