"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useImovelDetail,
  ImovelNaoEncontradoError,
} from "@/lib/api/hooks/use-imovel-detail";
import { PropertyGallery } from "@/app/imoveis/[imovelId]/_components/PropertyGallery";
import { PropertyPriceSidebar } from "@/app/imoveis/[imovelId]/_components/PropertyPriceSidebar";
import { FavoriteButton } from "@/app/imoveis/[imovelId]/_components/FavoriteButton";
import { ShareButton } from "@/app/imoveis/[imovelId]/_components/ShareButton";
import { getAmenidadeIcon } from "@/app/imoveis/[imovelId]/_components/amenidadeIcons";
import { MapView } from "@/components/map/MapView";
import { formatArea } from "@/lib/format";

export default function ImovelDetailPage() {
  const params = useParams<{ imovelId: string }>();
  const imovelId = Number(params.imovelId);

  const { status, data: imovel, error } = useImovelDetail(imovelId);

  if (Number.isNaN(imovelId) || (status === "error" && error instanceof ImovelNaoEncontradoError)) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-text-primary text-lg font-medium">
          Imóvel não encontrado.
        </p>
        <Link href="/busca" className="text-brand-primary text-sm font-medium hover:underline">
          Voltar pra busca
        </Link>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 py-8">
        <div className="bg-background-muted h-6 w-64 animate-pulse rounded" />
        <div className="bg-background-muted aspect-video w-full animate-pulse rounded-xl" />
        <div className="bg-background-muted h-32 w-full animate-pulse rounded-xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-feedback-error text-sm">
          Não foi possível carregar este imóvel agora. Tente novamente em
          instantes.
        </p>
      </div>
    );
  }

  const { unidade } = imovel;
  const latitude = Number(unidade.latitude);
  const longitude = Number(unidade.longitude);
  const hasCoordinates = !Number.isNaN(latitude) && !Number.isNaN(longitude);
  const endereco = `${unidade.rua}, ${unidade.numero}${unidade.complemento ? ` - ${unidade.complemento}` : ""}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-text-secondary flex items-center gap-1.5 text-sm">
        <Link href="/" className="hover:text-text-primary">
          {imovel.disponivel_aluguel ? "Alugar" : "Comprar"}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{unidade.cidade}</span>
        <span aria-hidden="true">/</span>
        <span>{unidade.bairro}</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{endereco}</span>
      </nav>

      <PropertyGallery fotos={imovel.fotos} title={imovel.titulo} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="flex flex-col gap-2">
            <p className="text-brand-secondary text-xs font-semibold tracking-wide uppercase">
              {unidade.bairro} · {unidade.cidade}
            </p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-text-primary text-2xl font-semibold">
                {imovel.titulo}
              </h1>
              <div className="flex shrink-0 gap-2">
                <ShareButton title={imovel.titulo} />
                <FavoriteButton unidade={unidade} />
              </div>
            </div>
            <p className="text-text-secondary text-sm">{endereco}</p>

            <div className="border-border-default text-text-primary mt-2 flex items-center gap-6 border-t border-b py-4 text-sm">
              <div>
                <p className="font-semibold">{formatArea(unidade.area_util_m2)}</p>
                <p className="text-text-secondary text-xs">área útil</p>
              </div>
              <div>
                <p className="font-semibold">{unidade.quartos}</p>
                <p className="text-text-secondary text-xs">
                  quarto{unidade.quartos === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <p className="font-semibold">{unidade.banheiros}</p>
                <p className="text-text-secondary text-xs">
                  banheiro{unidade.banheiros === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <p className="font-semibold">{unidade.vagas_garagem}</p>
                <p className="text-text-secondary text-xs">
                  vaga{unidade.vagas_garagem === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-text-primary text-lg font-semibold">
              Sobre o imóvel
            </h2>
            <p className="text-text-secondary text-sm">{imovel.descricao}</p>
          </div>

          {imovel.amenidades.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-text-primary text-lg font-semibold">
                Características
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {imovel.amenidades.map((amenidade) => {
                  const Icon = getAmenidadeIcon(amenidade.icone);
                  return (
                    <div
                      key={amenidade.id}
                      className="text-text-secondary flex items-center gap-2 text-sm"
                    >
                      <Icon className="text-brand-primary size-4 shrink-0" aria-hidden="true" />
                      {amenidade.nome}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasCoordinates && (
            <div className="flex flex-col gap-3">
              <h2 className="text-text-primary text-lg font-semibold">
                Onde fica
              </h2>
              <MapView
                center={[longitude, latitude]}
                zoom={15}
                markers={[{ id: unidade.id, center: [longitude, latitude] }]}
                className="bg-background-muted h-64 w-full rounded-xl"
              />
            </div>
          )}
        </div>

        <PropertyPriceSidebar imovel={imovel} />
      </div>
    </div>
  );
}
