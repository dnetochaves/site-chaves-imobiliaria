"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * `navigator.clipboard.writeText` pode ser recusado (política de permissão,
 * contexto não seguro, falta de gesto do usuário) mesmo em navegadores que
 * o suportam — por isso cai para o método legado de seleção + `execCommand`
 * antes de desistir.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ShareButton({
  title,
  size = "sm",
}: {
  title: string;
  /** "sm" (36px, o tamanho original) ou "lg" (44px, área de toque mínima). */
  size?: "sm" | "lg";
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // usuário cancelou o compartilhamento — não é um erro
      }
      return;
    }
    if (await copyToClipboard(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartilhar"
      className={cn(
        "border-border-default hover:bg-background-subtle flex items-center justify-center rounded-full border transition-colors",
        size === "lg" ? "size-11" : "size-9",
      )}
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </button>
  );
}
