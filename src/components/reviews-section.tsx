import { Star } from "lucide-react"

const reviews = [
  { name: "Mariana S.", date: "13 jul. 2026", text: "A película chegou bem protegida, apliquei com cuidado e o visual do meu iPhone XR mudou bastante.", likes: 38 },
  { name: "João A.", date: "10 jul. 2026", text: "Chegou certinho e veio conforme o anúncio. As lentes decorativas deixaram a traseira muito bonita.", likes: 31 },
  { name: "Camila R.", date: "10 jul. 2026", text: "A aplicação foi simples e a película ficou bem aderida. Recomendo para quem quer renovar o aparelho.", likes: 26 },
  { name: "Felipe D.", date: "08 jul. 2026", text: "Gostei do acabamento branco e da transformação visual. Produto compatível com o iPhone XR.", likes: 22 },
  { name: "Rafael M.", date: "07 jul. 2026", text: "Produto bem embalado, sem riscos na traseira e com as lentes extras no kit.", likes: 18 },
]

function StarRating() {
  return <div className="flex items-center gap-[1px]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-[14px] h-[14px] fill-[#3483fa] text-[#3483fa]" />)}</div>
}

export function ReviewsSection() {
  return <div className="bg-white border-t border-[#e0e0e0] rounded-b-lg p-4 md:p-6"><h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-6">Opiniões do produto</h2><div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8"><div className="flex-shrink-0"><div className="flex items-center gap-3 mb-2"><span className="text-[48px] font-light text-[#333]">4.9</span><StarRating /></div><p className="text-[13px] text-[#999] mb-2">46 opiniões</p><div className="space-y-[2px]">{[5, 4, 3, 2, 1].map((star) => <div key={star} className="flex items-center gap-2"><span className="text-[12px] text-[#999] w-[18px]">{star === 5 ? 41 : star === 4 ? 5 : 0}</span><div className="w-[100px] h-[6px] bg-[#e0e0e0] rounded-full overflow-hidden"><div className="h-full bg-[#3483fa] rounded-full" style={{ width: star === 5 ? "89%" : star === 4 ? "11%" : "0%" }} /></div></div>)}</div></div><div className="flex-1"><p className="text-[13px] text-[#333] font-medium mb-2">Avaliação de características</p><div className="space-y-1">{["Custo-benefício", "Qualidade", "Design"].map((label) => <div key={label} className="flex items-center gap-2"><span className="text-[12px] text-[#999] w-[100px]">{label}</span><StarRating /></div>)}</div></div></div><div className="space-y-5">{reviews.map((review) => <article key={review.name + review.date} className="border-t border-[#eee] pt-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><div className="w-[32px] h-[32px] rounded-full bg-[#eaf1fb] flex items-center justify-center text-[#3483fa] font-semibold">{review.name[0]}</div><span className="text-[14px] font-medium text-[#333]">{review.name}</span></div><StarRating /></div><p className="text-[14px] text-[#333] leading-[1.5] mb-2">{review.text}</p><div className="flex items-center gap-4 text-[12px] text-[#999]"><span>{review.date}</span><span>Foi útil {review.likes}</span></div></article>)}</div></div>
}
