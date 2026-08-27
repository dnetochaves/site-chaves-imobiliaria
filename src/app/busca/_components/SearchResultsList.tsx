"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { toPropertyDisplayData } from "@/components/property/mapImovel";
import { PropertyListItem } from "@/components/property/PropertyListItem";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  parseFilters,
  filtersToSearchParams,
  filtersToApiParams,
  RESULTS_PER_PAGE,
} from "@/app/busca/filters";

const SORT_OPTIONS = [
  { value: "", label: "Relevância" },
  { value: "preco_asc", label: "Menor preço" },
  { value: "preco_desc", label: "Maior preço" },
];

export type SearchResultsListProps = {
  onHoverItem?: (id: number | null) => void;
};

export function SearchResultsList({ onHoverItem }: SearchResultsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const { status, data, error } = useImoveis(filtersToApiParams(filters));

  function goToPage(page: number) {
    router.push(
      `/busca?${filtersToSearchParams({ ...filters, page }).toString()}`,
    );
  }

  function setOrdenar(ordenar: string) {
    router.push(
      `/busca?${filtersToSearchParams({ ...filters, ordenar, page: 1 }).toString()}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-primary text-lg font-semibold">
            {status === "success"
              ? `${data.total} imóve${data.total === 1 ? "l" : "is"}${filters.bairro ? ` em ${filters.bairro}` : ""}`
              : "Buscando imóveis…"}
          </h2>
          <p className="text-text-secondary text-xs">
            Valores já com condomínio e IPTU
          </p>
        </div>

        <Select value={filters.ordenar} onValueChange={setOrdenar}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {status === "pending" && (
        <div role="status" className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-muted h-[122px] animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-feedback-error text-sm">
          Não foi possível carregar os imóveis agora. Tente novamente em
          instantes. ({String(error)})
        </p>
      )}

      {status === "success" && data.items.length === 0 && (
        <p className="text-text-secondary text-sm">
          Nenhum imóvel encontrado com esses filtros.
        </p>
      )}

      {status === "success" && data.items.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.items.map((imovel) => {
              const item = toPropertyDisplayData(imovel);
              return (
                <PropertyListItem
                  key={item.id}
                  {...item}
                  onMouseEnter={() => onHoverItem?.(item.id)}
                  onMouseLeave={() => onHoverItem?.(null)}
                />
              );
            })}
          </div>

          <SearchPagination
            total={data.total}
            page={filters.page}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}

function SearchPagination({
  total,
  page,
  onPageChange,
}: {
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginação" className="flex items-center gap-1.5">
      {pages.map((p) => (
        <Button
          key={p}
          type="button"
          size="sm"
          variant={p === page ? "default" : "outline"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
    </nav>
  );
}
