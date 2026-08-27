import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // picsum.photos: usado pelas fotos de imóvel nos dados de seed/dev da API.
    // TODO: adicionar aqui o host real de fotos usado em produção.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
