export const CHAVES_WHATSAPP_NUMBER = "5571983917864";

export function buildWhatsappHref(message: string): string {
  return `https://wa.me/${CHAVES_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildLeadWhatsappHref(telefone: string): string | null {
  const digits = telefone.replace(/\D/g, "");
  if (telefone.trim().startsWith("+")) {
    return digits.length >= 10 && digits.length <= 15
      ? `https://wa.me/${digits}`
      : null;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `https://wa.me/55${digits}`;
  }
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    return `https://wa.me/${digits}`;
  }
  return null;
}
