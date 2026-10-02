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
import {
  useAdminImoveis,
  type AdminImoveisParams,
} from "@/lib/api/hooks/use-admin-imoveis";
import { useCorretores } from "@/lib/api/hooks/use-corretores";
import { describeApiError } from "@/lib/api/errors";
import {
  IMOVEL_STATUS_OPTIONS,
  type ImovelStatus,
} from "@/lib/imovel-labels";
import { ImovelAdminLinha } from "@/app/admin/_components/ImovelAdminLinha";

const IMOVEIS_POR_PAGINA = 20;
const TODOS = "todos";
const SEM_CORRETOR = "sem-corretor";

type Ordenacao = NonNullable<AdminImoveisParams["ordenar"]>;

export function ImoveisAdminLista() {
  const [status, setStatus] = useState<ImovelStatus | undefined>();
  const [corretor, setCorretor] = useState<string>(TODOS);
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState<Ordenacao>("criacao_desc");
  const [page, setPage] = useState(1);

  const { data: corretores } = useCorretores();

  const { status: queryStatus, data, error } = useAdminImoveis({
    status: status ? [status] : undefined,
    // `corretor_id` e `sem_corretor` nunca vão juntos (a API responde 422).
    corretor_id:
      corretor !== TODOS && corretor !== SEM_CORRETOR
        ? Number(corretor)
        : undefined,
    sem_corretor: corretor === SEM_CORRETOR ? true : undefined,
    q: busca || undefined,
    ordenar,
    limit: IMOVEIS_POR_PAGINA,
    offset: (page - 1) * IMOVEIS_POR_PAGINA,
  });

  function aplicarBusca(event?: FormEvent) {
    event?.preventDefault();
    setBusca(buscaInput.trim());
    setPage(1);
  }

  const totalPages = data ? Math.ceil(data.total / IMOVEIS_POR_PAGINA) : 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-text-primary text-lg font-semibold">Imóveis</h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="imoveis-status">Status</Label>
          <Select
            value={status ?? TODOS}
            onValueChange={(valor) => {
              setStatus(valor === TODOS ? undefined : (valor as ImovelStatus));
              setPage(1);
            }}
          >
            <SelectTrigger id="imoveis-status" size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {IMOVEL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="imoveis-corretor">Corretor</Label>
          <Select
            value={corretor}
            onValueChange={(valor) => {
              setCorretor(valor);
              setPage(1);
            }}
          >
            <SelectTrigger id="imoveis-corretor" size="sm" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              <SelectItem value={SEM_CORRETOR}>Sem corretor</SelectItem>
              {corretores?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nome}
                  {c.ativo ? "" : " (inativo)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={aplicarBusca} className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imoveis-busca">Buscar</Label>
            <Input
              id="imoveis-busca"
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
              onBlur={() => aplicarBusca()}
              className="w-48"
            />
          </div>
        </form>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="imoveis-ordenar">Ordenar</Label>
          <Select
            value={ordenar}
            onValueChange={(valor) => {
              setOrdenar(valor as Ordenacao);
              setPage(1);
            }}
          >
            <SelectTrigger id="imoveis-ordenar" size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="criacao_desc">Mais novos</SelectItem>
              <SelectItem value="criacao_asc">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {queryStatus === "success" && (
          <p className="text-text-secondary ml-auto text-sm">
            {data.total} imóve{data.total === 1 ? "l" : "is"}
          </p>
        )}
      </div>

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
            "Não foi possível carregar os imóveis agora. Tente novamente em instantes.",
          )}
        </p>
      )}

      {queryStatus === "success" && data.items.length === 0 && (
        <p className="text-text-secondary text-sm">
          Nenhum imóvel encontrado com esses filtros.
        </p>
      )}

      {queryStatus === "success" && data.items.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {data.items.map((imovel) => (
              <ImovelAdminLinha key={imovel.id} imovel={imovel} />
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
