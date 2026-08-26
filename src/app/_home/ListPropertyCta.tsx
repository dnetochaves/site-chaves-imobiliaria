import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ListPropertyCta() {
  return (
    <section className="border-border-default flex flex-col gap-4 rounded-xl border p-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Tem um imóvel para alugar?
        </h2>
        <p className="text-text-secondary">
          Anuncie com a Chaves e encontre um inquilino com segurança.
        </p>
      </div>
      <Button asChild>
        <Link href="/anunciar">Anunciar meu imóvel</Link>
      </Button>
    </section>
  );
}
