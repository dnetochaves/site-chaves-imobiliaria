"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { PropertyCard } from "@/components/property/PropertyCard";
import { toPropertyDisplayData } from "@/components/property/mapImovel";

const QUICK_FILTERS: { label: string; params: Record<string, string> }[] = [
  { label: "Studio", params: { quartos: "0" } },
  { label: "1 quarto", params: { quartos: "1" } },
  { label: "2 quartos", params: { quartos: "2" } },
  { label: "Mobiliado", params: { mobiliado: "true" } },
  { label: "Aceita pets", params: { aceita_pets: "true" } },
];

const ANTES_DE_ALUGAR = [
  {
    titulo: "Quanto do salário comprometer",
    descricao: "Como calcular o limite saudável do seu aluguel.",
  },
  {
    titulo: "O que olhar na visita",
    descricao: "Doze itens que ninguém lembra de checar.",
  },
  {
    titulo: "Seus direitos no contrato",
    descricao: "Reajuste, rescisão e vistoria em linguagem simples.",
  },
];

export default function AlugarPage() {
  const router = useRouter();
  const [local, setLocal] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (local.trim()) params.set("local", local.trim());
    params.set("operacao", "aluguel");
    router.push(`/busca?${params.toString()}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Alugar
        </p>
        <h1 className="text-text-primary text-4xl font-bold">
          Alugue em prédios que a gente administra.
        </h1>
        <p className="text-text-secondary text-lg">
          Nos condomínios sob administração da Chaves, a taxa vem detalhada e
          a portaria já sabe que você chega.
        </p>

        <form
          onSubmit={handleSubmit}
          className="border-border-default bg-background-default flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="alugar-local">Onde você quer morar?</Label>
            <Input
              id="alugar-local"
              placeholder="Bairro ou cidade"
              value={local}
              onChange={(event) => setLocal(event.target.value)}
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => {
            const params = new URLSearchParams({
              operacao: "aluguel",
              ...filter.params,
            });
            return (
              <Link
                key={filter.label}
                href={`/busca?${params.toString()}`}
                className="bg-background-muted text-text-secondary hover:bg-background-subtle rounded-full px-3 py-1.5 text-sm transition-colors"
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl font-semibold">
          Selecionados para alugar
        </h2>
        <FeaturedRentals />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-primary text-2xl font-semibold">
          Antes de alugar
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ANTES_DE_ALUGAR.map((item, i) => (
            <div key={item.titulo} className="flex flex-col gap-1">
              <span className="text-brand-secondary text-xs font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-text-primary text-base font-semibold">
                {item.titulo}
              </h3>
              <p className="text-text-secondary text-sm">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedRentals() {
  const { status, data, error } = useImoveis({
    disponivel_aluguel: true,
    limit: 2,
  });

  if (status === "pending") {
    return (
      <div role="status" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-muted aspect-[4/3] animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-feedback-error text-sm">
        Não foi possível carregar os imóveis agora. Tente novamente em
        instantes. ({String(error)})
      </p>
    );
  }

  if (data.items.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        Nenhum imóvel disponível para aluguel no momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.items.map((imovel) => (
        <PropertyCard key={imovel.id} {...toPropertyDisplayData(imovel)} />
      ))}
    </div>
  );
}
