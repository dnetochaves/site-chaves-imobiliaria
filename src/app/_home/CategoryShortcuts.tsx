import Link from "next/link";
import { Home, Users, PawPrint, Building2 } from "lucide-react";
import { buildWhatsappHref } from "@/lib/whatsapp";

const WHATSAPP_HREF = buildWhatsappHref(
  "Quero uma simulação para o meu primeiro imóvel",
);

type Shortcut = {
  label: string;
  description: string;
  href: string;
  icon: typeof Home;
  external?: boolean;
};

const shortcuts: Shortcut[] = [
  {
    label: "Morar sozinho",
    description: "Studios e 1 quarto até R$ 3.000.",
    href: "/busca?quartos=1",
    icon: Home,
  },
  {
    label: "Com a família",
    description: "3 quartos, vaga e perto de escola.",
    href: "/busca?quartos=3",
    icon: Users,
  },
  {
    label: "Com pets",
    description: "Prédios e casas que aceitam animais.",
    href: "/busca?aceita_pets=true",
    icon: PawPrint,
  },
  {
    label: "Primeiro imóvel",
    description: "Simulação com um especialista no WhatsApp.",
    href: WHATSAPP_HREF,
    icon: Building2,
    external: true,
  },
];

export function CategoryShortcuts() {
  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-2xl font-semibold text-text-primary">
        Comece por onde faz sentido
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.label}
            href={shortcut.href}
            target={shortcut.external ? "_blank" : undefined}
            rel={shortcut.external ? "noopener noreferrer" : undefined}
            className="border-border-default bg-background-default hover:bg-background-subtle flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors"
          >
            <shortcut.icon
              className="text-brand-primary size-5"
              aria-hidden="true"
            />
            <span className="text-text-primary text-sm font-semibold">
              {shortcut.label}
            </span>
            <span className="text-text-secondary text-xs">
              {shortcut.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
