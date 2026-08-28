"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildWhatsappHref } from "@/lib/whatsapp";
import { useImoveis } from "@/lib/api/hooks/use-imoveis";
import { PropertyCard } from "@/components/property/PropertyCard";
import { toPropertyDisplayData } from "@/components/property/mapImovel";

const WHATSAPP_HREF = buildWhatsappHref(
  "Quero simular o financiamento de um imóvel",
);

const SIMULACAO_CHECKLIST = [
  "Comparação entre Caixa, Itaú, Bradesco e Santander na mesma conversa",
  "Checagem de subsídio, FGTS e enquadramento no seu caso",
  "Resposta em até 1 hora útil — sem cadastro, sem consulta ao seu CPF",
];

const ANTES_DE_COMPRAR = [
  {
    titulo: "Quanto custa além do imóvel",
    descricao: "ITBI, escritura e registro somados de verdade.",
  },
  {
    titulo: "SAC ou Price",
    descricao: "A diferença entre os dois sistemas, sem jargão.",
  },
  {
    titulo: "Documentos do imóvel",
    descricao: "O que checar na matrícula antes de assinar.",
  },
];

export default function ComprarPage() {
  const router = useRouter();
  const [local, setLocal] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (local.trim()) params.set("local", local.trim());
    params.set("operacao", "compra");
    router.push(`/busca?${params.toString()}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-4">
          <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
            Comprar
          </p>
          <h1 className="text-text-primary text-4xl font-bold">
            Saiba quanto cabe antes de se apaixonar.
          </h1>
          <p className="text-text-secondary text-lg">
            Um especialista da Chaves faz a simulação do seu financiamento no
            WhatsApp — com as taxas reais do seu perfil.
          </p>

          <form
            onSubmit={handleSubmit}
            className="border-border-default bg-background-default flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="comprar-local">Bairro ou cidade</Label>
              <Input
                id="comprar-local"
                placeholder="Bairro ou cidade"
                value={local}
                onChange={(event) => setLocal(event.target.value)}
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary text-sm font-medium underline-offset-4 hover:underline"
          >
            Ou simule seu financiamento no WhatsApp
          </a>
        </div>

        <div className="bg-background-inverse flex flex-col gap-4 rounded-xl p-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
              Atendimento no WhatsApp
            </p>
            <h2 className="text-lg font-semibold text-white">
              Simulação com um especialista
            </h2>
          </div>
          <p className="text-sm text-white/80">
            Calculadora automática erra: ignora o seu score, o subsídio a que
            você tem direito e a diferença entre os bancos. Aqui, quem faz a
            conta é gente — e a resposta vem com a taxa real do seu perfil.
          </p>
          <ul className="flex flex-col gap-2">
            {SIMULACAO_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-white"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild className="!bg-brand-secondary hover:!bg-brand-secondary-hover">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              Simular no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl font-semibold">
          Selecionados para comprar
        </h2>
        <FeaturedSales />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-primary text-2xl font-semibold">
          Antes de comprar
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ANTES_DE_COMPRAR.map((item, i) => (
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

function FeaturedSales() {
  const { status, data, error } = useImoveis({
    disponivel_venda: true,
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
        Nenhum imóvel disponível para venda no momento.
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
