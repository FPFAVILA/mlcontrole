/**
 * Precos por variante de cor, usados na vitrine e no checkout.
 * O valor cobrado no Pix continua sendo calculado no servidor (pixzy-core PRODUCT_CATALOG),
 * esta tabela apenas mantem os dois lados consistentes.
 */
import corBranco from "@/assets/colors/cor-branco.webp.asset.json"
import corCinza from "@/assets/colors/cor-cinza.webp.asset.json"
import corPreto from "@/assets/colors/cor-preto.webp.asset.json"

export type VariantPricing = { id: string; label: string; original: number; price: number; name: string; image: string }

export const VARIANT_PRICING: Record<string, VariantPricing> = {
  "controle-edge-branco": { id: "controle-edge-branco", label: "Branco", original: 1169.9, price: 179.9, name: "Controle Sony Dualsense Edge Ps5 cor branco", image: corBranco.url },
  "controle-edge-cinza": { id: "controle-edge-cinza", label: "Cinza", original: 2499.9, price: 249.8, name: "Controle Sem Fio Dualsense Edge Edição Limitada 30º Aniversário PS5 Cinza", image: corCinza.url },
  "controle-edge-preto": { id: "controle-edge-preto", label: "Preto", original: 1169.9, price: 179.9, name: "Controle Sem Fio Dualsense Edge Midnight Black Ps5", image: corPreto.url },
}

export const DEFAULT_VARIANT_ID = "controle-edge-branco"

const VARIANT_KEY = "checkout_variant"

export function getSelectedVariant(): VariantPricing {
  try {
    const raw = sessionStorage.getItem(VARIANT_KEY)
    if (raw && VARIANT_PRICING[raw]) return VARIANT_PRICING[raw]!
  } catch {
    /* ignora armazenamento indisponivel */
  }
  return VARIANT_PRICING[DEFAULT_VARIANT_ID]!
}

export function setSelectedVariant(id: string) {
  try {
    sessionStorage.setItem(VARIANT_KEY, id)
  } catch {
    /* ignora armazenamento indisponivel */
  }
}
