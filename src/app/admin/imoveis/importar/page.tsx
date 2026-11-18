"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListPropertyForm } from "@/app/anunciar/_components/ListPropertyForm";
import { EntradaTexto } from "@/app/admin/imoveis/importar/_components/EntradaTexto";
import { PainelRevisao } from "@/app/admin/imoveis/importar/_components/PainelRevisao";
import { useInterpretarTexto } from "@/lib/api/hooks/use-interpretar-texto";
import { describeInterpretacaoError } from "@/lib/interpretacao-errors";
import { useAuth } from "@/lib/auth/AuthContext";

export default function ImportarImovelPage() {
  const { login } = useAuth();
  const interpretar = useInterpretarTexto();
  const [texto, setTexto] = useState("");
  const [recursoIndisponivel, setRecursoIndisponivel] = useState(false);
  const [chave, setChave] = useState(0);
  const [cadastrado, setCadastrado] = useState(false);

  const resposta = interpretar.data;
  const erro = interpretar.isError
    ? describeInterpretacaoError(interpretar.error)
    : null;

  function handleInterpretar() {
    setCadastrado(false);
    interpretar.mutate(texto, {
      onSuccess: () => setChave((c) => c + 1),
      onError: (e) => {
        if (describeInterpretacaoError(e).desabilita) setRecursoIndisponivel(true);
      },
    });
  }

  function recomecar() {
    interpretar.reset();
    setTexto("");
    setCadastrado(false);
  }

  const voltar = (
    <Link
      href="/admin"
      className="text-brand-primary text-sm font-medium hover:underline"
    >
      ← Voltar à lista de imóveis
    </Link>
  );

  if (!resposta || interpretar.isPending) {
    return (
      <div className="flex flex-col gap-4">
        {voltar}
        <EntradaTexto
          texto={texto}
          onTextoChange={setTexto}
          onInterpretar={handleInterpretar}
          interpretando={interpretar.isPending}
          desabilitado={recursoIndisponivel}
          erro={erro}
          onLogin={login}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {voltar}

      {!cadastrado && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-text-primary text-lg font-semibold">
              Revisar proposta
            </h2>
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-8"
              onClick={() => interpretar.reset()}
            >
              Alterar o texto
            </Button>
          </div>
          <PainelRevisao resposta={resposta} />
        </>
      )}

      <ListPropertyForm
        key={chave}
        valoresIniciais={resposta.imovel}
        destaques={{
          ausentes: resposta.campos_ausentes,
          invalidos: resposta.campos_invalidos,
        }}
        aoCadastrar={() => setCadastrado(true)}
        sucesso={{
          href: (id) => `/admin/imoveis/${id}`,
          rotulo: "Abrir o imóvel no painel →",
          texto: "O imóvel foi cadastrado e está em análise.",
          acao: (
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-8"
              onClick={recomecar}
            >
              Cadastrar outro por texto
            </Button>
          ),
        }}
      />
    </div>
  );
}
