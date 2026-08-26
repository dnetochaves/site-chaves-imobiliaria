/**
 * Leitura centralizada de variáveis de ambiente. Nenhum outro lugar do
 * código deve ler `process.env` diretamente — ver src/config/README.md.
 */

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: requireEnv(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
} as const;
