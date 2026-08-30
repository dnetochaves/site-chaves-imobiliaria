import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ListPropertyCta() {
  return (
    <section className="flex flex-col gap-4 rounded-xl p-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Tem um imóvel para alugar?
        </h2>
        <p className="text-text-secondary">
          Anunciamos, cuidamos das visitas e garantimos o pagamento todo mês.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/anunciar">Anunciar imóvel</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/falar-com-alguem">Falar com alguém</Link>
        </Button>
      </div>
    </section>
  );
}
