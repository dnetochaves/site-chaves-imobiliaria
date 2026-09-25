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
import { useCancelarVisita } from "@/lib/api/hooks/use-cancelar-visita";
import { describeCancelarError } from "@/lib/visita-errors";
import {
  VISITA_STATUS_OPTIONS,
  formatDataHoraSalvador,
} from "@/lib/visita-labels";

type MinhaVisita = components["schemas"]["MinhaVisitaRead"];

export function VisitaItem({ visita }: { visita: MinhaVisita }) {
  const [confirmando, setConfirmando] = useState(false);
  const cancelar = useCancelarVisita();

  const { unidade, imovel } = visita;
  const enderecoLinha = `${unidade.rua}, ${unidade.numero}${unidade.complemento ? ` - ${unidade.complemento}` : ""}`;
  const statusLabel =
    VISITA_STATUS_OPTIONS.find((option) => option.value === visita.status)
      ?.label ?? visita.status;

  function handleConfirmar() {
    cancelar.mutate(visita.id, {
      onSuccess: () => setConfirmando(false),
    });
  }

  return (
    <li className="border-border-default bg-background-default flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-text-primary text-base font-semibold">
          {formatDataHoraSalvador(visita.data_hora)}
        </p>
        <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
          {statusLabel}
        </span>
      </div>

      {imovel ? (
        <Link
          href={`/imoveis/${imovel.id}`}
          className="text-brand-primary w-fit text-sm font-medium hover:underline"
        >
          {imovel.titulo}
        </Link>
      ) : (
        <p className="text-text-secondary text-sm">
          O anúncio deste imóvel não está mais disponível.
        </p>
      )}

      <p className="text-text-secondary text-sm">
        {enderecoLinha} · {unidade.bairro} · {unidade.cidade}/{unidade.estado}
      </p>

      {visita.status === "agendada" && (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-fit md:h-8"
          onClick={() => {
            cancelar.reset();
            setConfirmando(true);
          }}
        >
          Cancelar visita
        </Button>
      )}

      <Dialog
        open={confirmando}
        onOpenChange={(open) => {
          if (!cancelar.isPending) setConfirmando(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar esta visita?</DialogTitle>
            <DialogDescription>
              {formatDataHoraSalvador(visita.data_hora)} · {enderecoLinha}. O
              horário poderá ser reservado por outra pessoa.
            </DialogDescription>
          </DialogHeader>

          {cancelar.isError && (
            <p className="text-feedback-error text-sm">
              {describeCancelarError(cancelar.error)}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-8"
              disabled={cancelar.isPending}
              onClick={() => setConfirmando(false)}
            >
              Manter visita
            </Button>
            <Button
              type="button"
              className="h-11 md:h-8"
              loading={cancelar.isPending}
              onClick={handleConfirmar}
            >
              Cancelar visita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
