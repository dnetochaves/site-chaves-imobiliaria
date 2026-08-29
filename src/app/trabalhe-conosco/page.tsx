import { buildWhatsappHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

const WHATSAPP_HREF = buildWhatsappHref(
  "Sou corretor e quero ser parceiro da Chaves",
);

const FORMATOS_DE_PARCERIA = [
  {
    titulo: "Venda e locação",
    descricao:
      "Venda e alugue os imóveis anunciados na Chaves como corretor parceiro.",
  },
  {
    titulo: "Administração de condomínios",
    descricao:
      "Atue na gestão dos condomínios que administramos, junto com o nosso time.",
  },
];

export default function TrabalheConoscoPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Trabalhe conosco
        </p>
        <h1 className="text-text-primary text-4xl font-bold">
          Seja um corretor parceiro da Chaves.
        </h1>
        <p className="text-text-secondary text-lg">
          Trabalhamos com corretores parceiros pra vender e alugar os imóveis
          da Chaves, além de oportunidades na administração de condomínios.
          Se você tem outro formato de parceria em mente, também queremos
          conversar.
        </p>
      </section>

      <section className="border-border-default grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2">
        {FORMATOS_DE_PARCERIA.map((item) => (
          <div key={item.titulo} className="flex flex-col gap-1">
            <h2 className="text-text-primary text-base font-semibold">
              {item.titulo}
            </h2>
            <p className="text-text-secondary text-sm">{item.descricao}</p>
          </div>
        ))}
      </section>

      <section className="bg-background-muted flex flex-col items-start gap-3 rounded-xl p-6">
        <h2 className="text-text-primary text-lg font-semibold">
          Vamos conversar?
        </h2>
        <p className="text-text-secondary text-sm">
          Fale com a gente no WhatsApp e conte um pouco sobre sua experiência
          e o tipo de parceria que você tem em mente.
        </p>
        <Button asChild>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        </Button>
      </section>
    </div>
  );
}
