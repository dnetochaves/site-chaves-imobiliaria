"use client";

import { CriarHorarioSection } from "@/app/admin/visitas/_components/CriarHorarioSection";
import { AtualizarVisitaSection } from "@/app/admin/visitas/_components/AtualizarVisitaSection";

export default function AdminVisitasPage() {
  return (
    <div className="flex flex-col gap-10">
      <CriarHorarioSection />
      <AtualizarVisitaSection />
    </div>
  );
}
