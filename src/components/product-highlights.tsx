export function ProductHighlights() {
  const highlights = [
    "Transforme visualmente a traseira do seu iPhone XR com um estilo inspirado no iPhone 13 Pro Max.",
    "Película traseira autoadesiva, com aplicação simples e acabamento branco.",
    "Acompanha lentes extras decorativas para completar a transformação visual.",
    "Ajuda a proteger contra pequenos riscos do uso diário.",
    "Compatibilidade exclusiva com iPhone XR.",
    "Produto genérico, não original da Apple.",
  ]

  return <div className="bg-white border-t border-[#e0e0e0] p-4 md:p-6"><h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-4">O que você precisa saber sobre este produto</h2><ul className="space-y-[6px] text-[14px] text-[#333]">{highlights.map((item) => <li key={item} className="flex items-start gap-2"><span className="text-[#333] mt-[2px]">•</span><span>{item}</span></li>)}</ul></div>
}
