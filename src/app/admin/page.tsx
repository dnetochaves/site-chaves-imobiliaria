"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImoveisAdminLista } from "@/app/admin/_components/ImoveisAdminLista";

export default function AdminPage() {
  const router = useRouter();
  const [idInput, setIdInput] = useState("");
  const [idError, setIdError] = useState(false);

  function handleOpenById(event: FormEvent) {
    event.preventDefault();
    const trimmed = idInput.trim();
    if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) {
      setIdError(true);
      return;
    }
    setIdError(false);
    router.push(`/admin/imoveis/${Number(trimmed)}`);
  }

  return (
    <div className="flex flex-col gap-10">
      <ImoveisAdminLista />

      <section className="flex flex-col gap-3">
        <h2 className="text-text-primary text-lg font-semibold">
          Abrir imóvel por ID
        </h2>
        <p className="text-text-secondary text-sm">
          Use o ID para abrir os detalhes de um imóvel em qualquer status.
        </p>
        <form onSubmit={handleOpenById} className="flex items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imovel-id">ID do imóvel</Label>
            <Input
              id="imovel-id"
              inputMode="numeric"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              className="w-40"
            />
          </div>
          <Button type="submit">Abrir</Button>
        </form>
        {idError && (
          <p className="text-feedback-error text-sm">
            Informe um ID válido (número inteiro maior que zero).
          </p>
        )}
      </section>
    </div>
  );
}
