import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CondoStatsCard } from "@/app/_home/CondoStatsCard";

export function CondoBanner() {
  return (
    <section className="bg-background-inverse grid grid-cols-1 gap-8 rounded-xl p-8 text-white md:grid-cols-2 md:items-center">
      <div className="flex flex-col gap-4">
        <span className="bg-brand-secondary w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
          Novo · Chaves Condomínios
        </span>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">
            Administramos o seu condomínio. Sem planilha, sem assembleia
            perdida.
          </h2>
          <p className="text-white/80">
            Prestação de contas aberta no app, boleto que chega no dia certo
            e um síndico profissional que atende quando o morador chama.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link href="/condominios/proposta">Pedir uma proposta</Link>
          </Button>
          <Button
            variant="outline"
            className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10"
            asChild
          >
            <Link href="/condominios">Como funciona</Link>
          </Button>
        </div>

        <p className="text-xs text-white/60">
          Diagnóstico gratuito das contas do seu prédio em 7 dias.
        </p>
      </div>

      <CondoStatsCard />
    </section>
  );
}
