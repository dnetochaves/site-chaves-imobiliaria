import { BadgeCheck } from "lucide-react";

// Estatística real fornecida pela administração (não vem da API) — ver
// design.md deste change para o registro da origem e o risco de ficar
// desatualizada com o tempo.
const DELIVERIES_LABEL = "84 chaves entregues em agosto";

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
