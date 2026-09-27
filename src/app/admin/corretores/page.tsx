"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCorretores } from "@/lib/api/hooks/use-corretores";
import { describeApiError } from "@/lib/api/errors";
import { CorretorLinha } from "@/app/admin/corretores/_components/CorretorLinha";
import { CorretorFormulario } from "@/app/admin/corretores/_components/CorretorFormulario";

export default function AdminCorretoresPage() {
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [busca, setBusca] = useState("");
  const [novoAberto, setNovoAberto] = useState(false);

  const { status, data: corretores, error } = useCorretores(
    mostrarInativos ? {} : { ativo: true },
  );

  const filtrados = useMemo(() => {
    if (!corretores) return [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return corretores;
    return corretores.filter((corretor) =>
      corretor.nome.toLowerCase().includes(termo),
    );
  }, [corretores, busca]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="corretores-busca">Buscar por nome</Label>
          <Input
            id="corretores-busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-56"
          />
        </div>

        <label className="flex h-11 items-center gap-2 text-sm md:h-8">
          <Switch
            checked={mostrarInativos}
            onCheckedChange={setMostrarInativos}
          />
          Mostrar inativos
        </label>

        {status === "success" && (
          <p className="text-text-secondary text-sm">
            {filtrados.length} corretor{filtrados.length === 1 ? "" : "es"}
          </p>
        )}

        <Button
          type="button"
          className="ml-auto h-11 md:h-8"
          onClick={() => setNovoAberto(true)}
        >
          Novo corretor
        </Button>
      </section>

      {status === "pending" && (
        <div role="status" className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-muted h-16 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-feedback-error text-sm">
          {describeApiError(
            error,
            "Não foi possível carregar os corretores agora. Tente novamente em instantes.",
          )}
        </p>
      )}

      {status === "success" && filtrados.length === 0 && (
        <p className="text-text-secondary text-sm">
          Nenhum corretor encontrado.
        </p>
      )}

      {status === "success" && filtrados.length > 0 && (
        <ul className="flex flex-col gap-2">
          {filtrados.map((corretor) => (
            <CorretorLinha key={corretor.id} corretor={corretor} />
          ))}
        </ul>
      )}

      <CorretorFormulario
        open={novoAberto}
        onOpenChange={setNovoAberto}
        corretor={null}
      />
    </div>
  );
}
