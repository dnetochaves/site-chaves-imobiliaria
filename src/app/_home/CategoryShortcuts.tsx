import Link from "next/link";

type Shortcut = {
  label: string;
  href: string;
};

const shortcuts: Shortcut[] = [
  { label: "Pinheiros", href: "/busca?bairro=Pinheiros" },
  { label: "Vila Madalena", href: "/busca?bairro=Vila+Madalena" },
  { label: "Perto de mim", href: "/busca?ordenar=distancia" },
  { label: "Para investir", href: "/busca?operacao=compra" },
];

export function CategoryShortcuts() {
  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-2xl font-semibold text-text-primary">
        Comece por onde tudo começa
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.label}
            href={shortcut.href}
            className="border-border-default bg-background-default hover:bg-background-subtle rounded-lg border px-4 py-6 text-center text-sm font-medium text-text-primary transition-colors"
          >
            {shortcut.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
