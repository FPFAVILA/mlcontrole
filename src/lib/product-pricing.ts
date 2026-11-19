import { PRODUCT_IMAGE, PRODUCT_NAME, PRODUCT_ID, PRODUCT_PRICE, PRODUCT_ORIGINAL_PRICE } from "@/lib/product-catalog"

export type VariantPricing = {
  id: string
  label: string
  original: number
  price: number
  name: string
  image: string
}

export const VARIANT_PRICING: Record<string, VariantPricing> = {
  [PRODUCT_ID]: {
    id: PRODUCT_ID,
    label: "Branco",
    original: PRODUCT_ORIGINAL_PRICE,
    price: PRODUCT_PRICE,
    name: PRODUCT_NAME,
    image: PRODUCT_IMAGE,
  },
}

export const DEFAULT_VARIANT_ID = PRODUCT_ID
const VARIANT_KEY = "checkout_variant"

export function getSelectedVariant(): VariantPricing {
  try {
    const raw = sessionStorage.getItem(VARIANT_KEY)
    if (raw && VARIANT_PRICING[raw]) return VARIANT_PRICING[raw]!
  } catch {
    /* armazenamento pode estar indisponivel */
  }
  return VARIANT_PRICING[DEFAULT_VARIANT_ID]!
}

export function setSelectedVariant(id: string) {
  if (!VARIANT_PRICING[id]) return
  try {
    sessionStorage.setItem(VARIANT_KEY, id)
  } catch {
    /* armazenamento pode estar indisponivel */
  }
}
