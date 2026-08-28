"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapView } from "@/components/map/MapView";
import {
  useGeocodeAddress,
  type GeocodeResult,
} from "@/lib/api/hooks/use-geocode-address";
import { useCreateImovel } from "@/lib/api/hooks/use-create-imovel";

function addressKey(fields: {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}): string {
  return `${fields.rua.trim()}|${fields.numero.trim()}|${fields.bairro.trim()}|${fields.cidade.trim()}`.toLowerCase();
}

export function ListPropertyForm() {
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const [areaUtilM2, setAreaUtilM2] = useState("");
  const [quartos, setQuartos] = useState("0");
  const [banheiros, setBanheiros] = useState("0");
  const [vagasGaragem, setVagasGaragem] = useState("0");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [disponivelAluguel, setDisponivelAluguel] = useState(false);
  const [disponivelVenda, setDisponivelVenda] = useState(false);
  const [mobiliado, setMobiliado] = useState(false);
  const [aceitaPets, setAceitaPets] = useState(false);

  const [valorAluguel, setValorAluguel] = useState("");
  const [valorCondominio, setValorCondominio] = useState("");
  const [valorIptu, setValorIptu] = useState("");
  const [valorSeguroIncendio, setValorSeguroIncendio] = useState("");
  const [valorVenda, setValorVenda] = useState("");

  const [fotoUrlsText, setFotoUrlsText] = useState("");

  const [geocodedKey, setGeocodedKey] = useState<string | null>(null);
  const [confirmedGeocode, setConfirmedGeocode] = useState<{
    result: GeocodeResult;
    key: string;
  } | null>(null);
  const [operationError, setOperationError] = useState(false);

  const geocode = useGeocodeAddress();
  const createImovel = useCreateImovel();

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

    if (!isGeocodeConfirmed || !confirmedGeocode) return;

    const fotoUrls = fotoUrlsText
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter(Boolean);

    createImovel.mutate({
      rua,
      numero,
      complemento: complemento || undefined,
      bairro,
      cidade,
      estado,
      cep,
      latitude: confirmedGeocode.result.latitude,
      longitude: confirmedGeocode.result.longitude,
      area_util_m2: areaUtilM2,
      quartos: Number(quartos) || 0,
      banheiros: Number(banheiros) || 0,
      vagas_garagem: Number(vagasGaragem) || 0,
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
    });
  }

  if (createImovel.isSuccess && createImovel.data) {
    return (
      <div className="border-border-default bg-background-default flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
        <p className="text-text-primary text-lg font-semibold">
          Imóvel cadastrado com sucesso!
        </p>
        <Link
          href={`/imoveis/${createImovel.data.id}`}
          className="text-brand-primary text-sm font-medium hover:underline"
        >
          Ver o anúncio →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-lg font-semibold">Endereço</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rua">Rua</Label>
            <Input
              id="rua"
              required
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              required
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="complemento">Complemento (opcional)</Label>
          <Input
            id="complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              required
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="estado">Estado (UF)</Label>
            <Input
              id="estado"
              required
              maxLength={2}
              placeholder="SP"
              value={estado}
              onChange={(e) => setEstado(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            required
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
            disabled={!rua || !numero || !bairro || !cidade}
          >
            Buscar endereço
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
            <Label htmlFor="area">Área útil (m²)</Label>
            <Input
              id="area"
              required
              type="number"
              min="0"
              value={areaUtilM2}
              onChange={(e) => setAreaUtilM2(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quartos">Quartos</Label>
            <Input
              id="quartos"
              type="number"
              min="0"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="banheiros">Banheiros</Label>
            <Input
              id="banheiros"
              type="number"
              min="0"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vagas">Vagas</Label>
            <Input
              id="vagas"
              type="number"
              min="0"
              value={vagasGaragem}
              onChange={(e) => setVagasGaragem(e.target.value)}
            />
          </div>
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
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            required
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
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

        {operationError && (
          <p className="text-feedback-error text-sm">
            Escolha pelo menos um tipo de operação (aluguel ou venda).
          </p>
        )}

        {disponivelAluguel && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorAluguel">Aluguel (R$)</Label>
              <Input
                id="valorAluguel"
                type="number"
                min="0"
                value={valorAluguel}
                onChange={(e) => setValorAluguel(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorCondominio">Condomínio (R$)</Label>
              <Input
                id="valorCondominio"
                type="number"
                min="0"
                value={valorCondominio}
                onChange={(e) => setValorCondominio(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorIptu">IPTU (R$)</Label>
              <Input
                id="valorIptu"
                type="number"
                min="0"
                value={valorIptu}
                onChange={(e) => setValorIptu(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valorSeguro">Seguro incêndio (R$)</Label>
              <Input
                id="valorSeguro"
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
            <Label htmlFor="valorVenda">Valor de venda (R$)</Label>
            <Input
              id="valorVenda"
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

      {createImovel.isError && (
        <p className="text-feedback-error text-sm">
          Não foi possível cadastrar o imóvel agora. Tente novamente.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          loading={createImovel.isPending}
          disabled={!isGeocodeConfirmed}
        >
          Cadastrar imóvel
        </Button>
        {!isGeocodeConfirmed && (
          <p className="text-text-secondary text-xs">
            Busque e confirme o endereço antes de enviar.
          </p>
        )}
      </div>
    </form>
  );
}
