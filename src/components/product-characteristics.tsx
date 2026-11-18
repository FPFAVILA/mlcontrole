export function ProductCharacteristics() {
  const mainSpecs = [
    { label: "Marca", value: "Sony" },
    { label: "Modelo", value: "DualSense Edge" },
    { label: "Código do modelo", value: "CFI-ZCP1WY" },
    { label: "Compatibilidade", value: "PlayStation 5" },
  ]

  const otherSpecs = [
    { label: "Conexão", value: "Sem fio / USB" },
    { label: "Cor", value: "Midnight Black" },
    { label: "Perfis personalizados", value: "Sim" },
    { label: "Botões reconfiguráveis", value: "Sim" },
    { label: "Botões traseiros", value: "Sim" },
    { label: "Gatilhos adaptáveis", value: "Sim" },
    { label: "Resposta tátil", value: "Sim" },
    { label: "Analógicos substituíveis", value: "Sim, módulo vendido separadamente" },
    { label: "Estojo", value: "Incluso" },
    { label: "Cabo USB trançado", value: "Incluso" },
    { label: "Garantia informada pela KaBuM!", value: "1 ano" },
  ]

  return (
    <div className="mt-8 bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-6">Características do produto</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#333] mb-3">Características principais</h3>
          <div className="overflow-hidden">
            {mainSpecs.map((spec, index) => (
              <div key={spec.label} className={`flex ${index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}`}>
                <div className="w-[120px] md:w-[180px] shrink-0 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#999] break-words">{spec.label}</div>
                <div className="min-w-0 flex-1 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#333] break-words">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#333] mb-3">Outros</h3>
          <div className="overflow-hidden">
            {otherSpecs.map((spec, index) => (
              <div key={spec.label} className={`flex ${index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}`}>
                <div className="w-[120px] md:w-[200px] shrink-0 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#999] break-words">{spec.label}</div>
                <div className="min-w-0 flex-1 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#333] break-words">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}