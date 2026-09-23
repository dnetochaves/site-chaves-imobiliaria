"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  parseFilters,
  filtersToSearchParams,
  getActiveFilterChips,
  TIPO_OPTIONS,
  type SearchFiltersState,
} from "@/app/busca/filters";

const QUARTOS_OPTIONS = ["1", "2", "3", "4"];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  const [qInput, setQInput] = useState(filters.q);
  const [precoMinInput, setPrecoMinInput] = useState(filters.precoMin);
  const [precoMaxInput, setPrecoMaxInput] = useState(filters.precoMax);
  const [cidadeInput, setCidadeInput] = useState(filters.cidade);
  const [quartosMinInput, setQuartosMinInput] = useState(filters.quartosMin);
  const [vagasMinInput, setVagasMinInput] = useState(filters.vagasMin);
  const [areaMinInput, setAreaMinInput] = useState(filters.areaMin);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  function applyFilters(patch: Partial<SearchFiltersState>) {
    const next: SearchFiltersState = { ...filters, ...patch, page: 1 };
    router.push(`/busca?${filtersToSearchParams(next).toString()}`);
  }

  const chips = getActiveFilterChips(filters);

  return (
    <div className="border-border-default bg-background-default flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search
            className="text-text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            onBlur={() => applyFilters({ q: qInput })}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters({ q: qInput });
            }}
            placeholder="Bairro, rua, condomínio..."
            className="pl-9"
          />
        </div>

        <div role="group" aria-label="Tipo de operação" className="flex gap-1">
          <Button
            type="button"
            variant={filters.operacao === "aluguel" ? "default" : "outline"}
            aria-pressed={filters.operacao === "aluguel"}
            onClick={() => applyFilters({ operacao: "aluguel" })}
            size="sm"
          >
            Alugar
          </Button>
          <Button
            type="button"
            variant={filters.operacao === "compra" ? "default" : "outline"}
            aria-pressed={filters.operacao === "compra"}
            onClick={() => applyFilters({ operacao: "compra" })}
            size="sm"
          >
            Comprar
          </Button>
        </div>

        <Input
          value={precoMinInput}
          onChange={(e) => setPrecoMinInput(e.target.value)}
          onBlur={() => applyFilters({ precoMin: precoMinInput })}
          placeholder="Preço min"
          inputMode="numeric"
          className="w-28"
        />
        <Input
          value={precoMaxInput}
          onChange={(e) => setPrecoMaxInput(e.target.value)}
          onBlur={() => applyFilters({ precoMax: precoMaxInput })}
          placeholder="Preço max"
          inputMode="numeric"
          className="w-28"
        />

        <div role="group" aria-label="Quartos" className="flex gap-1">
          {QUARTOS_OPTIONS.map((option) => (
            <Button
              key={option}
              type="button"
              variant={filters.quartos === option ? "default" : "outline"}
              aria-pressed={filters.quartos === option}
              onClick={() =>
                applyFilters({
                  quartos: filters.quartos === option ? "" : option,
                })
              }
              size="sm"
            >
              {option}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMoreFilters((v) => !v)}
          aria-expanded={showMoreFilters}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Mais filtros
        </Button>
      </div>

      {showMoreFilters && (
        <div className="border-border-subtle flex flex-wrap gap-6 border-t pt-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-mobiliado"
              checked={filters.mobiliado}
              onCheckedChange={(checked) =>
                applyFilters({ mobiliado: checked === true })
              }
            />
            <Label htmlFor="filter-mobiliado">Mobiliado</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-aceita-pets"
              checked={filters.aceitaPets}
              onCheckedChange={(checked) =>
                applyFilters({ aceitaPets: checked === true })
              }
            />
            <Label htmlFor="filter-aceita-pets">Aceita pets</Label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-tipo">Tipo de imóvel</Label>
            <Select
              value={filters.tipo || "qualquer"}
              onValueChange={(value) =>
                applyFilters({ tipo: value === "qualquer" ? "" : value })
              }
            >
              <SelectTrigger id="filter-tipo" size="sm" className="w-44">
                <SelectValue placeholder="Qualquer tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualquer">Qualquer tipo</SelectItem>
                {TIPO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-cidade">Cidade</Label>
            <Input
              id="filter-cidade"
              value={cidadeInput}
              onChange={(e) => setCidadeInput(e.target.value)}
              onBlur={() => applyFilters({ cidade: cidadeInput })}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters({ cidade: cidadeInput });
              }}
              placeholder="Cidade"
              className="w-40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-quartos-min">Quartos mínimo</Label>
            <Input
              id="filter-quartos-min"
              value={quartosMinInput}
              onChange={(e) => setQuartosMinInput(e.target.value)}
              onBlur={() => applyFilters({ quartosMin: quartosMinInput })}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  applyFilters({ quartosMin: quartosMinInput });
              }}
              placeholder="Ex: 2"
              inputMode="numeric"
              className="w-28"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-vagas-min">Vagas mínimo</Label>
            <Input
              id="filter-vagas-min"
              value={vagasMinInput}
              onChange={(e) => setVagasMinInput(e.target.value)}
              onBlur={() => applyFilters({ vagasMin: vagasMinInput })}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  applyFilters({ vagasMin: vagasMinInput });
              }}
              placeholder="Ex: 1"
              inputMode="numeric"
              className="w-28"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-area-min">Área mínima (m²)</Label>
            <Input
              id="filter-area-min"
              value={areaMinInput}
              onChange={(e) => setAreaMinInput(e.target.value)}
              onBlur={() => applyFilters({ areaMin: areaMinInput })}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters({ areaMin: areaMinInput });
              }}
              placeholder="Ex: 60"
              inputMode="numeric"
              className="w-28"
            />
          </div>
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => {
                const next = chip.clear(filters);
                router.push(`/busca?${filtersToSearchParams(next).toString()}`);
              }}
              className={cn(
                "bg-brand-primary-subtle text-brand-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
              )}
            >
              {chip.label}
              <X className="size-3" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
