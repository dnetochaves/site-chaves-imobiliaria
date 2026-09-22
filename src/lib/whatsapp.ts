export const CHAVES_WHATSAPP_NUMBER = "5571983917864";

export function buildWhatsappHref(message: string): string {
  return `https://wa.me/${CHAVES_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
