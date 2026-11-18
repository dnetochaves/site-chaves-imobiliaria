"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapView } from "@/components/map/MapView";
import {
  useGeocodeAddress,
  type GeocodeResult,
} from "@/lib/api/hooks/use-geocode-address";
import { useCreateImovel } from "@/lib/api/hooks/use-create-imovel";
import { ApiError, describeApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/AuthContext";
import { TIPO_OPTIONS, type PropertyType } from "@/lib/property-types";
import type { components } from "@/lib/api/generated/schema";
import { cn } from "@/lib/utils";
import { MENSAGEM_UNIDADE_ATIVA } from "@/lib/imovel-errors";

export type RascunhoImovel = components["schemas"]["ImovelSubmissionDraft"];

/** Nomes dos campos da API que a interpretação marcou como ausentes ou inválidos. */
export type DestaquesCampos = { ausentes: string[]; invalidos: string[] };

export type SucessoCadastro = {
  href: (id: number) => string;
  rotulo: string;
  texto?: string;
  acao?: ReactNode;
};

/** Campo da API -> id do input no formulário. */
const ID_DO_CAMPO: Record<string, string> = {
  rua: "rua",
  numero: "numero",
  complemento: "complemento",
  bairro: "bairro",
  cidade: "cidade",
  estado: "estado",
  cep: "cep",
  area_util_m2: "area",
  quartos: "quartos",
  banheiros: "banheiros",
  vagas_garagem: "vagas",
  tipo: "tipo",
  titulo: "titulo",
  descricao: "descricao",
  valor_aluguel: "valorAluguel",
  valor_condominio: "valorCondominio",
  valor_iptu: "valorIptu",
  valor_seguro_incendio: "valorSeguro",
  valor_venda: "valorVenda",
  codigo: "codigo",
  observacoes: "observacoes",
};

const texto = (v: string | null | undefined) => v ?? "";
const numStr = (v: number | null | undefined, padrao: string) =>
  v === null || v === undefined ? padrao : String(v);

function addressKey(fields: {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}): string {
  return `${fields.rua.trim()}|${fields.numero.trim()}|${fields.bairro.trim()}|${fields.cidade.trim()}`.toLowerCase();
}

export function ListPropertyForm({
  valoresIniciais,
  destaques,
  sucesso,
  aoCadastrar,
}: {
  valoresIniciais?: RascunhoImovel;
  destaques?: DestaquesCampos;
  sucesso?: SucessoCadastro;
  aoCadastrar?: () => void;
} = {}) {
  const inicial = valoresIniciais;
  const [rua, setRua] = useState(texto(inicial?.rua));
  const [numero, setNumero] = useState(texto(inicial?.numero));
  const [complemento, setComplemento] = useState(texto(inicial?.complemento));
  const [bairro, setBairro] = useState(texto(inicial?.bairro));
  const [cidade, setCidade] = useState(texto(inicial?.cidade));
  const [estado, setEstado] = useState(texto(inicial?.estado));
  const [cep, setCep] = useState(texto(inicial?.cep));
  const [observacoes, setObservacoes] = useState(texto(inicial?.observacoes));
  const [codigo, setCodigo] = useState(texto(inicial?.codigo));

  const [areaUtilM2, setAreaUtilM2] = useState(texto(inicial?.area_util_m2));
  const [quartos, setQuartos] = useState(numStr(inicial?.quartos, "0"));
  const [banheiros, setBanheiros] = useState(numStr(inicial?.banheiros, "0"));
  const [vagasGaragem, setVagasGaragem] = useState(numStr(inicial?.vagas_garagem, "0"));
  const [tipo, setTipo] = useState<string>(inicial?.tipo ?? "");

  const [titulo, setTitulo] = useState(texto(inicial?.titulo));
  const [descricao, setDescricao] = useState(texto(inicial?.descricao));

  const [disponivelAluguel, setDisponivelAluguel] = useState(inicial?.disponivel_aluguel === true);
  const [disponivelVenda, setDisponivelVenda] = useState(inicial?.disponivel_venda === true);
  const [mobiliado, setMobiliado] = useState(inicial?.mobiliado === true);
  const [aceitaPets, setAceitaPets] = useState(inicial?.aceita_pets === true);

  const [valorAluguel, setValorAluguel] = useState(texto(inicial?.valor_aluguel));
  const [valorCondominio, setValorCondominio] = useState(texto(inicial?.valor_condominio));
  const [valorIptu, setValorIptu] = useState(texto(inicial?.valor_iptu));
  const [valorSeguroIncendio, setValorSeguroIncendio] = useState(texto(inicial?.valor_seguro_incendio));
  const [valorVenda, setValorVenda] = useState(texto(inicial?.valor_venda));

  const [fotoUrlsText, setFotoUrlsText] = useState((inicial?.foto_urls ?? []).join("\n"));

  const [geocodedKey, setGeocodedKey] = useState<string | null>(null);
  const [confirmedGeocode, setConfirmedGeocode] = useState<{
    result: GeocodeResult;
    key: string;
  } | null>(null);
  const [operationError, setOperationError] = useState(false);

  const amenidadeIds = inicial?.amenidade_ids ?? [];
  const { user } = useAuth();
  const geocode = useGeocodeAddress();
  const createImovel = useCreateImovel();

  const codigoEmUso =
    createImovel.error instanceof ApiError &&
    createImovel.error.code === "codigo_ja_em_uso";
  const idsAusentes = new Set((destaques?.ausentes ?? []).map((c) => ID_DO_CAMPO[c]).filter(Boolean));
  const idsInvalidos = new Set((destaques?.invalidos ?? []).map((c) => ID_DO_CAMPO[c]).filter(Boolean));
  const marca = (id: string) => idsAusentes.has(id) || idsInvalidos.has(id);
  const rotulo = (id: string) => cn(marca(id) && "text-feedback-error");
  const operacaoDestacada = [...(destaques?.ausentes ?? []), ...(destaques?.invalidos ?? [])].some(
    (c) => c === "disponivel_aluguel" || c === "disponivel_venda",
  );
  const unidadeComAnuncioAtivo =
    createImovel.error instanceof ApiError &&
    createImovel.error.code === "unidade_ja_tem_anuncio_ativo";
  const currentKey = addressKey({ rua, numero, bairro, cidade });
  const isGeocodeConfirmed = confirmedGeocode?.key === currentKey;
  const showGeocodeResult = geocodedKey === currentKey;

  function handleSearchAddress() {
    setConfirmedGeocode(null);
    const searchKey = currentKey;
    const fullAddress = [rua, numero, bairro, cidade, estado, cep]
      .filter(Boolean)
      .join(", ");
    geocode.mutate(fullAddress, {
      onSuccess: () => setGeocodedKey(searchKey),
    });
  }

  function handleConfirmGeocode() {
    if (!geocode.data) return;
    setConfirmedGeocode({ result: geocode.data, key: currentKey });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!disponivelAluguel && !disponivelVenda) {
      setOperationError(true);
      return;
    }
    setOperationError(false);

    const fotoUrls = fotoUrlsText
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter(Boolean);

    createImovel.mutate({
      // Campo vazio conta como não informado; só bairro, cidade e estado são o mínimo.
      rua: rua.trim() || undefined,
      numero: numero.trim() || undefined,
      complemento: complemento.trim() || undefined,
      bairro,
      cidade,
      estado,
      cep: cep.trim() || undefined,
      latitude: isGeocodeConfirmed ? confirmedGeocode?.result.latitude : undefined,
      longitude: isGeocodeConfirmed ? confirmedGeocode?.result.longitude : undefined,
      area_util_m2: areaUtilM2,
      quartos: Number(quartos) || 0,
      banheiros: Number(banheiros) || 0,
      vagas_garagem: Number(vagasGaragem) || 0,
      tipo: (tipo as PropertyType) || undefined,
      titulo,
      descricao,
      disponivel_aluguel: disponivelAluguel,
      disponivel_venda: disponivelVenda,
      mobiliado,
      aceita_pets: aceitaPets,
      valor_aluguel:
        disponivelAluguel && valorAluguel ? valorAluguel : undefined,
      valor_condominio:
        disponivelAluguel && valorCondominio ? valorCondominio : undefined,
      valor_iptu: disponivelAluguel && valorIptu ? valorIptu : undefined,
      valor_seguro_incendio:
        disponivelAluguel && valorSeguroIncendio
          ? valorSeguroIncendio
          : undefined,
      valor_venda: disponivelVenda && valorVenda ? valorVenda : undefined,
      foto_urls: fotoUrls.length > 0 ? fotoUrls : undefined,
      observacoes: observacoes.trim() || undefined,
      codigo: user?.is_staff ? codigo.trim() || undefined : undefined,
      amenidade_ids: amenidadeIds.length > 0 ? amenidadeIds : undefined,
    }, { onSuccess: () => aoCadastrar?.() });
  }

  if (createImovel.isSuccess && createImovel.data) {
    return (
      <div className="border-border-default bg-background-default flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
        <p className="text-text-primary text-lg font-semibold">
          Imóvel cadastrado com sucesso!
        </p>
        {sucesso?.texto && (
          <p className="text-text-secondary text-sm">{sucesso.texto}</p>
        )}
        <Link
          href={
            sucesso
              ? sucesso.href(createImovel.data.id)
              : `/imoveis/${createImovel.data.id}`
          }
          className="text-brand-primary text-sm font-medium hover:underline"
        >
          {sucesso?.rotulo ?? "Ver o anúncio →"}
        </Link>
        {sucesso?.acao}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-lg font-semibold">
          Localização
        </h2>
        <p className="text-text-secondary text-sm">
          No site aparecem apenas o bairro e a cidade. Rua, número e CEP são
          opcionais e ficam visíveis só para a equipe e para quem tem visita
          agendada.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rua" className={rotulo("rua")}>Rua (opcional)</Label>
            <Input
              id="rua"
aria-invalid={marca("rua")}
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="numero" className={rotulo("numero")}>Número (opcional)</Label>
            <Input
              id="numero"
aria-invalid={marca("numero")}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="complemento" className={rotulo("complemento")}>Complemento (opcional)</Label>
          <Input
            id="complemento"
aria-invalid={marca("complemento")}
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bairro" className={rotulo("bairro")}>Bairro</Label>
            <Input
              id="bairro"
aria-invalid={marca("bairro")}
              required
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cidade" className={rotulo("cidade")}>Cidade</Label>
            <Input
              id="cidade"
aria-invalid={marca("cidade")}
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="estado" className={rotulo("estado")}>Estado (UF)</Label>
            <Input
              id="estado"
aria-invalid={marca("estado")}
              required
              maxLength={2}
              placeholder="SP"
              value={estado}
              onChange={(e) => setEstado(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cep" className={rotulo("cep")}>CEP (opcional)</Label>
          <Input
            id="cep"
aria-invalid={marca("cep")}
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSearchAddress}
            loading={geocode.isPending}
            disabled={!rua.trim() || !numero.trim() || !bairro || !cidade}
          >
            Buscar endereço no mapa (opcional)
          </Button>

          {showGeocodeResult && geocode.isSuccess && geocode.data === null && (
            <p className="text-feedback-error text-sm">
              Não conseguimos localizar esse endereço. Confira os dados e
              tente de novo.
            </p>
          )}

          {geocode.isError && (
            <p className="text-feedback-error text-sm">
              Não foi possível buscar o endereço agora. Tente de novo.
            </p>
          )}

          {showGeocodeResult && geocode.data && !isGeocodeConfirmed && (
            <div className="border-border-default flex flex-col gap-2 rounded-lg border p-3">
              <p className="text-text-secondary text-sm">
                {geocode.data.displayName}
              </p>
              <MapView
                center={[
                  Number(geocode.data.longitude),
                  Number(geocode.data.latitude),
                ]}
                zoom={15}
                markers={[
                  {
                    id: "preview",
                    center: [
                      Number(geocode.data.longitude),
                      Number(geocode.data.latitude),
                    ],
                  },
                ]}
                className="h-48 w-full rounded-lg"
              />
              <Button type="button" size="sm" onClick={handleConfirmGeocode}>
                Confirmar esse endereço
              </Button>
            </div>
          )}

          {isGeocodeConfirmed && confirmedGeocode && (
            <div className="border-border-default bg-brand-primary-subtle flex flex-col gap-2 rounded-lg border p-3">
              <p className="text-text-primary text-sm font-medium">
                Endereço confirmado: {confirmedGeocode.result.displayName}
              </p>
              <MapView
                center={[
                  Number(confirmedGeocode.result.longitude),
                  Number(confirmedGeocode.result.latitude),
                ]}
                zoom={15}
                markers={[
                  {
                    id: "preview",
                    center: [
                      Number(confirmedGeocode.result.longitude),
                      Number(confirmedGeocode.result.latitude),
                    ],
                  },
                ]}
                className="h-48 w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-lg font-semibold">
          Características
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="area" className={rotulo("area")}>Área útil (m²)</Label>
            <Input
              id="area"
aria-invalid={marca("area")}
              required
              type="number"
              min="0"
              value={areaUtilM2}
              onChange={(e) => setAreaUtilM2(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quartos" className={rotulo("quartos")}>Quartos</Label>
            <Input
              id="quartos"
aria-invalid={marca("quartos")}
              type="number"
              min="0"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="banheiros" className={rotulo("banheiros")}>Banheiros</Label>
            <Input
              id="banheiros"
aria-invalid={marca("banheiros")}
              type="number"
              min="0"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vagas" className={rotulo("vagas")}>Vagas</Label>
            <Input
              id="vagas"
aria-invalid={marca("vagas")}
              type="number"
              min="0"
              value={vagasGaragem}
              onChange={(e) => setVagasGaragem(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:w-60">
          <Label htmlFor="tipo" className={rotulo("tipo")}>Tipo de imóvel (opcional)</Label>
          <Select value={tipo || "nao-especificado"} onValueChange={(value) => setTipo(value === "nao-especificado" ? "" : value)}>
            <SelectTrigger id="tipo" aria-invalid={marca("tipo")}>
              <SelectValue placeholder="Não especificado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nao-especificado">Não especificado</SelectItem>
              {TIPO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="text-text-primary flex items-center gap-2 text-sm">
            <Checkbox
              checked={mobiliado}
              onCheckedChange={(v) => setMobiliado(v === true)}
            />
            Mobiliado
          </label>
          <label className="text-text-primary flex items-center gap-2 text-sm">
            <Checkbox
              checked={aceitaPets}
              onCheckedChange={(v) => setAceitaPets(v === true)}
            />
            Aceita pets
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-lg font-semibold">
          Título e descrição
        </h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="titulo" className={rotulo("titulo")}>Título</Label>
          <Input
            id="titulo"
aria-invalid={marca("titulo")}
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="descricao" className={rotulo("descricao")}>Descrição</Label>
          <Textarea
            id="descricao"
aria-invalid={marca("descricao")}
            required
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="observacoes" className={rotulo("observacoes")}>Observações (opcional)</Label>
          <Textarea
            id="observacoes"
aria-invalid={marca("observacoes")}
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
          <p className="text-text-secondary text-xs">
            Nota exibida na página do imóvel.
          </p>
        </div>
        {user?.is_staff && (
          <div className="flex flex-col gap-1.5 sm:w-60">
            <Label htmlFor="codigo" className={rotulo("codigo")}>Código interno (opcional)</Label>
            <Input
              id="codigo"
aria-invalid={marca("codigo") || codigoEmUso}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            {codigoEmUso && (
              <p className="text-feedback-error text-sm">
                Esse código já está em uso por outro anúncio ativo.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-lg font-semibold">
          Tipo de operação e valores
        </h2>

        <div className="flex flex-wrap gap-4">
          <label className="text-text-primary flex items-center gap-2 text-sm">
            <Checkbox
              checked={disponivelAluguel}
              onCheckedChange={(v) => setDisponivelAluguel(v === true)}
            />
            Disponível para aluguel
          </label>
          <label className="text-text-primary flex items-center gap-2 text-sm">
            <Checkbox
              checked={disponivelVenda}
              onCheckedChange={(v) => setDisponivelVenda(v === true)}
            />
            Disponível para venda
          </label>
        </div>

        {operacaoDestacada && !disponivelAluguel && !disponivelVenda && (
          <p className="text-feedback-error text-sm">
            O texto não indicou se é aluguel ou venda. Escolha uma opção.
          </p>
        )}

        {operationError && (
          <p className="text-feedback-error text-sm">
            Escolha pelo menos um tipo de operação (aluguel ou venda).
          </p>
        )}

        {disponivelAluguel && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorAluguel" className={rotulo("valorAluguel")}>Aluguel (R$)</Label>
              <Input
                id="valorAluguel"
aria-invalid={marca("valorAluguel")}
                type="number"
                min="0"
                value={valorAluguel}
                onChange={(e) => setValorAluguel(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorCondominio" className={rotulo("valorCondominio")}>Condomínio (R$)</Label>
              <Input
                id="valorCondominio"
aria-invalid={marca("valorCondominio")}
                type="number"
                min="0"
                value={valorCondominio}
                onChange={(e) => setValorCondominio(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorIptu" className={rotulo("valorIptu")}>IPTU (R$)</Label>
              <Input
                id="valorIptu"
aria-invalid={marca("valorIptu")}
                type="number"
                min="0"
                value={valorIptu}
                onChange={(e) => setValorIptu(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorSeguro" className={rotulo("valorSeguro")}>Seguro incêndio (R$, opcional)</Label>
              <Input
                id="valorSeguro"
aria-invalid={marca("valorSeguro")}
                type="number"
                min="0"
                value={valorSeguroIncendio}
                onChange={(e) => setValorSeguroIncendio(e.target.value)}
              />
            </div>
          </div>
        )}

        {disponivelVenda && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="valorVenda" className={rotulo("valorVenda")}>Valor de venda (R$)</Label>
            <Input
              id="valorVenda"
aria-invalid={marca("valorVenda")}
              type="number"
              min="0"
              value={valorVenda}
              onChange={(e) => setValorVenda(e.target.value)}
            />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-text-primary text-lg font-semibold">
          Fotos (opcional)
        </h2>
        <Label htmlFor="fotos">
          URLs de fotos já hospedadas, uma por linha
        </Label>
        <Textarea
          id="fotos"
          rows={3}
          placeholder="https://..."
          value={fotoUrlsText}
          onChange={(e) => setFotoUrlsText(e.target.value)}
        />
      </section>

      {createImovel.isError && !codigoEmUso && (
        <p className="text-feedback-error text-sm">
          {unidadeComAnuncioAtivo
            ? MENSAGEM_UNIDADE_ATIVA
            : describeApiError(
                createImovel.error,
                "Não foi possível cadastrar o imóvel agora. Tente novamente.",
                { showValidationDetails: true },
              )}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="h-11 md:h-8"
          loading={createImovel.isPending}
        >
          Cadastrar imóvel
        </Button>
      </div>
    </form>
  );
}
