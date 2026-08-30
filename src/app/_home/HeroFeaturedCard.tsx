// Dado de exemplo, não vem da API — card ilustrativo sobreposto à imagem de
// hero, mostrando como fica um imóvel em destaque (ver design.md, decisão 3).
const FEATURED_EXAMPLE = {
  neighborhood: "Horto Florestal",
  city: "BA",
  title: "Apto 2 quartos com varanda",
  visitBadge: "Visita hoje 18h",
  price: "R$ 3.400",
  priceNote: "/mês",
  details: "78 m² · 1 vaga",
};

export function HeroFeaturedCard() {
  return (
    <div className="border-border-default bg-background-default absolute bottom-4 left-4 flex flex-col gap-1 rounded-xl border p-4 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
          {FEATURED_EXAMPLE.neighborhood} · {FEATURED_EXAMPLE.city}
        </p>
        <span className="bg-brand-secondary-subtle text-brand-secondary rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap">
          {FEATURED_EXAMPLE.visitBadge}
        </span>
      </div>
      <p className="text-text-primary text-sm font-semibold">
        {FEATURED_EXAMPLE.title}
      </p>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-text-primary text-sm font-semibold">
          {FEATURED_EXAMPLE.price}
          <span className="text-text-secondary text-xs font-normal">
            {" "}
            {FEATURED_EXAMPLE.priceNote}
          </span>
        </p>
        <p className="text-text-secondary text-xs whitespace-nowrap">
          {FEATURED_EXAMPLE.details}
        </p>
      </div>
    </div>
  );
}
