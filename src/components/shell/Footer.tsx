import Link from "next/link";
import { Logo } from "@/components/shell/Logo";

type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const columns: FooterColumn[] = [
  {
    title: "Buscar",
    links: [
      { label: "Alugar", href: "/alugar" },
      { label: "Comprar", href: "/comprar" },
      { label: "Bairros", href: "/bairros" },
    ],
  },
  {
    title: "Proprietários",
    links: [
      { label: "Anunciar", href: "/anunciar" },
      { label: "Garantia", href: "/garantia" },
      { label: "Gestão", href: "/gestao" },
    ],
  },
  {
    title: "Chaves",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Trabalhe conosco", href: "/trabalhe-conosco" },
      { label: "Ajuda", href: "/ajuda" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background-subtle border-border-default border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex flex-col gap-1">
          <Logo />
          {/* CRECI e CNPJ são dados de exemplo do Design System (sistema-montado.pdf) — substituir pelos dados reais da empresa antes de qualquer deploy de produção. */}
          <p className="text-text-secondary text-sm">
            CRECI 00000-J · São Paulo, SP
          </p>
          <p className="text-text-secondary text-sm">
            CNPJ 00.000.000/0001-00
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-text-muted text-xs font-medium tracking-wide uppercase">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
