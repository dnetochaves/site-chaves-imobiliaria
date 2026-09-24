"use client";

import type { components } from "@/lib/api/generated/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtualizarStatusLead } from "@/lib/api/hooks/use-atualizar-status-lead";
import { describeApiError } from "@/lib/api/errors";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_TIPO_OPTIONS,
  type LeadStatus,
} from "@/lib/lead-labels";
import { buildLeadWhatsappHref } from "@/lib/whatsapp";

type Lead = components["schemas"]["LeadRead"];

export function LeadRow({ lead }: { lead: Lead }) {
  const atualizar = useAtualizarStatusLead(lead.id);
  const whatsappHref = buildLeadWhatsappHref(lead.telefone);
  const tipoLabel =
    LEAD_TIPO_OPTIONS.find((option) => option.value === lead.tipo)?.label ??
    lead.tipo;

  return (
    <li className="border-border-default bg-background-default flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-text-primary text-sm font-semibold">
            #{lead.id} · {lead.nome}
          </span>
          <span className="text-text-secondary text-sm">
            {lead.telefone}
            {whatsappHref && (
              <>
                {" · "}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary font-medium hover:underline"
                >
                  WhatsApp
                </a>
              </>
            )}
          </span>
        </div>

        <Select
          value={lead.status}
          disabled={atualizar.isPending}
          onValueChange={(value) => atualizar.mutate(value as LeadStatus)}
        >
          <SelectTrigger
            size="sm"
            className="w-44"
            aria-label={`Status do lead ${lead.id}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
          {tipoLabel}
        </span>
        {lead.unidade_id !== null && (
          <span className="bg-background-muted text-text-secondary rounded-full px-2 py-0.5 text-xs">
            Unidade {lead.unidade_id}
          </span>
        )}
      </div>

      {lead.contexto && (
        <p className="text-text-secondary text-sm">{lead.contexto}</p>
      )}

      {atualizar.isError && (
        <p className="text-feedback-error text-sm">
          {describeApiError(
            atualizar.error,
            "Não foi possível alterar o status. A transição pode não ser permitida a partir do status atual.",
          )}
        </p>
      )}
    </li>
  );
}
