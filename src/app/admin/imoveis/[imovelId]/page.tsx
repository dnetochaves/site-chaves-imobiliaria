"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  useImovelDetail,
  ImovelNaoEncontradoError,
} from "@/lib/api/hooks/use-imovel-detail";
import {
  useModerarImovel,
  type AcaoModeracao,
} from "@/lib/api/hooks/use-moderar-imovel";
import { describeApiError } from "@/lib/api/errors";

const ACOES: { acao: AcaoModeracao; label: string }[] = [
  { acao: "aprovar", label: "Aprovar" },
  { acao: "pausar", label: "Pausar" },
  { acao: "rejeitar", label: "Rejeitar" },
];

export default function AdminImovelPage() {
  const params = useParams<{ imovelId: string }>();
  const imovelId = Number(params.imovelId);
  const { status, data: imovel, error } = useImovelDetail(imovelId);
  const moderar = useModerarImovel(imovelId);

  const voltar = (
    <Link
      href="/admin"
      className="text-brand-primary text-sm font-medium hover:underline"
    >
      ← Voltar ao painel
    </Link>
  );

  if (
    !Number.isInteger(imovelId) ||
    imovelId < 1 ||
    (status === "error" && error instanceof ImovelNaoEncontradoError)
  ) {
    return (
      <div className="flex flex-col gap-3">
        {voltar}
        <p className="text-text-primary text-sm">Imóvel não encontrado.</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <div className="bg-background-muted h-6 w-64 animate-pulse rounded" />
        <div className="bg-background-muted h-24 w-full animate-pulse rounded-lg" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-3">
        {voltar}
        <p className="text-feedback-error text-sm">
          {describeApiError(
            error,
            "Não foi possível carregar este imóvel agora. Tente novamente em instantes.",
          )}
        </p>
      </div>
    );
  }

  const { unidade } = imovel;

  return (
    <div className="flex flex-col gap-6">
      {voltar}

      <section className="border-border-default bg-background-default flex flex-col gap-2 rounded-xl border p-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-text-primary text-lg font-semibold">
            #{imovel.id} · {imovel.titulo}
          </h2>
          <span className="bg-background-muted text-text-secondary rounded-full px-2.5 py-0.5 text-xs">
            {imovel.status}
          </span>
        </div>
        <p className="text-text-secondary text-sm">
          {unidade.rua}, {unidade.numero} · {unidade.bairro} ·{" "}
          {unidade.cidade}/{unidade.estado}
        </p>
        <Link
          href={`/imoveis/${imovel.id}`}
          className="text-brand-primary w-fit text-sm font-medium hover:underline"
        >
          Ver página pública do imóvel
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-text-primary text-base font-semibold">Moderação</h3>
        <div className="flex flex-wrap gap-2">
          {ACOES.map(({ acao, label }) => (
            <Button
              key={acao}
              type="button"
              variant={acao === "aprovar" ? "default" : "outline"}
              disabled={moderar.isPending}
              onClick={() => moderar.mutate(acao)}
            >
              {label}
            </Button>
          ))}
        </div>
        {moderar.isError && (
          <p className="text-feedback-error text-sm">
            {describeApiError(
              moderar.error,
              "Não foi possível executar a ação. Ela pode não ser permitida para o status atual deste imóvel.",
            )}
          </p>
        )}
      </section>
    </div>
  );
}
