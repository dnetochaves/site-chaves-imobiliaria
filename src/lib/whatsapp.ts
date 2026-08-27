// TODO: substituir pelo número real de WhatsApp da Chaves antes de produção.
export const WHATSAPP_PLACEHOLDER_NUMBER = "5511999999999";

export function buildWhatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_PLACEHOLDER_NUMBER}?text=${encodeURIComponent(message)}`;
}
