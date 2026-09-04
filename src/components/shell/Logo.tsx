import Link from "next/link";

// Logo oficial da marca (fonte: public/logo-svg/logo-principal/logo-principal-positiva.svg).
// Incorporado inline (não via <img src="...">) porque um SVG carregado como
// imagem fica isolado do CSS da página e não herda as fontes carregadas via
// next/font — o texto renderizaria com a fonte de fallback do sistema em vez
// de Plus Jakarta Sans / IBM Plex Mono. Ver design.md do change
// use-official-brand-logo.
export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <svg
        viewBox="0 0 161 60"
        width={161}
        height={60}
        className="h-10 w-auto"
        role="img"
        aria-label="Chaves Imobiliária"
      >
        <g transform="translate(6 6)">
          <path
            d="M38.1421 9.8579A20 20 0 1 0 38.1421 38.1421L32.4853 32.4853A12 12 0 1 1 32.4853 15.5147Z"
            fill="var(--color-brand-primary)"
          />
          <path d="M24 20H44V28H24Z" fill="var(--color-brand-secondary)" />
        </g>
        <text
          x="69"
          y="34.8"
          fontFamily="var(--font-sans)"
          fontSize="26"
          fontWeight="700"
          letterSpacing="-0.78"
          fill="var(--color-brand-primary)"
        >
          chaves
        </text>
        <text
          x="70"
          y="50"
          fontFamily="var(--font-mono)"
          fontSize="8.2"
          letterSpacing="2.46"
          fill="var(--color-text-muted)"
        >
          imobiliária
        </text>
      </svg>
    </Link>
  );
}
