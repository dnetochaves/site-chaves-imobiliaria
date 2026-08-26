import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-12 px-8 py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold text-text-primary">
          Chaves Imobiliária
        </h1>
        <p className="text-lg text-text-secondary">
          Um lugar não se escolhe. Ele encaixa.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">
          Escala tipográfica
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-6xl font-bold">Encontre seu lugar</p>
          <p className="text-5xl font-bold">Encontre seu lugar</p>
          <p className="text-4xl font-semibold">Encontre seu lugar</p>
          <p className="text-3xl font-semibold">Encontre seu lugar</p>
          <p className="text-2xl font-semibold">Encontre seu lugar</p>
          <p className="text-xl font-semibold">Encontre seu lugar</p>
          <p className="text-lg">Encontre seu lugar</p>
          <p className="text-md">Encontre seu lugar</p>
          <p className="text-sm font-medium">Encontre seu lugar</p>
          <p className="text-xs font-medium">Encontre seu lugar</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">
          Cores de marca
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-brand-primary flex h-20 w-40 items-center justify-center rounded-lg text-sm font-medium text-white shadow-md">
            brand.primary
          </div>
          <div className="bg-brand-secondary flex h-20 w-40 items-center justify-center rounded-lg text-sm font-medium text-white shadow-md">
            brand.secondary
          </div>
          <div className="bg-background-subtle border-border-default flex h-20 w-40 items-center justify-center rounded-lg border text-sm font-medium text-text-primary">
            background.subtle
          </div>
          <div className="bg-background-inverse flex h-20 w-40 items-center justify-center rounded-lg text-sm font-medium text-white">
            background.inverse
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">Botões</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Terciário</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button variant="default" disabled>
            Desabilitado
          </Button>
          <Button variant="default" loading>
            Carregando
          </Button>
        </div>
      </section>

      <section className="flex max-w-sm flex-col gap-4">
        <h2 className="text-2xl font-semibold text-text-primary">
          Formulário
        </h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="test-email">E-mail</Label>
          <Input id="test-email" type="email" placeholder="voce@exemplo.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="test-invalid">Campo com erro</Label>
          <Input
            id="test-invalid"
            aria-invalid="true"
            defaultValue="valor inválido"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="test-disabled">Campo desabilitado</Label>
          <Input id="test-disabled" disabled placeholder="desabilitado" />
        </div>
      </section>
    </div>
  );
}
