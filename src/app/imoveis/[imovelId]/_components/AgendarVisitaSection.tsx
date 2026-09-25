"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/AuthContext";
import { useVisitasDisponiveis } from "@/lib/api/hooks/use-visitas-disponiveis";
import { useAgendarVisita } from "@/lib/api/hooks/use-agendar-visita";
import { ApiError, describeApiError } from "@/lib/api/errors";
import { describeAgendarError, type VisitaErro } from "@/lib/visita-errors";
import {
  diaChaveSalvador,
  formatDataHoraSalvador,
  formatDiaSalvador,
  formatHoraSalvador,
} from "@/lib/visita-labels";

type Horario = { id: number; data_hora: string };

type AgendarVisitaSectionProps = {
  imovelId: number;
  endereco: string;
};

export function AgendarVisitaSection({
  imovelId,
  endereco,
}: AgendarVisitaSectionProps) {
  const { status: authStatus, login } = useAuth();
  const { status, data: horarios, error } = useVisitasDisponiveis(imovelId);
  const agendar = useAgendarVisita(imovelId);

  const [selecionado, setSelecionado] = useState<Horario | null>(null);
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [telefoneObrigatorio, setTelefoneObrigatorio] = useState(false);
  const [erro, setErro] = useState<VisitaErro | null>(null);
  const [confirmada, setConfirmada] = useState<string | null>(null);

  const dias = useMemo(() => {
    const grupos: { chave: string; rotulo: string; horarios: Horario[] }[] = [];
    for (const horario of horarios ?? []) {
      const chave = diaChaveSalvador(horario.data_hora);
      const ultimo = grupos[grupos.length - 1];
      if (ultimo && ultimo.chave === chave) {
        ultimo.horarios.push(horario);
      } else {
        grupos.push({
          chave,
          rotulo: formatDiaSalvador(horario.data_hora),
          horarios: [horario],
        });
      }
    }
    return grupos;
  }, [horarios]);

  function escolher(horario: Horario) {
    setSelecionado(horario);
    setErro(null);
    setConfirmada(null);
    setTelefoneObrigatorio(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selecionado) return;

    if (!telefone.trim()) {
      setTelefoneObrigatorio(true);
      return;
    }
    setTelefoneObrigatorio(false);
    setErro(null);

    agendar.mutate(
      {
        visitaId: selecionado.id,
        telefone: telefone.trim(),
        observacoes: observacoes.trim(),
      },
      {
        onSuccess: (visita) => {
          setConfirmada(visita.data_hora);
          setSelecionado(null);
          setTelefone("");
          setObservacoes("");
        },
        onError: (falha) => {
          const descricao = describeAgendarError(falha);
          setErro(descricao);
          if (descricao.acao === "recarregar") setSelecionado(null);
        },
      },
    );
  }

  return (
    <section
      id="agendar-visita"
      className="flex scroll-mt-6 flex-col gap-3"
      aria-labelledby="agendar-visita-titulo"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="agendar-visita-titulo"
          className="text-text-primary text-lg font-semibold"
        >
          Agendar visita
        </h2>
        <p className="text-text-secondary text-xs">
          Horários de Salvador · próximos 30 dias
        </p>
      </div>

      {confirmada && (
        <div
          role="status"
          className="border-border-default bg-brand-primary-subtle flex flex-col gap-1 rounded-lg border p-4 text-sm"
        >
          <p className="text-text-primary font-semibold">Visita agendada!</p>
          <p className="text-text-secondary">
            {formatDataHoraSalvador(confirmada)} · {endereco}
          </p>
          <Link
            href="/minhas-visitas"
            className="text-brand-primary w-fit font-medium hover:underline"
          >
            Ver minhas visitas
          </Link>
        </div>
      )}

      {status === "pending" && (
        <div role="status" className="flex flex-col gap-2">
          <div className="bg-background-muted h-5 w-40 animate-pulse rounded" />
          <div className="bg-background-muted h-11 w-full animate-pulse rounded-lg" />
        </div>
      )}

      {status === "error" && (
        <p className="text-feedback-error text-sm">
          {error instanceof ApiError && error.status === 404
            ? "Este imóvel não está disponível para agendamento."
            : describeApiError(
                error,
                "Não foi possível carregar os horários agora. Tente novamente em instantes.",
              )}
        </p>
      )}

      {status === "success" && dias.length === 0 && (
        <p className="text-text-secondary text-sm">
          Não há horários disponíveis no momento. Você pode pedir contato e
          nossa equipe combina um horário com você.
        </p>
      )}

      {status === "success" && dias.length > 0 && (
        <div className="flex flex-col gap-4">
          {dias.map((dia) => (
            <div key={dia.chave} className="flex flex-col gap-2">
              <p className="text-text-primary text-sm font-medium capitalize">
                {dia.rotulo}
              </p>
              <div className="flex flex-wrap gap-2">
                {dia.horarios.map((horario) => (
                  <Button
                    key={horario.id}
                    type="button"
                    variant={selecionado?.id === horario.id ? "default" : "outline"}
                    aria-pressed={selecionado?.id === horario.id}
                    onClick={() => escolher(horario)}
                    className="h-11 min-w-20 md:h-8"
                  >
                    {formatHoraSalvador(horario.data_hora)}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {erro && (
        <div className="flex flex-col gap-2">
          <p className="text-feedback-error text-sm">{erro.mensagem}</p>
          {erro.acao === "ver-minhas-visitas" && (
            <Link
              href="/minhas-visitas"
              className="text-brand-primary w-fit text-sm font-medium hover:underline"
            >
              Ver minhas visitas
            </Link>
          )}
          {erro.acao === "login" && (
            <Button type="button" className="h-11 w-fit md:h-8" onClick={login}>
              Entrar
            </Button>
          )}
        </div>
      )}

      {selecionado && authStatus === "unauthenticated" && (
        <div className="border-border-default bg-background-default flex flex-col gap-3 rounded-lg border p-4">
          <p className="text-text-primary text-sm">
            Horário escolhido:{" "}
            <strong>{formatDataHoraSalvador(selecionado.data_hora)}</strong>
          </p>
          <p className="text-text-secondary text-sm">
            Entre com sua conta para agendar a visita.
          </p>
          <Button type="button" className="h-11 w-fit md:h-8" onClick={login}>
            Entrar para agendar
          </Button>
        </div>
      )}

      {selecionado && authStatus === "authenticated" && (
        <form
          onSubmit={handleSubmit}
          className="border-border-default bg-background-default flex flex-col gap-3 rounded-lg border p-4"
        >
          <p className="text-text-primary text-sm">
            Horário escolhido:{" "}
            <strong>{formatDataHoraSalvador(selecionado.data_hora)}</strong>
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visita-telefone">Telefone para confirmação</Label>
            <Input
              id="visita-telefone"
              type="tel"
              inputMode="tel"
              maxLength={30}
              autoComplete="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              aria-invalid={telefoneObrigatorio || erro?.campo === "telefone"}
            />
            {telefoneObrigatorio && (
              <p className="text-feedback-error text-sm">
                Informe um telefone para a equipe confirmar a visita.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visita-observacoes">Observações (opcional)</Label>
            <Textarea
              id="visita-observacoes"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              loading={agendar.isPending}
              className="h-11 md:h-8"
            >
              Confirmar agendamento
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={agendar.isPending}
              onClick={() => setSelecionado(null)}
              className="h-11 md:h-8"
            >
              Escolher outro horário
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
