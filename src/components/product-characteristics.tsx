export function ProductCharacteristics() {
  const mainSpecs = [
    { label: "Marca", value: "Genérica" },
    { label: "Modelo", value: "iPhone XR" },
    { label: "Tipo", value: "Película protetora traseira" },
    { label: "Compatibilidade", value: "Exclusiva com iPhone XR" },
  ]

  const otherSpecs = [
    { label: "Design", value: "Inspirado no iPhone 13 Pro Max" },
    { label: "Cor", value: "Branca" },
    { label: "Aplicação", value: "Autoadesiva" },
    { label: "Lentes extras", value: "Decorativas" },
    { label: "Resistência à água", value: "Não especificada" },
    { label: "Conteúdo da embalagem", value: "1 kit" },
    { label: "Originalidade", value: "Produto não original da Apple" },
  ]

  return (
    <div className="mt-8 bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-6">Características do produto</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {[{ title: "Características principais", specs: mainSpecs }, { title: "Outros", specs: otherSpecs }].map((group) => (
          <div key={group.title} className="flex-1 min-w-0">
            <h3 className="text-[16px] font-semibold text-[#333] mb-3">{group.title}</h3>
            <div className="overflow-hidden">
              {group.specs.map((spec, index) => <div key={spec.label} className={`flex ${index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}`}><div className="w-[120px] md:w-[180px] shrink-0 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#999] break-words">{spec.label}</div><div className="min-w-0 flex-1 px-3 md:px-4 py-3 text-[13px] md:text-[14px] text-[#333] break-words">{spec.value}</div></div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
