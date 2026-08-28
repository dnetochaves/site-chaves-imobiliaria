import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // picsum.photos: usado pelas fotos de imóvel nos dados de seed/dev da API.
    // Fotos de imóveis cadastrados via /anunciar vêm de qualquer host (não há
    // upload de arquivo na API, o usuário cola a URL — ver add-list-property)
    // e usam <Image unoptimized> na galeria da página de detalhe pra não
    // depender dessa lista, então não precisam entrar aqui.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
