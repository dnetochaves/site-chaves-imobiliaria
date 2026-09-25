"use client";

import { VisitasLista } from "@/app/admin/visitas/_components/VisitasLista";
import { CriarHorarioSection } from "@/app/admin/visitas/_components/CriarHorarioSection";

export default function AdminVisitasPage() {
  return (
    <div className="flex flex-col gap-10">
      <VisitasLista />
      <CriarHorarioSection />
    </div>
  );
}
