import { ChevronRight } from "lucide-react"

export function MLBreadcrumb() {
  const items = [
    "Voltar",
    "Informática",
    "Impressão",
    "Impressoras 3D"

  ]

  return (
    <nav className="flex items-center gap-1 text-[12px] text-[#3483fa] py-3" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-3 h-3 text-[#999]" />}
          <a href="#" className="hover:text-[#1a5cc6]">{item}</a>
        </span>
      ))}
      <ChevronRight className="w-3 h-3 text-[#999]" />
      <span className="text-[#999]">Mais informações</span>
    </nav>
  )
}
