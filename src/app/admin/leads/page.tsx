"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLeads } from "@/lib/api/hooks/use-leads";
import { describeApiError } from "@/lib/api/errors";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_TIPO_OPTIONS,
  type LeadStatus,
  type LeadTipo,
} from "@/lib/lead-labels";
import { LeadRow } from "@/app/admin/leads/_components/LeadRow";

const LEADS_PER_PAGE = 10;
const TODOS = "todos";

export default function AdminLeadsPage() {
  const [status, setStatus] = useState<LeadStatus | undefined>();
  const [tipo, setTipo] = useState<LeadTipo | undefined>();
  const [page, setPage] = useState(1);

  const { status: queryStatus, data, error } = useLeads({
    status,
    tipo,
    limit: LEADS_PER_PAGE,
    offset: (page - 1) * LEADS_PER_PAGE,
  });

  const totalPages = data ? Math.ceil(data.total / LEADS_PER_PAGE) : 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filtro-status">Status</Label>
          <Select
            value={status ?? TODOS}
            onValueChange={(value) => {
              setStatus(value === TODOS ? undefined : (value as LeadStatus));
              setPage(1);
            }}
          >
            <SelectTrigger id="filtro-status" size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {LEAD_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filtro-tipo">Tipo</Label>
          <Select
            value={tipo ?? TODOS}
            onValueChange={(value) => {
              setTipo(value === TODOS ? undefined : (value as LeadTipo));
              setPage(1);
            }}
          >
            <SelectTrigger id="filtro-tipo" size="sm" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {LEAD_TIPO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {queryStatus === "success" && (
          <p className="text-text-secondary ml-auto text-sm">
            {data.total} lead{data.total === 1 ? "" : "s"}
          </p>
        )}
      </section>

      {queryStatus === "pending" && (
        <div role="status" className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-muted h-20 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {queryStatus === "error" && (
        <p className="text-feedback-error text-sm">
          {describeApiError(
            error,
            "Não foi possível carregar os leads agora. Tente novamente em instantes.",
          )}
        </p>
      )}

      {queryStatus === "success" && data.items.length === 0 && (
        <p className="text-text-secondary text-sm">
          Nenhum lead encontrado com esses filtros.
        </p>
      )}

      {queryStatus === "success" && data.items.length > 0 && (
        <>
          <ul className="flex flex-col gap-2">
            {data.items.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Paginação" className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  type="button"
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
