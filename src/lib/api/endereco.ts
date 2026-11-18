/**
 * Endereço completo e código interno: só chegam à equipe, ao responsável pelo
 * anúncio e ao visitante com visita agendada. O OpenAPI de produção ainda é o
 * anterior à privacidade do endereço, então estes tipos são locais — trocar
 * pelos gerados depois do deploy do back-end (ver design.md de
 * hide-public-address).
 */
export type Endereco = {
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  cep?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

/** Campos opcionais que o back-end novo acrescenta ao detalhe e às listas de equipe. */
export type ComEnderecoCodigo = {
  endereco?: Endereco | null;
  codigo?: string | null;
};

type UnidadeLegada = Endereco;

/**
 * Lê o endereço de `endereco` quando a API é a nova (`null` = sem permissão ou
 * não informado). Com a API antiga o campo não existe (`undefined`) e o endereço
 * ainda vem em `unidade` — o fallback só existe para a transição e só deve ser
 * usado em telas de equipe/responsável/visita agendada.
 */
export function lerEndereco(fonte: {
  endereco?: Endereco | null;
  unidade?: UnidadeLegada | null;
}): Endereco | null {
  if (fonte.endereco !== undefined) return fonte.endereco;
  const u = fonte.unidade;
  if (!u) return null;
  const temAlgo = [u.rua, u.numero, u.complemento, u.cep].some(Boolean);
  return temAlgo
    ? {
        rua: u.rua,
        numero: u.numero,
        complemento: u.complemento,
        cep: u.cep,
        latitude: u.latitude,
        longitude: u.longitude,
      }
    : null;
}

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
