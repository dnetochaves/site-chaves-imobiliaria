"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { components } from "@/lib/api/generated/schema";

type ImovelFoto = components["schemas"]["ImovelFotoRead"];

export type PropertyGalleryProps = {
  fotos: ImovelFoto[];
  title: string;
};

export function PropertyGallery({ fotos, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ordered = [...fotos].sort((a, b) => a.ordem - b.ordem);

  if (ordered.length === 0) {
    return (
      <div className="bg-background-muted relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src="/property-placeholder.svg"
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  const [main, ...thumbnails] = ordered;
  const visibleThumbnails = thumbnails.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="bg-background-muted relative aspect-[4/3] overflow-hidden rounded-xl sm:row-span-2"
        >
          <Image
            src={main.url}
            alt={title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </button>

        <div className="grid grid-cols-2 gap-2">
          {visibleThumbnails.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              className="bg-background-muted relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={foto.url}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
              {i === visibleThumbnails.length - 1 && ordered.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                  Ver {ordered.length} fotos
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {ordered.length > 1 && (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="text-text-primary self-end text-sm font-medium underline-offset-4 hover:underline"
        >
          Ver {ordered.length} fotos
        </button>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={ordered[lightboxIndex].url}
                alt={title}
                fill
                className="object-contain bg-black"
                unoptimized
              />
              {ordered.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto anterior"
                    onClick={() =>
                      setLightboxIndex(
                        (i) => ((i ?? 0) - 1 + ordered.length) % ordered.length,
                      )
                    }
                    className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima foto"
                    onClick={() =>
                      setLightboxIndex((i) => ((i ?? 0) + 1) % ordered.length)
                    }
                    className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
