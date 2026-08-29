import Link from "next/link";
import { Button } from "@/components/ui/button";

const DIFERENCIAIS = [
  {
    titulo: "Pagamento garantido",
    descricao:
      "Você recebe todo mês, mesmo se o inquilino atrasar ou sair sem avisar.",
  },
  {
    titulo: "Sem fiador, sem burocracia",
    descricao:
      "A garantia é da Chaves, não do inquilino — menos entrave pra fechar contrato.",
  },
  {
    titulo: "Cobrança é com a gente",
    descricao:
      "Inadimplência, negociação e, se precisar, ação de despejo — você não lida com nada disso.",
  },
];

export default function GarantiaPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Garantia
        </p>
        <h1 className="text-text-primary text-4xl font-bold">
          Garantia de aluguel todo mês, mesmo se o inquilino atrasar.
        </h1>
        <p className="text-text-secondary text-lg">
          Quem anuncia com a Chaves recebe o valor combinado na data certa —
          a gente assume o risco de inadimplência, não você.
        </p>
      </section>

      <section className="border-border-default grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3">
        {DIFERENCIAIS.map((item) => (
          <div key={item.titulo} className="flex flex-col gap-1">
            <h2 className="text-text-primary text-base font-semibold">
              {item.titulo}
            </h2>
            <p className="text-text-secondary text-sm">{item.descricao}</p>
          </div>
        ))}
      </section>

      <section className="bg-background-muted flex flex-col items-start gap-3 rounded-xl p-6">
        <h2 className="text-text-primary text-lg font-semibold">
          Tem um imóvel para alugar?
        </h2>
        <p className="text-text-secondary text-sm">
          Anuncie com a Chaves e conte com o pagamento garantido todo mês.
        </p>
        <Button asChild>
          <Link href="/anunciar">Anunciar imóvel</Link>
        </Button>
      </section>
    </div>
  );
}
