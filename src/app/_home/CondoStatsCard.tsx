// Dado de exemplo, não vem da API — o projeto não tem integração real com
// dados de condomínio ainda (ver design.md, decisão 3).
const EXAMPLE_CONDO = {
  name: "Ed. Aurora",
  units: 42,
  rows: [
    { label: "Arrecadado no mês", value: "R$ 38.640" },
    { label: "Despesas pagas", value: "R$ 31.120" },
    { label: "Inadimplência", value: "2,4%" },
    { label: "Fundo de reserva", value: "R$ 94.300" },
  ],
  stats: [
    { value: "-18%", label: "vacância média" },
    { value: "4h", label: "para responder" },
    { value: "100%", label: "contas abertas" },
  ],
};

export function CondoStatsCard() {
  return (
    <div className="bg-background-default flex flex-col gap-4 rounded-xl p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-text-primary text-sm font-semibold">
          {EXAMPLE_CONDO.name} · {EXAMPLE_CONDO.units} unidades
        </p>
        <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
          Prestação de contas
        </p>
      </div>

      <dl className="flex flex-col gap-2">
        {EXAMPLE_CONDO.rows.map((row) => (
          <div
            key={row.label}
            className="border-border-subtle flex items-center justify-between border-t pt-2 text-sm first:border-t-0 first:pt-0"
          >
            <dt className="text-text-secondary">{row.label}</dt>
            <dd className="text-text-primary font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-3 gap-2">
        {EXAMPLE_CONDO.stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-background-subtle flex flex-col items-center gap-0.5 rounded-lg px-2 py-3 text-center"
          >
            <p className="text-text-primary text-sm font-semibold">
              {stat.value}
            </p>
            <p className="text-text-muted text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
