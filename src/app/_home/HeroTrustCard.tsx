import { Handshake } from "lucide-react";

export function HeroTrustCard() {
  return (
    <div className="bg-brand-secondary absolute right-4 bottom-4 flex max-w-[220px] flex-col gap-1.5 rounded-xl p-4 shadow-md">
      <Handshake className="size-5 text-white" aria-hidden="true" />
      <p className="text-sm font-semibold text-white">
        Visita com gente de verdade
      </p>
      <p className="text-xs text-white/90">
        Um corretor te acompanha do primeiro clique à chave na mão.
      </p>
    </div>
  );
}
