import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { buildWhatsappHref } from "@/lib/whatsapp";
import { ContactRequestDialog } from "@/app/imoveis/[imovelId]/_components/ContactRequestDialog";
import type { components } from "@/lib/api/generated/schema";

type ImovelDetail = components["schemas"]["ImovelDetail"];

export function PropertyPriceSidebar({ imovel }: { imovel: ImovelDetail }) {
  const mainPrice = imovel.disponivel_aluguel
    ? imovel.valor_total_mensal
    : imovel.valor_venda;

  const breakdown = (
    [
      { label: "Aluguel", value: imovel.valor_aluguel },
      { label: "Condomínio", value: imovel.valor_condominio },
      { label: "IPTU", value: imovel.valor_iptu },
      { label: "Seguro incêndio", value: imovel.valor_seguro_incendio },
    ] satisfies { label: string; value: string | null }[]
  ).filter((item): item is { label: string; value: string } => item.value !== null);

  const whatsappHref = buildWhatsappHref(
    `Tenho interesse no imóvel "${imovel.titulo}"`,
  );

  return (
    <aside className="border-border-default bg-background-default flex flex-col gap-4 rounded-xl border p-5 lg:sticky lg:top-4">
      <div>
        <p className="text-text-primary text-2xl font-semibold">
          {mainPrice ? formatPrice(mainPrice) : "Sob consulta"}
          {imovel.disponivel_aluguel && (
            <span className="text-text-secondary text-sm font-normal">
              /mês
            </span>
          )}
        </p>
        {imovel.disponivel_aluguel && (
          <p className="text-text-secondary text-xs">
            Tudo incluso, sem taxa de contrato.
          </p>
        )}
      </div>

      {imovel.disponivel_aluguel && breakdown.length > 0 && (
        <div className="border-border-default flex flex-col gap-2 border-t pt-4 text-sm">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <span className="text-text-secondary">{item.label}</span>
              <span className="text-text-primary">
                {formatPrice(item.value)}
              </span>
            </div>
          ))}
          {imovel.valor_total_mensal && (
            <div className="border-border-default flex items-center justify-between border-t pt-2 font-semibold">
              <span className="text-text-primary">Total mensal</span>
              <span className="text-text-primary">
                {formatPrice(imovel.valor_total_mensal)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <ContactRequestDialog
          unidadeId={imovel.unidade.id}
          imovelTitulo={imovel.titulo}
        />
        <Button asChild variant="outline" className="w-full">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Falar com a Chaves
          </a>
        </Button>
      </div>

      {imovel.administrado_pela_chaves && (
        <div className="bg-brand-secondary-subtle rounded-lg p-4 text-sm">
          <p className="text-text-primary font-semibold">
            Condomínio administrado pela Chaves
          </p>
          <p className="text-text-secondary text-xs">
            Taxa detalhada item por item e prestação de contas aberta no app.
          </p>
        </div>
      )}
    </aside>
  );
}
