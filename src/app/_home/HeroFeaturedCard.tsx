// Dado de exemplo, não vem da API — card ilustrativo sobreposto à imagem de
// hero, mostrando como fica um imóvel em destaque (ver design.md, decisão 3).
const FEATURED_EXAMPLE = {
  neighborhood: "Perdizes",
  city: "SP",
  title: "Apto 2 quartos com varanda",
  price: "R$ 3.400",
  priceNote: "/mês, tudo incluso",
};

export function HeroFeaturedCard() {
  return (
    <div className="border-border-default bg-background-default absolute bottom-4 left-4 flex flex-col gap-1 rounded-xl border p-4 shadow-md">
      <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
        {FEATURED_EXAMPLE.neighborhood} · {FEATURED_EXAMPLE.city}
      </p>
      <p className="text-text-primary text-sm font-semibold">
        {FEATURED_EXAMPLE.title}
      </p>
      <p className="text-text-primary text-sm font-semibold">
        {FEATURED_EXAMPLE.price}
        <span className="text-text-secondary text-xs font-normal">
          {" "}
          {FEATURED_EXAMPLE.priceNote}
        </span>
      </p>
    </div>
  );
}
