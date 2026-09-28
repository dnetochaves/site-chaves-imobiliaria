"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { MessageCircle, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";
import {
  useCorretorPublico,
  CorretorNaoEncontradoError,
} from "@/lib/api/hooks/use-corretor-publico";
import { buildWhatsappHrefForPhone } from "@/lib/whatsapp";
import { formatCorretorCreci } from "@/lib/corretor-labels";

export default function CorretorPublicoPage() {
  const params = useParams<{ slug: string }>();
  const { status, data: corretor, error } = useCorretorPublico(params.slug);

  if (status === "error" && error instanceof CorretorNaoEncontradoError) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-primary text-lg font-medium">
          Corretor não encontrado.
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-6 py-8">
        <div className="bg-background-muted mx-auto size-28 animate-pulse rounded-full" />
        <div className="bg-background-muted mx-auto h-6 w-48 animate-pulse rounded" />
        <div className="bg-background-muted h-24 w-full animate-pulse rounded-xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-feedback-error text-sm">
          Não foi possível carregar esta página agora. Tente novamente em
          instantes.
        </p>
      </div>
    );
  }

  const creci = formatCorretorCreci(corretor.creci_numero, corretor.creci_uf);
  const whatsappHref = buildWhatsappHrefForPhone(
    corretor.telefone,
    `Olá, ${corretor.nome}. Acessei sua apresentação e gostaria de falar sobre um imóvel.`,
  );
  const redes = corretor.redes_sociais;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-background-muted relative size-28 shrink-0 overflow-hidden rounded-full">
          {corretor.foto_url && (
            <Image
              src={corretor.foto_url}
              alt={corretor.nome}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">
            {corretor.nome}
          </h1>
          <p className="text-text-secondary text-sm">Corretor de Imóveis</p>
          {(creci || corretor.cidade) && (
            <p className="text-text-secondary text-sm">
              {[creci, corretor.cidade].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {corretor.bio && (
          <p className="text-text-secondary max-w-md text-sm">
            {corretor.bio}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {whatsappHref && (
          <Button asChild className="h-11 w-full gap-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar no WhatsApp
            </a>
          </Button>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {corretor.telefone && (
            <Button asChild variant="outline" className="h-11 gap-2">
              <a href={`tel:${corretor.telefone.replace(/(?!^\+)[^\d]/g, "")}`}>
                <Phone className="size-4" aria-hidden="true" />
                Ligar
              </a>
            </Button>
          )}
          {corretor.email && (
            <Button asChild variant="outline" className="h-11 gap-2">
              <a href={`mailto:${corretor.email}`}>
                <Mail className="size-4" aria-hidden="true" />
                E-mail
              </a>
            </Button>
          )}
          {redes?.instagram && (
            <Button asChild variant="outline" className="h-11 gap-2">
              <a
                href={redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Instagram
              </a>
            </Button>
          )}
          {redes?.linkedin && (
            <Button asChild variant="outline" className="h-11 gap-2">
              <a
                href={redes.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <ShareButton title={`${corretor.nome} · Chaves Imobiliária`} size="lg" />
      </div>
    </div>
  );
}
