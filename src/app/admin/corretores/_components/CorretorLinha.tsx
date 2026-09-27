"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { components } from "@/lib/api/generated/schema";
import {
  useDesativarCorretor,
  useReativarCorretor,
} from "@/lib/api/hooks/use-corretor-ativo";
import { describeCorretorAtivoError } from "@/lib/corretor-errors";
import {
  formatCorretorAtivoLabel,
  formatCorretorCreci,
} from "@/lib/corretor-labels";
import { CorretorFormulario } from "@/app/admin/corretores/_components/CorretorFormulario";

type Corretor = components["schemas"]["CorretorRead"];

export function CorretorLinha({ corretor }: { corretor: Corretor }) {
  const [editando, setEditando] = useState(false);
  const desativar = useDesativarCorretor();
  const reativar = useReativarCorretor();
  const alterarAtivo = corretor.ativo ? desativar : reativar;
  const creci = formatCorretorCreci(corretor.creci_numero, corretor.creci_uf);

  return (
    <li className="border-border-default bg-background-default flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-text-primary text-sm font-semibold">
            #{corretor.id} · {corretor.nome}
          </span>
          <span className="text-text-secondary text-sm">
            {corretor.telefone}
            {corretor.email && ` · ${corretor.email}`}
          </span>
        </div>
        <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
          {formatCorretorAtivoLabel(corretor.ativo)}
        </span>
      </div>

      {creci && <p className="text-text-secondary text-sm">{creci}</p>}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 md:h-8"
          onClick={() => setEditando(true)}
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 md:h-8"
          loading={alterarAtivo.isPending}
          onClick={() => alterarAtivo.mutate(corretor.id)}
        >
          {corretor.ativo ? "Desativar" : "Reativar"}
        </Button>
      </div>

      {alterarAtivo.isError && (
        <p className="text-feedback-error text-sm">
          {describeCorretorAtivoError(alterarAtivo.error)}
        </p>
      )}

      <CorretorFormulario
        open={editando}
        onOpenChange={setEditando}
        corretor={corretor}
      />
    </li>
  );
}
