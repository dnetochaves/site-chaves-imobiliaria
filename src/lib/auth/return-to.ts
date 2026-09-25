const RETURN_TO_KEY = "chaves.auth.return_to";

export function isSafeReturnPath(path: unknown): path is string {
  if (typeof path !== "string" || path.length === 0) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//") || path.startsWith("/\\")) return false;
  if (path === "/auth" || path.startsWith("/auth/")) return false;
  if (/[\u0000-\u001f\u007f\\]/.test(path)) return false;
  return true;
}

export function saveReturnTo(): void {
  if (typeof window === "undefined") return;

  const current = window.location.pathname + window.location.search;
  if (!isSafeReturnPath(current)) return;

  try {
    window.sessionStorage.setItem(RETURN_TO_KEY, current);
  } catch {
    // storage indisponível: o login segue normalmente e o retorno cai na Home
  }
}

export function consumeReturnTo(): string {
  if (typeof window === "undefined") return "/";

  let saved: string | null = null;
  try {
    saved = window.sessionStorage.getItem(RETURN_TO_KEY);
    window.sessionStorage.removeItem(RETURN_TO_KEY);
  } catch {
    return "/";
  }

  return isSafeReturnPath(saved) ? saved : "/";
}
