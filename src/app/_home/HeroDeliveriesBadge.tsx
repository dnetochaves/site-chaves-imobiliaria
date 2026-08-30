import { BadgeCheck } from "lucide-react";

// Estatística real fornecida pela administração (não vem da API) — sem
// referência a mês específico de propósito, pra não exigir atualização
// manual todo mês (ver design.md do change simplify-hero-credibility-composition).
const DELIVERIES_LABEL = "84 chaves entregues";

export function HeroDeliveriesBadge() {
  return (
    <div className="bg-background-default absolute top-4 right-4 flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md">
      <BadgeCheck
        className="text-feedback-success size-4 shrink-0"
        aria-hidden="true"
      />
      <span className="text-text-primary text-xs font-medium whitespace-nowrap">
        {DELIVERIES_LABEL}
      </span>
    </div>
  );
}
