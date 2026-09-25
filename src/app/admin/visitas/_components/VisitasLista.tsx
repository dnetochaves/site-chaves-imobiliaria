"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVisitasStaff } from "@/lib/api/hooks/use-visitas-staff";
import { describeApiError } from "@/lib/api/errors";
import {
  VISITA_STATUS_OPTIONS,
  fimDoDiaSalvador,
  inicioDoDiaSalvador,
  type VisitaStatus,
} from "@/lib/visita-labels";
import { VisitaLinha } from "@/app/admin/visitas/_components/VisitaLinha";

const VISITAS_POR_PAGINA = 20;
const TODOS = "todos";

export function VisitasLista() {
  const [status, setStatus] = useState<VisitaStatus | undefined>("agendada");
  const [imovelInput, setImovelInput] = useState("");
  const [imovelId, setImovelId] = useState<number | undefined>();
  const [imovelErro, setImovelErro] = useState(false);
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [page, setPage] = useState(1);

  const { status: queryStatus, data, error } = useVisitasStaff({
    status,
    imovel_id: imovelId,
    de: (de && inicioDoDiaSalvador(de)) || undefined,
    ate: (ate && fimDoDiaSalvador(ate)) || undefined,
    limit: VISITAS_POR_PAGINA,
    offset: (page - 1) * VISITAS_POR_PAGINA,
  });

  function aplicarImovel(event?: FormEvent) {
    event?.preventDefault();
    const texto = imovelInput.trim();
    if (!texto) {
      setImovelErro(false);
      setImovelId(undefined);
      setPage(1);
      return;
    }
    if (!/^\d+$/.test(texto) || Number(texto) < 1) {
      setImovelErro(true);
      return;
    }
    setImovelErro(false);
    setImovelId(Number(texto));
    setPage(1);
  }

  const totalPages = data ? Math.ceil(data.total / VISITAS_POR_PAGINA) : 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-text-primary text-lg font-semibold">Visitas</h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitas-status">Status</Label>
          <Select
            value={status ?? TODOS}
            onValueChange={(valor) => {
              setStatus(valor === TODOS ? undefined : (valor as VisitaStatus));
              setPage(1);
            }}
          >
            <SelectTrigger id="visitas-status" size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas</SelectItem>
              {VISITA_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={aplicarImovel} className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visitas-imovel">ID do imóvel</Label>
            <Input
              id="visitas-imovel"
              inputMode="numeric"
              value={imovelInput}
              onChange={(e) => setImovelInput(e.target.value)}
              onBlur={() => aplicarImovel()}
              className="w-28"
            />
          </div>
        </form>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitas-de">De (Salvador)</Label>
          <Input
            id="visitas-de"
            type="date"
            value={de}
            onChange={(e) => {
              setDe(e.target.value);
              setPage(1);
            }}
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitas-ate">Até (Salvador)</Label>
          <Input
            id="visitas-ate"
            type="date"
            value={ate}
            onChange={(e) => {
              setAte(e.target.value);
              setPage(1);
            }}
            className="w-40"
          />
        </div>

        {queryStatus === "success" && (
          <p className="text-text-secondary ml-auto text-sm">
            {data.total} visita{data.total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {imovelErro && (
        <p className="text-feedback-error text-sm">
          Informe um ID de imóvel válido (número inteiro maior que zero).
        </p>
      )}

      {queryStatus === "pending" && (
        <div role="status" className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-muted h-24 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {queryStatus === "error" && (
        <p className="text-feedback-error text-sm">
          {describeApiError(
            error,
            "Não foi possível carregar as visitas agora. Tente novamente em instantes.",
          )}
        </p>
      )}

      {queryStatus === "success" && data.items.length === 0 && (
        <p className="text-text-secondary text-sm">
          Nenhuma visita encontrada com esses filtros.
        </p>
      )}

      {queryStatus === "success" && data.items.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {data.items.map((visita) => (
              <VisitaLinha key={visita.id} visita={visita} />
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              aria-label="Paginação"
              className="flex flex-wrap items-center gap-1.5"
            >
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
    </section>
  );
}
