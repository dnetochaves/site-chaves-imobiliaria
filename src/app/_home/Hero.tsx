"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Operacao = "aluguel" | "compra";

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
    <section className="flex flex-col gap-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-6xl font-bold text-text-primary">
          Um lugar que encaixa na sua vida.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-border-default bg-background-default flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="hero-local">Onde você quer morar?</Label>
          <Input
            id="hero-local"
            placeholder="Bairro ou cidade"
            value={local}
            onChange={(event) => setLocal(event.target.value)}
          />
        </div>

        <div
          role="group"
          aria-label="Tipo de operação"
          className="flex gap-1"
        >
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
    </section>
  );
}
