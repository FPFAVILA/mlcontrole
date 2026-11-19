import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PRODUCT_IMAGE, PRODUCT_NAME } from "@/lib/product-catalog"

const details = [
  { label: "Aplicação:", value: "Autoadesiva" },
  { label: "Compatibilidade:", value: "Exclusiva com iPhone XR" },
  { label: "Lentes extras:", value: "Decorativas" },
  { label: "Proteção:", value: "Contra pequenos riscos" },
]

const descriptionImages = [
  { alt: "Kit de película traseira branca para iPhone XR", src: PRODUCT_IMAGE },
  { alt: "Película traseira autoadesiva inspirada no iPhone 13 Pro Max", src: PRODUCT_IMAGE },
  { alt: "Lentes decorativas do kit para iPhone XR", src: PRODUCT_IMAGE },
]

export function ProductDescription() {
  const [expanded, setExpanded] = useState(false)
  const [imagesExpanded, setImagesExpanded] = useState(false)

  return <div className="mt-8 bg-white rounded-lg p-4 md:p-6">
    <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-4">Detalhes do produto</h2>
    <div className="space-y-5 mb-5">{details.map((detail) => <div key={detail.label} className="flex items-center gap-3"><span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f5f5f5] shrink-0"><svg className="w-[18px] h-[18px] text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span><span className="text-[14px] text-[#333]">{detail.label} <strong>{detail.value}</strong></span></div>)}</div>
    <div className="text-[14px] text-[#333] leading-[1.6] mb-2"><p>Transforme o visual do seu iPhone XR com uma película traseira branca inspirada no iPhone 13 Pro Max.</p></div>
    <Button type="button" variant="link" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded} className="flex h-auto items-center gap-1 mt-4 p-0 text-[14px] text-ml-blue font-semibold hover:underline">{expanded ? "Ver menos detalhes" : "Ver mais detalhes"}<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{expanded ? <polyline points="6 15 12 9 18 15" /> : <polyline points="6 9 12 15 18 9" />}</svg></Button>
    {expanded && <div className="mt-4 text-[14px] text-[#333] leading-[1.7] space-y-3"><p className="font-bold text-[16px]">{PRODUCT_NAME}</p><p>A película traseira autoadesiva foi feita para renovar a aparência do iPhone XR sem trocar de aparelho. O design é inspirado no visual do iPhone 13 Pro Max e tem acabamento branco.</p><p>A aplicação é simples: limpe a traseira do aparelho, alinhe a película e pressione suavemente para fixar. As lentes extras decorativas ajudam a completar a transformação visual.</p><div className="border-t border-[#eee] my-4" /><h3 className="font-bold mt-2">Benefícios</h3><ul className="list-disc pl-5"><li>Transformação visual da traseira do iPhone XR.</li><li>Aplicação autoadesiva e simples.</li><li>Ajuda contra pequenos riscos do uso diário.</li><li>Lentes extras decorativas incluídas no kit.</li></ul><h3 className="font-bold mt-2">Especificações</h3><p>Marca genérica, modelo iPhone XR, película protetora traseira, cor branca, design inspirado no iPhone 13 Pro Max e um kit por embalagem. Produto não original da Apple. A resistência à água não é especificada.</p><h3 className="font-bold mt-2">Compatibilidade</h3><p>Exclusivo para iPhone XR. Não é indicado para outros modelos de iPhone.</p></div>}
    <div className="mt-4 space-y-3">{descriptionImages.slice(0, 2).map((image) => <img key={image.alt} src={image.src} alt={image.alt} className="w-full rounded object-cover" loading="lazy" />)}{imagesExpanded && <img src={descriptionImages[2].src} alt={descriptionImages[2].alt} className="w-full rounded object-cover" loading="lazy" />}</div>
    <Button type="button" variant="link" onClick={() => setImagesExpanded((current) => !current)} aria-expanded={imagesExpanded} className="flex h-auto items-center gap-2 mt-4 p-0 text-[14px] text-ml-blue font-semibold hover:underline">{imagesExpanded ? "Ver menos" : "Ver mais imagens"}<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{imagesExpanded ? <polyline points="6 15 12 9 18 15" /> : <polyline points="6 9 12 15 18 9" />}</svg></Button>
  </div>
}
