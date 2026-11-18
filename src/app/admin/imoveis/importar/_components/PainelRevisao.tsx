import { AlertTriangle, Info } from "lucide-react";
import type { components } from "@/lib/api/generated/schema";
import { severidadeDoAviso } from "@/lib/interpretacao-errors";

type Resposta = components["schemas"]["InterpretationResponse"];

const ROTULO_CAMPO: Record<string, string> = {
  rua: "Rua",
  numero: "Número",
  complemento: "Complemento",
  bairro: "Bairro",
  cidade: "Cidade",
  estado: "Estado",
  cep: "CEP",
  area_util_m2: "Área útil",
  quartos: "Quartos",
  banheiros: "Banheiros",
  vagas_garagem: "Vagas",
  tipo: "Tipo do imóvel",
  titulo: "Título",
  descricao: "Descrição",
  disponivel_aluguel: "Aluguel",
  disponivel_venda: "Venda",
  valor_aluguel: "Valor do aluguel",
  valor_condominio: "Condomínio",
  valor_iptu: "IPTU",
  valor_seguro_incendio: "Seguro incêndio",
  valor_venda: "Valor de venda",
  codigo: "Código interno",
  observacoes: "Observações",
};

const nomeDoCampo = (campo: string) => ROTULO_CAMPO[campo] ?? campo;

export function PainelRevisao({ resposta }: { resposta: Resposta }) {
  const { avisos, campos_ausentes, campos_invalidos } = resposta;
  const reconhecidas = resposta.imovel.amenidade_ids?.length ?? 0;
  const { condominio, condominios_candidatos: candidatos } = resposta;

  return (
    <section aria-label="Revisão da proposta" className="flex flex-col gap-3">
      <p className="bg-brand-secondary-subtle text-text-primary rounded-md p-3 text-sm">
        Revise a proposta abaixo e corrija o que for preciso.{" "}
        <strong>Nada foi cadastrado ainda</strong>: o imóvel só é salvo quando
        você confirmar no fim do formulário.
      </p>

      {campos_ausentes.length > 0 && (
        <p className="text-feedback-error text-sm">
          O texto não trouxe, e você precisa preencher:{" "}
          {campos_ausentes.map(nomeDoCampo).join(", ")}.
        </p>
      )}
      {campos_invalidos.length > 0 && (
        <p className="text-feedback-error text-sm">
          Valores que precisam de correção:{" "}
          {campos_invalidos.map(nomeDoCampo).join(", ")}.
        </p>
      )}

      {avisos.length > 0 && (
        <ul aria-label="Avisos da interpretação" className="flex flex-col gap-2">
          {avisos.map((aviso, indice) => {
            const alta = severidadeDoAviso(aviso.codigo) === "alta";
            const Icone = alta ? AlertTriangle : Info;
            return (
              <li
                key={`${aviso.codigo}-${indice}`}
                data-severidade={alta ? "alta" : "normal"}
                className={
                  alta
                    ? "border-feedback-error text-text-primary flex gap-2 rounded-md border-2 p-3 text-sm font-medium"
                    : "border-border-default text-text-secondary flex gap-2 rounded-md border p-3 text-sm"
                }
              >
                <Icone
                  className={
                    alta
                      ? "text-feedback-error mt-0.5 size-4 shrink-0"
                      : "mt-0.5 size-4 shrink-0"
                  }
                  aria-hidden="true"
                />
                <span>{aviso.mensagem}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="text-text-secondary flex flex-col gap-1 text-sm">
        <p>
          {reconhecidas === 0
            ? "Nenhuma amenidade reconhecida."
            : `${reconhecidas} amenidade${reconhecidas === 1 ? "" : "s"} reconhecida${reconhecidas === 1 ? "" : "s"} e ${reconhecidas === 1 ? "incluída" : "incluídas"} no cadastro.`}
        </p>
        {resposta.amenidades_nao_mapeadas.length > 0 && (
          <p>
            Não encontradas no catálogo (ficam apenas na descrição):{" "}
            {resposta.amenidades_nao_mapeadas.join(", ")}.
          </p>
        )}
      </div>

      {(condominio || candidatos.length > 0 || resposta.nome_condominio_no_texto) && (
        <div className="text-text-secondary flex flex-col gap-1 text-sm">
          {resposta.nome_condominio_no_texto && (
            <p>Condomínio citado no texto: {resposta.nome_condominio_no_texto}.</p>
          )}
          {condominio && (
            <p>
              Condomínio cadastrado correspondente: {condominio.nome} (
              {condominio.bairro} · {condominio.cidade}).
            </p>
          )}
          {candidatos.length > 0 && (
            <p>
              Possíveis condomínios:{" "}
              {candidatos
                .map((c) => `${c.nome} (${c.bairro} · ${c.cidade})`)
                .join("; ")}
              .
            </p>
          )}
          <p className="text-xs">
            Informativo: o imóvel não é vinculado a nenhum condomínio por esta
            tela.
          </p>
        </div>
      )}
    </section>
  );
}
