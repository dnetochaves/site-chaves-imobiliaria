"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIMITE_TEXTO_INTERPRETACAO } from "@/lib/api/hooks/use-interpretar-texto";
import type { InterpretacaoErro } from "@/lib/interpretacao-errors";

export function EntradaTexto({
  texto,
  onTextoChange,
  onInterpretar,
  interpretando,
  desabilitado,
  erro,
  onLogin,
}: {
  texto: string;
  onTextoChange: (valor: string) => void;
  onInterpretar: () => void;
  interpretando: boolean;
  /** Recurso indisponível neste ambiente (IA não configurada). */
  desabilitado: boolean;
  erro: InterpretacaoErro | null;
  onLogin: () => void;
}) {
  const total = texto.length;
  const acimaDoLimite = total > LIMITE_TEXTO_INTERPRETACAO;
  const podeInterpretar =
    texto.trim().length > 0 && !acimaDoLimite && !interpretando && !desabilitado;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-text-primary text-lg font-semibold">
          Cadastrar imóvel por texto
        </h2>
        <p className="text-text-secondary text-sm">
          Cole a mensagem do anúncio (por exemplo, do WhatsApp). Você vai
          revisar e corrigir a proposta antes de salvar — nada é cadastrado
          automaticamente.
        </p>
      </div>

      <p className="bg-background-muted text-text-secondary rounded-md p-3 text-xs">
        O texto é enviado a um serviço de inteligência artificial de terceiros.
        Telefone, e-mail, CPF e CNPJ são mascarados antes do envio, mas{" "}
        <strong>nomes de pessoas não são</strong>: evite colar nomes de
        proprietários.
      </p>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (podeInterpretar) onInterpretar();
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="texto-anuncio">Texto do anúncio</Label>
          <Textarea
            id="texto-anuncio"
            rows={12}
            value={texto}
            disabled={interpretando}
            aria-invalid={acimaDoLimite || erro?.noCampo === true}
            aria-describedby="texto-contador"
            onChange={(e) => onTextoChange(e.target.value)}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              id="texto-contador"
              className={
                acimaDoLimite
                  ? "text-feedback-error text-xs"
                  : "text-text-secondary text-xs"
              }
            >
              {total}/{LIMITE_TEXTO_INTERPRETACAO}
              {acimaDoLimite &&
                ` — ${total - LIMITE_TEXTO_INTERPRETACAO} ${total - LIMITE_TEXTO_INTERPRETACAO === 1 ? "caractere acima" : "caracteres acima"} do limite`}
            </span>
            {erro?.noCampo && (
              <span className="text-feedback-error text-xs">
                {erro.mensagem}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            className="h-11 md:h-8"
            disabled={!podeInterpretar}
            loading={interpretando}
          >
            Interpretar
          </Button>
          <Link
            href="/anunciar"
            className="text-brand-primary text-sm font-medium hover:underline"
          >
            Cadastrar manualmente
          </Link>
        </div>
      </form>

      {interpretando && (
        <p role="status" className="text-text-secondary text-sm">
          Interpretando o texto… isso pode levar até 1 minuto.
        </p>
      )}

      {erro && !erro.noCampo && (
        <div role="alert" className="flex flex-col gap-2">
          <p className="text-feedback-error text-sm">{erro.mensagem}</p>
          {erro.login && (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-fit md:h-8"
              onClick={onLogin}
            >
              Entrar novamente
            </Button>
          )}
          <Link
            href="/anunciar"
            className="text-brand-primary w-fit text-sm font-medium hover:underline"
          >
            Cadastrar manualmente
          </Link>
        </div>
      )}
    </section>
  );
}
