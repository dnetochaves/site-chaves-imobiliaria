import type { components } from "@/lib/api/generated/schema";

export type PropertyType = components["schemas"]["PropertyType"];

export const TIPO_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "cobertura", label: "Cobertura" },
  { value: "studio", label: "Studio" },
  { value: "kitnet", label: "Kitnet" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "outro", label: "Outro" },
];
