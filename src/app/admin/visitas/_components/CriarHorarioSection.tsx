"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useImovelDetail,
  ImovelNaoEncontradoError,
} from "@/lib/api/hooks/use-imovel-detail";
import { useCriarHorarioVisita } from "@/lib/api/hooks/use-criar-horario-visita";
import { ApiError, describeApiError } from "@/lib/api/errors";
import {
  VISITA_STATUS_OPTIONS,
  formatDataHoraSalvador,
  salvadorLocalParaIso,
} from "@/lib/visita-labels";

export function CriarHorarioSection() {
  const [idInput, setIdInput] = useState("");
  const [idError, setIdError] = useState(false);
  const [imovelId, setImovelId] = useState<number | null>(null);

  function handleBuscar(event: FormEvent) {
    event.preventDefault();
    const trimmed = idInput.trim();
    if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) {
      setIdError(true);
      return;
    }
    setIdError(false);
    setImovelId(Number(trimmed));
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-text-primary text-lg font-semibold">
        Criar horário de visita
      </h2>
      <p className="text-text-secondary text-sm">
        Informe o ID do imóvel, confira o endereço e escolha a data e a hora (horário de Salvador).
      </p>

      <form onSubmit={handleBuscar} className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="horario-imovel-id">ID do imóvel</Label>
          <Input
            id="horario-imovel-id"
            inputMode="numeric"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            className="w-40"
          />
        </div>
        <Button type="submit" variant="outline">
          Buscar imóvel
        </Button>
      </form>

      {idError && (
        <p className="text-feedback-error text-sm">
          Informe um ID válido (número inteiro maior que zero).
        </p>
      )}

      {imovelId !== null && <HorarioForm key={imovelId} imovelId={imovelId} />}
    </section>
  );
}

function HorarioForm({ imovelId }: { imovelId: number }) {
  const { status, data: imovel, error } = useImovelDetail(imovelId);
  const criar = useCriarHorarioVisita();
  const [dataHora, setDataHora] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dataError, setDataError] = useState(false);

  if (status === "pending") {
    return <p className="text-text-secondary text-sm">Buscando imóvel…</p>;
  }

  if (status === "error") {
    return (
      <p className="text-feedback-error text-sm">
        {error instanceof ImovelNaoEncontradoError
          ? "Imóvel não encontrado."
          : describeApiError(
              error,
              "Não foi possível buscar o imóvel agora. Tente novamente em instantes.",
            )}
      </p>
    );
  }

  const { unidade } = imovel;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const instante = dataHora ? salvadorLocalParaIso(dataHora) : null;
    if (!instante) {
      setDataError(true);
      return;
    }
    setDataError(false);
    criar.mutate({
      unidade_id: unidade.id,
      data_hora: instante,
      observacoes: observacoes.trim() || undefined,
    });
  }

  const mensagemErro =
    criar.error instanceof ApiError && criar.error.status === 404
      ? "Imóvel não encontrado."
      : describeApiError(
          criar.error,
          "Não foi possível criar o horário. A ação pode não ser permitida para este imóvel.",
        );

  return (
    <div className="flex flex-col gap-3">
      <div className="border-border-default bg-background-default rounded-lg border p-3 text-sm">
        <p className="text-text-primary font-semibold">
          #{imovel.id} · {imovel.titulo}
        </p>
        <p className="text-text-secondary">
          {unidade.rua}, {unidade.numero} · {unidade.bairro} · {unidade.cidade}/
          {unidade.estado}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="horario-data-hora">
            Data e hora (horário de Salvador)
          </Label>
          <Input
            id="horario-data-hora"
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="horario-observacoes">Observações (opcional)</Label>
          <Textarea
            id="horario-observacoes"
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        {dataError && (
          <p className="text-feedback-error text-sm">
            Informe a data e a hora do horário.
          </p>
        )}
        {criar.isError && (
          <p className="text-feedback-error text-sm">{mensagemErro}</p>
        )}

        <Button type="submit" loading={criar.isPending} className="w-fit">
          Criar horário
        </Button>
      </form>

      {criar.isSuccess && criar.data && (
        <div className="border-border-default bg-brand-primary-subtle rounded-lg border p-3 text-sm">
          <p className="text-text-primary font-semibold">
            Horário criado · Visita #{criar.data.id}
          </p>
          <p className="text-text-secondary">
            {formatDataHoraSalvador(criar.data.data_hora)} ·{" "}
            {VISITA_STATUS_OPTIONS.find(
              (option) => option.value === criar.data.status,
            )?.label ?? criar.data.status}
          </p>
          <p className="text-text-secondary">
            O horário aparece na lista de visitas com o filtro &ldquo;Disponíveis&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
