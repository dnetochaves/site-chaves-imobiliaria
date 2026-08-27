import {
  Wifi,
  Car,
  PawPrint,
  Dumbbell,
  Waves,
  ShieldCheck,
  Sofa,
  Sun,
  TreePine,
  Bike,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapeamento best-effort de `AmenidadeRead.icone` (string livre da API) pra
 * um ícone real. Sem correspondência (incluindo `icone: null`, o caso atual
 * dos dados de seed), cai no ícone genérico.
 */
const AMENIDADE_ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  garagem: Car,
  estacionamento: Car,
  pet: PawPrint,
  pets: PawPrint,
  academia: Dumbbell,
  piscina: Waves,
  seguranca: ShieldCheck,
  portaria: ShieldCheck,
  mobiliado: Sofa,
  sol: Sun,
  varanda: TreePine,
  bicicletario: Bike,
};

export function getAmenidadeIcon(icone: string | null): LucideIcon {
  if (!icone) return Sparkles;
  return AMENIDADE_ICON_MAP[icone.toLowerCase()] ?? Sparkles;
}
