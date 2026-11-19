import { ChevronRight, CheckCircle2, BadgeCheck } from "lucide-react"

export function SellerReputation() {
  return (
    <div className="mt-8 bg-white rounded-t-lg p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center text-[#3483fa] font-bold">C</div>
        <h2 className="text-[18px] font-bold text-[#333] leading-tight flex items-center gap-1.5">Cellfy <BadgeCheck className="w-[18px] h-[18px] text-[#3483fa] fill-[#3483fa] stroke-white" /></h2>
      </div>
      <div className="flex items-center gap-[6px] mb-3"><span className="h-[7px] flex-1 rounded-[2px] bg-[#fdd8d8]" /><span className="h-[7px] flex-1 rounded-[2px] bg-[#fde3cd]" /><span className="h-[7px] flex-1 rounded-[2px] bg-[#fdf0c8]" /><span className="h-[7px] flex-1 rounded-[2px] bg-[#d3f0dd]" /><span className="h-[11px] flex-1 rounded-[2px] bg-[#00a650]" /></div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#666]"><span>+2.000 vendas</span><span className="text-[#e0e0e0]">|</span><span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#00a650]" />Presta um bom atendimento</span><span className="text-[#e0e0e0]">|</span><span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#00a650]" />Entrega no prazo</span></div>
      <a href="#" className="mt-4 inline-flex items-center gap-1 text-[15px] text-[#3483fa] hover:text-[#2968c8]">Ver mais produtos do vendedor <ChevronRight className="w-4 h-4" /></a>
    </div>
  )
}
