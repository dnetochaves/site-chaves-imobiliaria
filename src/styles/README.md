# styles

Fonte única de verdade dos design tokens (Ciclo 01/02 do Design System, ver `design_system/`).

- `tokens.css` — tokens como CSS custom properties, consumidos pelo tema do Tailwind.
- `tokens.ts` — os mesmos valores em TypeScript, para uso fora do Tailwind (ex.: estilo de camadas do MapLibre).

Qualquer atualização de cor/spacing/radius/etc deve ser feita nesses dois arquivos em conjunto — nunca hardcode um valor de token direto em um componente.
