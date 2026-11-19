import { useState } from "react"
import { PRODUCT_IMAGE, PRODUCT_NAME } from "@/lib/product-catalog"

type Media = { id: number; src: string; alt: string }

const productMedia: Media[] = [
  { id: 1, src: PRODUCT_IMAGE, alt: `${PRODUCT_NAME} com película traseira e lentes decorativas` },
  { id: 2, src: PRODUCT_IMAGE, alt: "Película traseira autoadesiva para iPhone XR" },
  { id: 3, src: PRODUCT_IMAGE, alt: "Kit branco inspirado no iPhone 13 Pro Max" },
  { id: 4, src: PRODUCT_IMAGE, alt: "Lentes decorativas incluídas no kit para iPhone XR" },
  { id: 5, src: PRODUCT_IMAGE, alt: "Aplicação da película traseira no iPhone XR" },
]

export function ProductGallery() {
  const [selected, setSelected] = useState(0)
  const current = productMedia[selected]!

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2">
      <div className="flex flex-row md:flex-col gap-[6px] overflow-x-auto md:overflow-x-visible">
        {productMedia.map((media, index) => (
          <button key={media.id} type="button" className={`relative w-[44px] h-[44px] rounded-[4px] border-2 overflow-hidden flex-shrink-0 bg-white ${selected === index ? "border-[#3483fa]" : "border-[#e0e0e0]"}`} onMouseEnter={() => setSelected(index)} onClick={() => setSelected(index)} aria-label={media.alt}>
            <img src={media.src} alt={media.alt} width={44} height={44} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center bg-white rounded-[4px] min-h-[260px] md:min-h-[380px] overflow-hidden">
        <div className="relative w-full h-[300px] md:h-[460px] flex items-center justify-center p-4">
          <img src={current.src} alt={current.alt} loading="eager" decoding="async" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  )
}
