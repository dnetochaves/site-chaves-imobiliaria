import type { paths } from "@/lib/api/generated/schema";

export type Operacao = "aluguel" | "compra";

export type SearchFiltersState = {
  bairro: string;
  operacao: Operacao;
  precoMin: string;
  precoMax: string;
  quartos: string;
  mobiliado: boolean;
  aceitaPets: boolean;
  ordenar: string;
  page: number;
};

export const RESULTS_PER_PAGE = 10;

export const DEFAULT_FILTERS: SearchFiltersState = {
  bairro: "",
  operacao: "aluguel",
  precoMin: "",
  precoMax: "",
  quartos: "",
  mobiliado: false,
  aceitaPets: false,
  ordenar: "",
  page: 1,
};

/**
 * Lê os filtros a partir da URL. O campo "local" (enviado pelo form de
 * busca da Home) e "bairro" (enviado pelos chips/atalhos da Home) são
 * tratados como sinônimos — ver design.md do change add-search-page,
 * decisão 3. Internamente e daqui pra frente, a URL da Busca usa sempre
 * "bairro".
 */
export function parseFilters(searchParams: URLSearchParams): SearchFiltersState {
  const operacaoParam = searchParams.get("operacao");
  const pageParam = Number(searchParams.get("page"));

  return {
    bairro: searchParams.get("bairro") ?? searchParams.get("local") ?? "",
    operacao: operacaoParam === "compra" ? "compra" : "aluguel",
    precoMin: searchParams.get("preco_min") ?? "",
    precoMax: searchParams.get("preco_max") ?? "",
    quartos: searchParams.get("quartos") ?? "",
    mobiliado: searchParams.get("mobiliado") === "true",
    aceitaPets: searchParams.get("aceita_pets") === "true",
    ordenar: searchParams.get("ordenar") ?? "",
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
  };
}

/**
 * Serializa os filtros de volta pra query string, omitindo valores default
 * (URL fica só com o que realmente foi escolhido pelo usuário).
 */
export function filtersToSearchParams(filters: SearchFiltersState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.bairro) params.set("bairro", filters.bairro);
  if (filters.operacao !== DEFAULT_FILTERS.operacao) {
    params.set("operacao", filters.operacao);
  }
  if (filters.precoMin) params.set("preco_min", filters.precoMin);
  if (filters.precoMax) params.set("preco_max", filters.precoMax);
  if (filters.quartos) params.set("quartos", filters.quartos);
  if (filters.mobiliado) params.set("mobiliado", "true");
  if (filters.aceitaPets) params.set("aceita_pets", "true");
  if (filters.ordenar) params.set("ordenar", filters.ordenar);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params;
}

type SearchImoveisQuery = NonNullable<
  paths["/imoveis"]["get"]["parameters"]["query"]
>;

export function filtersToApiParams(filters: SearchFiltersState): SearchImoveisQuery {
  return {
    bairro: filters.bairro || undefined,
    preco_min: filters.precoMin || undefined,
    preco_max: filters.precoMax || undefined,
    quartos: filters.quartos ? Number(filters.quartos) : undefined,
    mobiliado: filters.mobiliado || undefined,
    aceita_pets: filters.aceitaPets || undefined,
    disponivel_aluguel: filters.operacao === "aluguel" ? true : undefined,
    disponivel_venda: filters.operacao === "compra" ? true : undefined,
    ordenar: filters.ordenar || undefined,
    limit: RESULTS_PER_PAGE,
    offset: (filters.page - 1) * RESULTS_PER_PAGE,
  };
}

export type ActiveFilterChip = {
  key: string;
  label: string;
  clear: (filters: SearchFiltersState) => SearchFiltersState;
};

/**
 * Chips removíveis (com "×") das telas de Busca — não inclui "operação"
 * porque essa é um toggle sempre ativo (Alugar/Comprar), não um filtro
 * opcional que possa ser totalmente removido (mesmo padrão do mockup).
 */
export function getActiveFilterChips(filters: SearchFiltersState): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.precoMin || filters.precoMax) {
    const min = filters.precoMin ? `R$ ${filters.precoMin}` : "R$ 0";
    const max = filters.precoMax ? `R$ ${filters.precoMax}` : "sem limite";
    chips.push({
      key: "preco",
      label: `${min}–${max}`,
      clear: (f) => ({ ...f, precoMin: "", precoMax: "", page: 1 }),
    });
  }

  if (filters.quartos) {
    chips.push({
      key: "quartos",
      label: `${filters.quartos} quarto${filters.quartos === "1" ? "" : "s"}`,
      clear: (f) => ({ ...f, quartos: "", page: 1 }),
    });
  }

  if (filters.mobiliado) {
    chips.push({
      key: "mobiliado",
      label: "Mobiliado",
      clear: (f) => ({ ...f, mobiliado: false, page: 1 }),
    });
  }

  if (filters.aceitaPets) {
    chips.push({
      key: "aceita_pets",
      label: "Aceita pets",
      clear: (f) => ({ ...f, aceitaPets: false, page: 1 }),
    });
  }

  return chips;
}
