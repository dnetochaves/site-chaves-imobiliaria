"use client";

import { Suspense, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SearchFilters } from "@/app/busca/_components/SearchFilters";
import { SearchResultsList } from "@/app/busca/_components/SearchResultsList";
import { SearchResultsMap } from "@/app/busca/_components/SearchResultsMap";

export default function BuscaPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 py-8">
      <Suspense>
        <SearchFilters />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SearchResultsList onHoverItem={setHoveredId} />

          <div className="flex flex-col gap-2 lg:sticky lg:top-4 lg:self-start">
            <div className="flex items-center justify-end gap-2">
              {/*
                "Atualizar ao mover" é só visual nesta fase — não dispara
                nova busca ao mover/arrastar o mapa (ver design.md, Non-Goals
                do change add-search-page).
              */}
              <Label htmlFor="update-on-move" className="text-text-secondary text-sm">
                Atualizar ao mover
              </Label>
              <Switch id="update-on-move" defaultChecked disabled />
            </div>
            <SearchResultsMap hoveredId={hoveredId} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
