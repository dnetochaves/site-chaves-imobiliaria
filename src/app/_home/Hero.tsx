"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HeroFeaturedCard } from "@/app/_home/HeroFeaturedCard";
import { HeroDeliveriesBadge } from "@/app/_home/HeroDeliveriesBadge";
import { HeroTrustCard } from "@/app/_home/HeroTrustCard";

type Operacao = "aluguel" | "compra";

const NEIGHBORHOOD_CHIPS = ["Rio Vermelho", "Barra", "Pituba", "Graça"];

export function Hero() {
  const router = useRouter();
  const [local, setLocal] = useState("");
  const [operacao, setOperacao] = useState<Operacao>("aluguel");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (local.trim()) params.set("local", local.trim());
    params.set("operacao", operacao);

    router.push(`/busca?${params.toString()}`);
  }

  return (
    <section className="grid grid-cols-1 items-center gap-8 py-16 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
            Aluguel e compra · Salvador e região metropolitana
          </p>
          <h1 className="text-6xl font-bold text-text-primary">
            Um lugar que encaixa na sua vida.
          </h1>
          <p className="text-text-secondary text-lg">
            Busque com o valor final na tela desde o primeiro clique — e
            conte com a gente também na administração do seu condomínio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-border-default bg-background-default flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="hero-local">Onde você quer morar?</Label>
            <Input
              id="hero-local"
              placeholder="Bairro, rua ou praia"
              value={local}
              onChange={(event) => setLocal(event.target.value)}
            />
          </div>

          <div role="group" aria-label="Tipo de operação" className="flex gap-1">
            <Button
              type="button"
              variant={operacao === "aluguel" ? "default" : "outline"}
              aria-pressed={operacao === "aluguel"}
              onClick={() => setOperacao("aluguel")}
              className={cn(operacao !== "aluguel" && "bg-transparent")}
            >
              Alugar
            </Button>
            <Button
              type="button"
              variant={operacao === "compra" ? "default" : "outline"}
              aria-pressed={operacao === "compra"}
              onClick={() => setOperacao("compra")}
              className={cn(operacao !== "compra" && "bg-transparent")}
            >
              Comprar
            </Button>
          </div>

          <Button type="submit">Buscar</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {NEIGHBORHOOD_CHIPS.map((neighborhood) => (
            <Link
              key={neighborhood}
              href={`/busca?bairro=${encodeURIComponent(neighborhood)}`}
              className="bg-background-muted text-text-secondary hover:bg-background-subtle rounded-full px-3 py-1.5 text-sm transition-colors"
            >
              {neighborhood}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-background-muted relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src="/home-hero.jpg"
          alt="Corretora da Chaves mostrando um apartamento para um casal"
          fill
          className="object-cover"
          priority
        />
        <HeroDeliveriesBadge />
        <HeroFeaturedCard />
        <HeroTrustCard />
      </div>
    </section>
  );
}
