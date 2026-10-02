"use client";

import { useState } from "react";
import Image from "next/image";
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
import { CorretorSeletor } from "@/app/admin/corretores/_components/CorretorSeletor";
import {
  useAtribuirCorretorImovel,
  useRemoverCorretorImovel,
} from "@/lib/api/hooks/use-atribuir-corretor-imovel";
import { useModerarImovel } from "@/lib/api/hooks/use-moderar-imovel";
import {
  ACAO_LABELS,
  ACOES_ORDEM,
  formatImovelStatus,
  isAcaoConhecida,
  type ListingAction,
} from "@/lib/imovel-labels";
import {
  MENSAGEM_UNIDADE_ATIVA,
  describeImovelAcaoError,
} from "@/lib/imovel-errors";
import { formatDataHoraSalvador } from "@/lib/visita-labels";

type ImovelAdmin = components["schemas"]["ImovelAdminRead"];

const CONFIRMACAO: Partial<Record<ListingAction, { titulo: string; texto: string }>> = {
  pausar: {
    titulo: "Pausar este imóvel?",
    texto: "O imóvel deixa de aparecer no site até ser republicado.",
  },
  rejeitar: {
    titulo: "Rejeitar este imóvel?",
    texto: "O imóvel será removido.",
  },
};

export function ImovelAdminLinha({ imovel }: { imovel: ImovelAdmin }) {
  const [confirmando, setConfirmando] = useState<ListingAction | null>(null);
  const moderar = useModerarImovel(imovel.id);
  const atribuir = useAtribuirCorretorImovel(imovel.id);
  const remover = useRemoverCorretorImovel(imovel.id);

  const { unidade } = imovel;
  const acoes = ACOES_ORDEM.filter(
    (acao) => imovel.acoes_permitidas.some((valor) => isAcaoConhecida(valor) && valor === acao),
  );
  const pausadoSemAcoes =
    imovel.status === "pausado" && imovel.acoes_permitidas.length === 0;
  const visitas = imovel.visitas_agendadas_futuras_na_unidade;

  function executar(acao: ListingAction) {
    moderar.reset();
    if (CONFIRMACAO[acao]) {
      setConfirmando(acao);
      return;
    }
    moderar.mutate(acao);
  }

  function confirmar() {
    if (!confirmando) return;
    moderar.mutate(confirmando, { onSuccess: () => setConfirmando(null) });
  }

  const erroAcao = moderar.isError ? describeImovelAcaoError(moderar.error) : null;
  const dialog = confirmando ? CONFIRMACAO[confirmando] : undefined;

  return (
    <li className="border-border-default bg-background-default flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="bg-background-muted relative size-16 shrink-0 overflow-hidden rounded-md">
          <Image
            src={imovel.foto_capa ?? "/property-placeholder.svg"}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Link
              href={`/admin/imoveis/${imovel.id}`}
              className="text-text-primary text-sm font-semibold hover:underline"
            >
              #{imovel.id} · {imovel.titulo}
            </Link>
            <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
              {formatImovelStatus(imovel.status)}
            </span>
          </div>
          <span className="text-text-secondary text-xs">
            {unidade.bairro} · {unidade.cidade}/{unidade.estado}
          </span>
          <span className="text-text-secondary text-xs">
            Cadastrado em {formatDataHoraSalvador(imovel.criado_em)}
          </span>
        </div>
      </div>

      {acoes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {acoes.map((acao) => (
            <Button
              key={acao}
              type="button"
              variant={acao === "aprovar" || acao === "republicar" ? "default" : "outline"}
              className="h-11 md:h-8"
              disabled={moderar.isPending}
              onClick={() => executar(acao)}
            >
              {ACAO_LABELS[acao]}
            </Button>
          ))}
        </div>
      )}

      {pausadoSemAcoes && (
        <p className="text-text-secondary text-sm">{MENSAGEM_UNIDADE_ATIVA}</p>
      )}

      {erroAcao && !confirmando && (
        <p className="text-feedback-error text-sm">{erroAcao}</p>
      )}

      <CorretorSeletor
        label={`Corretor do imóvel ${imovel.id}`}
        corretorAtual={imovel.corretor ?? null}
        pendente={atribuir.isPending || remover.isPending}
        erro={atribuir.isError ? atribuir.error : remover.error}
        onAtribuir={(corretorId) => atribuir.mutate(corretorId)}
        onRemover={() => {
          if (imovel.corretor) remover.mutate(imovel.corretor.id);
        }}
      />

      <Dialog
        open={confirmando !== null}
        onOpenChange={(aberto) => {
          if (!moderar.isPending && !aberto) setConfirmando(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.titulo ?? ""}</DialogTitle>
            <DialogDescription>
              #{imovel.id} · {imovel.titulo}
            </DialogDescription>
          </DialogHeader>

          <p className="text-text-secondary text-sm">{dialog?.texto}</p>

          {confirmando === "pausar" && visitas > 0 && (
            <p className="bg-brand-secondary-subtle text-text-primary rounded-md p-3 text-sm">
              Este imóvel tem {visitas} visita{visitas === 1 ? "" : "s"} agendada
              {visitas === 1 ? "" : "s"}. {visitas === 1 ? "Ela continua marcada" : "Elas continuam marcadas"},
              mas ninguém mais consegue reservar horários. Pausar mesmo assim?
            </p>
          )}

          {erroAcao && <p className="text-feedback-error text-sm">{erroAcao}</p>}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-8"
              disabled={moderar.isPending}
              onClick={() => setConfirmando(null)}
            >
              Manter
            </Button>
            <Button
              type="button"
              className="h-11 md:h-8"
              loading={moderar.isPending}
              onClick={confirmar}
            >
              {confirmando ? ACAO_LABELS[confirmando] : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
