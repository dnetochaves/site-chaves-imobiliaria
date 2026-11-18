import type { components } from "@/lib/api/generated/schema";

/**
 * Endereço exato: só chega à equipe, ao responsável pelo anúncio e ao visitante
 * com visita agendada. Toda parte pode ser nula (imóvel cadastrado sem rua).
 */
export type Endereco = components["schemas"]["EnderecoRead"];

function texto(valor: string | null | undefined): string {
  return (valor ?? "").trim();
}

/** "Rua X, 10 - apto 2"; `null` quando não há rua. Partes nulas são omitidas. */
export function formatEnderecoLinha(
  endereco: Endereco | null | undefined,
): string | null {
  if (!endereco) return null;
  const rua = texto(endereco.rua);
  if (!rua) return null;
  const numero = texto(endereco.numero);
  const complemento = texto(endereco.complemento);
  return `${rua}${numero ? `, ${numero}` : ""}${complemento ? ` - ${complemento}` : ""}`;
}

/** "Rua X, 10 · Bairro · Cidade/UF" — a rua entra só quando informada. */
export function formatLocalizacaoCompleta(
  endereco: Endereco | null | undefined,
  unidade: { bairro: string; cidade: string; estado: string },
): string {
  return [
    formatEnderecoLinha(endereco),
    unidade.bairro,
    `${unidade.cidade}/${unidade.estado}`,
  ]
    .filter(Boolean)
    .join(" · ");
}
