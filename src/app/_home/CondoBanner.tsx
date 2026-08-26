import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CondoBanner() {
  return (
    <section className="bg-background-inverse flex flex-col gap-4 rounded-xl p-8 text-white md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">
          Administramos o seu condomínio.
        </h2>
        <p className="text-white/80">Sem planilha, sem assembleia perdida.</p>
      </div>
      <Button variant="secondary" asChild>
        <Link href="/condominios">Conhecer a gestão de condomínios</Link>
      </Button>
    </section>
  );
}
