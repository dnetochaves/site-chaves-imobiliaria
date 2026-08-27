import Link from "next/link";
import { Hero } from "@/app/_home/Hero";
import { SelecionadosParaHoje } from "@/app/_home/SelecionadosParaHoje";
import { CategoryShortcuts } from "@/app/_home/CategoryShortcuts";
import { CondoBanner } from "@/app/_home/CondoBanner";
import { ListPropertyCta } from "@/app/_home/ListPropertyCta";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6">
      <Hero />

      <section className="flex flex-col gap-4 py-8">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-text-primary">
              Selecionados para hoje
            </h2>
            <p className="text-text-secondary text-sm">
              Imóveis com visita disponível nas próximas 48 horas.
            </p>
          </div>
          <Link
            href="/busca"
            className="text-text-primary hover:text-brand-primary text-sm font-medium whitespace-nowrap transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <SelecionadosParaHoje />
      </section>

      <CategoryShortcuts />
      <CondoBanner />
      <ListPropertyCta />
    </div>
  );
}
