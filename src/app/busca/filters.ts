import type { components, paths } from "@/lib/api/generated/schema";

export type Operacao = "aluguel" | "compra";

export type PropertyType = components["schemas"]["PropertyType"];

export const TIPO_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "cobertura", label: "Cobertura" },
  { value: "studio", label: "Studio" },
  { value: "kitnet", label: "Kitnet" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "outro", label: "Outro" },
];

export type SearchFiltersState = {
  q: string;
  operacao: Operacao;
  precoMin: string;
  precoMax: string;
  quartos: string;
  mobiliado: boolean;
  aceitaPets: boolean;
  tipo: string;
  cidade: string;
  quartosMin: string;
  vagasMin: string;
  areaMin: string;
  ordenar: string;
  page: number;
};

export const RESULTS_PER_PAGE = 10;

export const DEFAULT_FILTERS: SearchFiltersState = {
  q: "",
  operacao: "aluguel",
  precoMin: "",
  precoMax: "",
  quartos: "",
  mobiliado: false,
  aceitaPets: false,
  tipo: "",
  cidade: "",
  quartosMin: "",
  vagasMin: "",
  areaMin: "",
  ordenar: "",
  page: 1,
};

/**
 * Lê os filtros a partir da URL. "q" é o campo de busca por texto amplo
 * (título, descrição, rua, bairro, cidade, condomínio — ver design.md do
 * change add-search-filters). "local" (form de busca da Home) e "bairro"
 * (chips/atalhos da Home, change add-search-page) continuam aceitos como
 * sinônimos de entrada, mas só como valor inicial: a partir daqui a URL da
 * Busca sempre serializa de volta como "q".
 */
export function parseFilters(searchParams: URLSearchParams): SearchFiltersState {
  const operacaoParam = searchParams.get("operacao");
  const pageParam = Number(searchParams.get("page"));

  return {
    q:
      searchParams.get("q") ??
      searchParams.get("bairro") ??
      searchParams.get("local") ??
      "",
    operacao: operacaoParam === "compra" ? "compra" : "aluguel",
    precoMin: searchParams.get("preco_min") ?? "",
    precoMax: searchParams.get("preco_max") ?? "",
    quartos: searchParams.get("quartos") ?? "",
    mobiliado: searchParams.get("mobiliado") === "true",
    aceitaPets: searchParams.get("aceita_pets") === "true",
    tipo: searchParams.get("tipo") ?? "",
    cidade: searchParams.get("cidade") ?? "",
    quartosMin: searchParams.get("quartos_min") ?? "",
    vagasMin: searchParams.get("vagas_min") ?? "",
    areaMin: searchParams.get("area_min") ?? "",
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

  if (filters.q) params.set("q", filters.q);
  if (filters.operacao !== DEFAULT_FILTERS.operacao) {
    params.set("operacao", filters.operacao);
  }
  if (filters.precoMin) params.set("preco_min", filters.precoMin);
  if (filters.precoMax) params.set("preco_max", filters.precoMax);
  if (filters.quartos) params.set("quartos", filters.quartos);
  if (filters.mobiliado) params.set("mobiliado", "true");
  if (filters.aceitaPets) params.set("aceita_pets", "true");
  if (filters.tipo) params.set("tipo", filters.tipo);
  if (filters.cidade) params.set("cidade", filters.cidade);
  if (filters.quartosMin) params.set("quartos_min", filters.quartosMin);
  if (filters.vagasMin) params.set("vagas_min", filters.vagasMin);
  if (filters.areaMin) params.set("area_min", filters.areaMin);
  if (filters.ordenar) params.set("ordenar", filters.ordenar);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params;
}

type SearchImoveisQuery = NonNullable<
  paths["/imoveis"]["get"]["parameters"]["query"]
>;

export function filtersToApiParams(filters: SearchFiltersState): SearchImoveisQuery {
  return {
    q: filters.q || undefined,
    preco_min: filters.precoMin || undefined,
    preco_max: filters.precoMax || undefined,
    quartos: filters.quartos ? Number(filters.quartos) : undefined,
    mobiliado: filters.mobiliado || undefined,
    aceita_pets: filters.aceitaPets || undefined,
    tipo: (filters.tipo as PropertyType) || undefined,
    cidade: filters.cidade || undefined,
    quartos_min: filters.quartosMin ? Number(filters.quartosMin) : undefined,
    vagas_min: filters.vagasMin ? Number(filters.vagasMin) : undefined,
    area_min: filters.areaMin || undefined,
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

  if (filters.tipo) {
    const option = TIPO_OPTIONS.find((o) => o.value === filters.tipo);
    chips.push({
      key: "tipo",
      label: option?.label ?? filters.tipo,
      clear: (f) => ({ ...f, tipo: "", page: 1 }),
    });
  }

  if (filters.cidade) {
    chips.push({
      key: "cidade",
      label: filters.cidade,
      clear: (f) => ({ ...f, cidade: "", page: 1 }),
    });
  }

  if (filters.quartosMin) {
    chips.push({
      key: "quartos_min",
      label: `${filters.quartosMin}+ quartos`,
      clear: (f) => ({ ...f, quartosMin: "", page: 1 }),
    });
  }

  if (filters.vagasMin) {
    chips.push({
      key: "vagas_min",
      label: `${filters.vagasMin}+ vagas`,
      clear: (f) => ({ ...f, vagasMin: "", page: 1 }),
    });
  }

  if (filters.areaMin) {
    chips.push({
      key: "area_min",
      label: `${filters.areaMin}+ m²`,
      clear: (f) => ({ ...f, areaMin: "", page: 1 }),
    });
  }

  return chips;
}
