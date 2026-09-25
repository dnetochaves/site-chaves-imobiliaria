"use client";

import { useState } from "react";
import Link from "next/link";
import type { components } from "@/lib/api/generated/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAtualizarVisita,
  type AcaoVisita,
} from "@/lib/api/hooks/use-atualizar-visita";
import {
  describeCancelarError,
  describeConcluirError,
} from "@/lib/visita-errors";
import {
  VISITA_STATUS_OPTIONS,
  formatDataHoraSalvador,
} from "@/lib/visita-labels";

type VisitaStaff = components["schemas"]["VisitaStaffRead"];

const TEXTOS: Record<
  AcaoVisita,
  { titulo: string; confirmar: string; botao: string }
> = {
  concluir: {
    titulo: "Concluir esta visita?",
    confirmar: "Concluir visita",
    botao: "Concluir",
  },
  cancelar: {
    titulo: "Cancelar esta visita?",
    confirmar: "Cancelar visita",
    botao: "Cancelar",
  },
};

export function VisitaLinha({ visita }: { visita: VisitaStaff }) {
  const [acao, setAcao] = useState<AcaoVisita | null>(null);
  const atualizar = useAtualizarVisita();

  const { unidade, imovel, visitante } = visita;
  const endereco = `${unidade.rua}, ${unidade.numero}${unidade.complemento ? ` - ${unidade.complemento}` : ""} · ${unidade.bairro} · ${unidade.cidade}/${unidade.estado}`;
  const statusLabel =
    VISITA_STATUS_OPTIONS.find((option) => option.value === visita.status)
      ?.label ?? visita.status;
  const dataHora = formatDataHoraSalvador(visita.data_hora);

  function abrir(nova: AcaoVisita) {
    atualizar.reset();
    setAcao(nova);
  }

  function confirmar() {
    if (!acao) return;
    atualizar.mutate(
      { acao, visitaId: visita.id },
      { onSuccess: () => setAcao(null) },
    );
  }

  const mensagemErro = atualizar.isError
    ? acao === "concluir"
      ? describeConcluirError(atualizar.error)
      : describeCancelarError(atualizar.error)
    : null;

  return (
    <li className="border-border-default bg-background-default flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-text-primary text-base font-semibold">{dataHora}</p>
        <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
          {statusLabel}
        </span>
      </div>

      {imovel ? (
        <Link
          href={`/admin/imoveis/${imovel.id}`}
          className="text-brand-primary w-fit text-sm font-medium hover:underline"
        >
          #{imovel.id} · {imovel.titulo}
        </Link>
      ) : (
        <p className="text-text-secondary text-sm">
          Sem anúncio publicado para este imóvel.
        </p>
      )}

      <p className="text-text-secondary text-sm">{endereco}</p>

      {visitante && (
        <div className="bg-background-muted flex flex-col gap-0.5 rounded-md p-3 text-sm">
          <p className="text-text-primary font-medium">
            {visitante.name ?? visitante.email}
          </p>
          {visitante.name && (
            <p className="text-text-secondary">{visitante.email}</p>
          )}
          {visita.visitante_telefone && (
            <p className="text-text-secondary">
              Telefone: {visita.visitante_telefone}
            </p>
          )}
          {visita.visitante_observacoes && (
            <p className="text-text-secondary">
              Observações do visitante: {visita.visitante_observacoes}
            </p>
          )}
        </div>
      )}

      {visita.observacoes && (
        <p className="text-text-secondary text-sm">
          Nota da equipe: {visita.observacoes}
        </p>
      )}

      {visita.status === "agendada" && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-11 md:h-8"
            onClick={() => abrir("concluir")}
          >
            {TEXTOS.concluir.botao}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 md:h-8"
            onClick={() => abrir("cancelar")}
          >
            {TEXTOS.cancelar.botao}
          </Button>
        </div>
      )}

      <Dialog
        open={acao !== null}
        onOpenChange={(aberto) => {
          if (!atualizar.isPending && !aberto) setAcao(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{acao ? TEXTOS[acao].titulo : ""}</DialogTitle>
            <DialogDescription>
              {dataHora} · {visitante?.name ?? visitante?.email ?? endereco}
            </DialogDescription>
          </DialogHeader>

          {mensagemErro && (
            <p className="text-feedback-error text-sm">{mensagemErro}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-8"
              disabled={atualizar.isPending}
              onClick={() => setAcao(null)}
            >
              Manter
            </Button>
            <Button
              type="button"
              className="h-11 md:h-8"
              loading={atualizar.isPending}
              onClick={confirmar}
            >
              {acao ? TEXTOS[acao].confirmar : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
