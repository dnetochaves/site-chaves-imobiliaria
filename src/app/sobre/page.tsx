import Link from "next/link";
import { Button } from "@/components/ui/button";

const DIFERENCIAIS = [
  {
    titulo: "Preço inteiro",
    descricao:
      "O valor que você vê já tem condomínio, IPTU e seguro. Não existe letra miúda.",
  },
  {
    titulo: "Uma visita basta",
    descricao:
      "Fotos honestas, planta e vídeo do prédio. Você chega sabendo o que vai ver.",
  },
  {
    titulo: "Condomínio cuidado",
    descricao:
      "Administramos prédios com contas abertas e síndico profissional de plantão.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4">
        <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
          Sobre a Chaves
        </p>
        <h1 className="text-text-primary text-4xl font-bold">
          Existimos para o momento em que a chave gira.
        </h1>
        <p className="text-text-secondary text-lg">
          Começamos em 2026 porque alugar um imóvel no Brasil ainda exigia
          fiador, três visitas e um contrato que ninguém entendia. Trocamos
          isso por uma coisa só: informação completa antes de você decidir.
        </p>
      </section>

      <section className="border-border-default grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3">
        {DIFERENCIAIS.map((item) => (
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
          Vamos achar o seu lugar?
        </h2>
        <p className="text-text-secondary text-sm">
          Comece pela busca ou fale com a gente.
        </p>
        <Button asChild>
          <Link href="/busca">Buscar imóveis</Link>
        </Button>
      </section>
    </div>
  );
}
