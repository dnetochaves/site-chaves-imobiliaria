import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shell/Logo";

const navLinks = [
  { label: "Alugar", href: "/alugar" },
  { label: "Comprar", href: "/comprar" },
  { label: "Anunciar", href: "/anunciar" },
  { label: "Ajuda", href: "/ajuda" },
];

export function Header() {
  return (
    <header className="border-border-default bg-background-default border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/entrar"
            className="text-text-secondary hover:text-text-primary hidden text-sm font-medium transition-colors md:inline"
          >
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link href="/criar-conta">Criar conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
