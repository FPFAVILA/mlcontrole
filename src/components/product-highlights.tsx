export function ProductHighlights() {
  const highlights = [
    "Controle sem fio Sony DualSense Edge para PlayStation 5, modelo CFI-ZCP1WY.",
    "Botões reconfiguráveis e perfis personalizados para diferentes jogos.",
    "Sensibilidade dos analógicos, zonas mortas e profundidade dos gatilhos ajustáveis.",
    "Dois estilos de botões traseiros personalizáveis.",
    "Resposta tátil, gatilhos adaptáveis, microfone e controles de movimento.",
    "Módulo de analógico substituível, vendido separadamente.",
    "Acompanha estojo de transporte, cabo USB trançado e capas para analógicos.",
  ]

  return (
    <div className="bg-white border-t border-[#e0e0e0] p-4 md:p-6">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-4">
        O que você precisa saber sobre este produto
      </h2>
      <ul className="space-y-[6px] text-[14px] text-[#333]">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-[#333] mt-[2px]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}