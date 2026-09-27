"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCorretores } from "@/lib/api/hooks/use-corretores";
import { describeAtribuicaoCorretorError } from "@/lib/corretor-errors";
import type { components } from "@/lib/api/generated/schema";

type CorretorRef = components["schemas"]["CorretorRef"];

/**
 * Seletor de corretor compartilhado entre a tela de moderação de imóvel e a
 * lista de leads. Quem usa decide o que `onAtribuir`/`onRemover` chamam (a
 * atribuição de imóvel ou a de lead) — o componente só sabe exibir e disparar.
 */
export function CorretorSeletor({
  corretorAtual,
  onAtribuir,
  onRemover,
  pendente,
  erro,
  label,
}: {
  corretorAtual: CorretorRef | null;
  onAtribuir: (corretorId: number) => void;
  onRemover: () => void;
  pendente: boolean;
  erro: unknown;
  label: string;
}) {
  const { data: corretores } = useCorretores({ ativo: true });
  const mensagemErro = erro ? describeAtribuicaoCorretorError(erro) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          key={corretorAtual?.id ?? "sem-corretor"}
          value={corretorAtual ? String(corretorAtual.id) : undefined}
          disabled={pendente}
          onValueChange={(value) => onAtribuir(Number(value))}
        >
          <SelectTrigger size="sm" className="w-48" aria-label={label}>
            <SelectValue placeholder="Atribuir corretor" />
          </SelectTrigger>
          <SelectContent>
            {corretores?.map((corretor) => (
              <SelectItem key={corretor.id} value={String(corretor.id)}>
                {corretor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {corretorAtual && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pendente}
            onClick={onRemover}
          >
            Remover atribuição
          </Button>
        )}
      </div>

      {mensagemErro && (
        <p className="text-feedback-error text-xs">{mensagemErro}</p>
      )}
    </div>
  );
}
