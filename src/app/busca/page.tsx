"use client";

import { Suspense } from "react";
import { SearchFilters } from "@/app/busca/_components/SearchFilters";
import { SearchResultsList } from "@/app/busca/_components/SearchResultsList";

export default function BuscaPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 py-8">
      <Suspense>
        <SearchFilters />
        <SearchResultsList />
      </Suspense>
    </div>
  );
}
