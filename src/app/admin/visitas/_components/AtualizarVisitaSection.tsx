"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAtualizarVisita,
  type AcaoVisita,
} from "@/lib/api/hooks/use-atualizar-visita";
import { ApiError, describeApiError } from "@/lib/api/errors";
import {
  VISITA_STATUS_OPTIONS,
  formatVisitaDataHora,
} from "@/lib/visita-labels";

export function AtualizarVisitaSection() {
  const [idInput, setIdInput] = useState("");
  const [idError, setIdError] = useState(false);
  const atualizar = useAtualizarVisita();

  function executar(acao: AcaoVisita) {
    const trimmed = idInput.trim();
    if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) {
      setIdError(true);
      return;
    }
    setIdError(false);
    atualizar.mutate({ acao, visitaId: Number(trimmed) });
  }

  const erro = atualizar.error;
  const acaoComErro = atualizar.variables?.acao;
  const mensagemErro =
    erro instanceof ApiError && erro.status === 404
      ? "Visita não encontrada."
      : describeApiError(
          erro,
          `Não foi possível ${acaoComErro === "concluir" ? "concluir" : "cancelar"} a visita. A ação pode não ser permitida para o estado atual dela.`,
        );

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-text-primary text-lg font-semibold">
        Cancelar ou concluir visita
      </h2>
      <p className="text-text-secondary text-sm">
        Informe o ID da visita (mostrado na confirmação da criação do
        horário). O painel não consulta a visita antes de agir: o resultado é
        exibido depois da ação.
      </p>

      <form
        onSubmit={(e: FormEvent) => e.preventDefault()}
        className="flex flex-wrap items-end gap-2"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visita-id">ID da visita</Label>
          <Input
            id="visita-id"
            inputMode="numeric"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            className="w-40"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={atualizar.isPending}
          onClick={() => executar("cancelar")}
        >
          Cancelar visita
        </Button>
        <Button
          type="button"
          disabled={atualizar.isPending}
          onClick={() => executar("concluir")}
        >
          Concluir visita
        </Button>
      </form>

      {idError && (
        <p className="text-feedback-error text-sm">
          Informe um ID válido (número inteiro maior que zero).
        </p>
      )}

      {atualizar.isError && (
        <p className="text-feedback-error text-sm">{mensagemErro}</p>
      )}

      {atualizar.isSuccess && atualizar.data && (
        <div className="border-border-default bg-background-default rounded-lg border p-3 text-sm">
          <p className="text-text-primary font-semibold">
            Visita #{atualizar.data.id} ·{" "}
            {VISITA_STATUS_OPTIONS.find(
              (option) => option.value === atualizar.data.status,
            )?.label ?? atualizar.data.status}
          </p>
          <p className="text-text-secondary">
            {formatVisitaDataHora(atualizar.data.data_hora)}
          </p>
        </div>
      )}
    </section>
  );
}
