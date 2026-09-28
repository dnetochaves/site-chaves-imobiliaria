export const CHAVES_WHATSAPP_NUMBER = "5571983917864";

export function buildWhatsappHref(message: string): string {
  return `https://wa.me/${CHAVES_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Normaliza um telefone brasileiro (com ou sem `+`) para os dígitos do wa.me, ou `null` se inválido. */
function normalizePhoneDigits(telefone: string): string | null {
  const digits = telefone.replace(/\D/g, "");
  if (telefone.trim().startsWith("+")) {
    return digits.length >= 10 && digits.length <= 15 ? digits : null;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    return digits;
  }
  return null;
}

export function buildLeadWhatsappHref(telefone: string): string | null {
  const digits = normalizePhoneDigits(telefone);
  return digits ? `https://wa.me/${digits}` : null;
}

/** Como buildLeadWhatsappHref, mas com uma mensagem inicial pré-preenchida. */
export function buildWhatsappHrefForPhone(
  telefone: string,
  mensagem: string,
): string | null {
  const digits = normalizePhoneDigits(telefone);
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(mensagem)}`
    : null;
}
