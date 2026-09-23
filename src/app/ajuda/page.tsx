import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildWhatsappHref } from "@/lib/whatsapp";

const FAQ = [
  {
    pergunta: "Preciso criar conta para buscar um imóvel?",
    resposta:
      "Não. A busca e a página de cada imóvel são públicas. Conta só é necessária para favoritar um imóvel ou acompanhar sua solicitação de contato.",
  },
  {
    pergunta: "Como funciona a visita a um imóvel?",
    resposta:
      "Na página do imóvel você envia uma solicitação de contato, e um corretor da Chaves entra em contato para combinar o horário. Não existe agendamento automático pelo site.",
  },
  {
    pergunta: "Se eu alugar meu imóvel pela Chaves, tenho garantia de pagamento?",
    resposta:
      "Sim. Você recebe o valor combinado todo mês, mesmo se o inquilino atrasar — a garantia é da Chaves, não depende de fiador do inquilino, e a cobrança de inadimplência fica com a gente.",
  },
  {
    pergunta: "Como anuncio meu imóvel?",
    resposta:
      "Pelo formulário de anúncio: você confirma o endereço num mapa antes de enviar e informa fotos já hospedadas (por URL).",
  },
  {
    pergunta: "Posso ser corretor parceiro da Chaves?",
    resposta:
      "Sim, para vender/alugar os imóveis da Chaves ou atuar na administração de condomínios.",
  },
];

const WHATSAPP_HREF = buildWhatsappHref(
  "Tenho uma dúvida sobre o site da Chaves",
);

export default function AjudaPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Ajuda
        </p>
        <h1 className="text-text-primary text-4xl font-bold">
          Dúvidas frequentes.
        </h1>
        <p className="text-text-secondary text-lg">
          Respostas rápidas sobre como buscar, alugar, comprar e anunciar
          imóveis com a Chaves.
        </p>
      </section>

      <section className="border-border-default border-t pt-8">
        <Accordion type="single" collapsible>
          {FAQ.map((item) => (
            <AccordionItem key={item.pergunta} value={item.pergunta}>
              <AccordionTrigger className="text-text-primary text-base font-semibold">
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-background-muted flex flex-col items-start gap-3 rounded-xl p-6">
        <h2 className="text-text-primary text-lg font-semibold">
          Não encontrou o que precisava?
        </h2>
        <p className="text-text-secondary text-sm">
          Fale direto com a gente no WhatsApp.
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
