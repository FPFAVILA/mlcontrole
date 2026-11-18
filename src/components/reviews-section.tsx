import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, ArrowLeft, X } from "lucide-react"

import relato1 from "@/assets/reviews/relato-1.webp.asset.json"
import relato11 from "@/assets/reviews/relato-11.webp.asset.json"
import relato111 from "@/assets/reviews/relato-111.webp.asset.json"
import relato2 from "@/assets/reviews/relato-2.webp.asset.json"
import relato3 from "@/assets/reviews/relato-3.webp.asset.json"
import relato33 from "@/assets/reviews/relato-33.webp.asset.json"
import relato333 from "@/assets/reviews/relato-333.webp.asset.json"
import relato4 from "@/assets/reviews/relato-4.webp.asset.json"
import relato5 from "@/assets/reviews/relato-5.webp.asset.json"
import relato55 from "@/assets/reviews/relato-55.webp.asset.json"

const allReviewPhotos = [
  { src: relato1.url, alt: "Controle DualSense Edge branco com o estojo e acessorios", reviewIndex: 0 },
  { src: relato11.url, alt: "Controle DualSense Edge branco na mao", reviewIndex: 0 },
  { src: relato111.url, alt: "Controle DualSense Edge branco visto de tras", reviewIndex: 0 },
  { src: relato2.url, alt: "Controle DualSense Edge preto dentro do estojo", reviewIndex: 1 },
  { src: relato3.url, alt: "Caixa do DualSense Edge com o estojo preto", reviewIndex: 2 },
  { src: relato33.url, alt: "Caixa do DualSense Edge e manual sobre a mesa", reviewIndex: 2 },
  { src: relato333.url, alt: "DualSense Edge preto com luz laranja no suporte", reviewIndex: 2 },
  { src: relato4.url, alt: "Estoque preto do DualSense Edge dentro da caixa", reviewIndex: 3 },
  { src: relato5.url, alt: "Caixa do DualSense Edge branco sobre a mesa", reviewIndex: 4 },
  { src: relato55.url, alt: "Caixa do DualSense Edge com o controle branco", reviewIndex: 4 },
]

const reviewPhotosPreview = [
  { src: relato1.url, alt: "Controle DualSense Edge branco com o estojo" },
  { src: relato2.url, alt: "Controle DualSense Edge preto dentro do estojo" },
  { src: relato3.url, alt: "Caixa do DualSense Edge com o estojo preto" },
  { src: relato4.url, alt: "Estoque preto do DualSense Edge dentro da caixa" },
  { src: relato5.url, alt: "Caixa do DualSense Edge branco sobre a mesa" },
]

const reviews = [
  {
    stars: 5,
    date: "13 jul. 2026",
    text: "Mano, chegou bem antes do que eu esperava kkkkk e o controle é simplesmente absurdo. Pegada muito boa e os botões traseiros fazem MUITA diferença 🔥",
    likes: 47,
    dislikes: 0,
    photos: [
      { src: relato1.url, alt: "Controle DualSense Edge branco com o estojo e acessorios" },
      { src: relato11.url, alt: "Controle DualSense Edge branco na mao" },
      { src: relato111.url, alt: "Controle DualSense Edge branco visto de tras" },
    ],
  },
  {
    stars: 5,
    date: "10 jul. 2026",
    text: "Chegou certinho, bem embalado e sem nenhum detalhe. Tô apaixonado nesse controle kkkkkk agora voltar pro controle normal vai ser difícil 😂",
    likes: 38,
    dislikes: 0,
    photos: [
      { src: relato2.url, alt: "Controle DualSense Edge preto dentro do estojo" },
    ],
  },
  {
    stars: 5,
    date: "10 jul. 2026",
    text: "Rapaz… que controle!!! A qualidade é outra coisa, muito confortável e os ajustes são muito bons. Valeu cada centavo 👏🏻",
    likes: 29,
    dislikes: 0,
    photos: [
      { src: relato3.url, alt: "Caixa do DualSense Edge com o estojo preto" },
      { src: relato33.url, alt: "Caixa do DualSense Edge e manual sobre a mesa" },
      { src: relato333.url, alt: "DualSense Edge preto com luz laranja no suporte" },
    ],
  },
  {
    stars: 5,
    date: "10 jul. 2026",
    text: "KKKKKK eu não sabia que precisava de um controle desses até comprar. O negócio é outro nível, sério. Já tô jogando tudo nele 😂",
    likes: 22,
    dislikes: 0,
    photos: [
      { src: relato4.url, alt: "Estoque preto do DualSense Edge dentro da caixa" },
    ],
  },
  {
    stars: 5,
    date: "10 jul. 2026",
    text: "Chegou hoje e já fui testar no PS5. Funcionando perfeitamente, sem dor de cabeça nenhuma. Muito top mesmo!",
    likes: 19,
    dislikes: 0,
    photos: [
      { src: relato5.url, alt: "Caixa do DualSense Edge branco sobre a mesa" },
      { src: relato55.url, alt: "Caixa do DualSense Edge com o controle branco" },
    ],
  },
  {
    stars: 5,
    date: "09 jul. 2026",
    text: "A embalagem veio muito bem protegida e o controle é lindo demais pessoalmente. O preto ficou MUITO bonito 🔥",
    likes: 16,
    dislikes: 0,
    photos: [],
  },
  {
    stars: 5,
    date: "09 jul. 2026",
    text: "Gostei demais! A possibilidade de configurar os botões e trocar as capinhas do analógico é muito boa. Pra quem joga bastante, faz diferença demais.",
    likes: 14,
    dislikes: 0,
    photos: [],
  },
  {
    stars: 5,
    date: "08 jul. 2026",
    text: "Só tenho uma coisa pra falar: que controle MONSTRO kkkkkkk. Muito confortável e a resposta dos comandos é excelente.",
    likes: 12,
    dislikes: 0,
    photos: [],
  },
  {
    stars: 5,
    date: "08 jul. 2026",
    text: "Pedido chegou direitinho, tudo conforme anunciado e o controle é original. Já testei no PS5 e tá funcionando 100%. 😍",
    likes: 11,
    dislikes: 0,
    photos: [],
  },
  {
    stars: 5,
    date: "07 jul. 2026",
    text: "Comprei meio desconfiado porque nunca tinha usado o Edge, mas agora entendi o hype kkkkk. A construção é muito boa e os acessórios que vêm junto são um diferencial.",
    likes: 9,
    dislikes: 0,
    photos: [],
  },
]


function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-[1px]">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="fill-[#3483fa] text-[#3483fa]"
          style={{
            width: size,
            height: size,
            opacity: s <= rating ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

function PhotoLightbox({
  initialIndex,
  onClose,
}: {
  initialIndex: number
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentPhoto = allReviewPhotos[currentIndex]
  const associatedReview = reviews[currentPhoto.reviewIndex]

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-[#333] hover:text-[#1a1a1a] bg-transparent border-none cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[18px] font-semibold text-[#333]">{'Opinioes com fotos'}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-[#999] hover:text-[#333] bg-transparent border-none cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left: Photo area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white px-4 md:px-8 py-4 md:py-6">
          <div className="flex-1 flex items-center justify-center max-w-[550px] w-full">
            <img loading="lazy" decoding="async" src={currentPhoto.src}
              alt={currentPhoto.alt}
              className="max-w-full max-h-[300px] md:max-h-[400px] object-contain"
            />
          </div>

          {/* Counter */}
          <p className="text-[14px] text-[#3483fa] mt-4 mb-4">
            {currentIndex + 1} / {allReviewPhotos.length}
          </p>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
            {allReviewPhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-[48px] h-[48px] rounded-[4px] overflow-hidden flex-shrink-0 cursor-pointer border-2 ${
                  index === currentIndex ? "border-[#3483fa]" : "border-transparent"
                } bg-transparent p-0`}
              >
                <img loading="lazy" decoding="async" src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Review info */}
        <div className="w-full md:w-[280px] border-t md:border-t-0 md:border-l border-[#eee] p-4 md:p-6 flex-shrink-0">
          <div className="mb-3">
            <StarRating rating={associatedReview.stars} size={18} />
          </div>
          <p className="text-[14px] text-[#333] leading-[1.5] mb-3">{associatedReview.text}</p>
          <p className="text-[13px] text-[#999] mb-4">{associatedReview.date}</p>
          <button className="flex items-center gap-2 border border-[#e0e0e0] rounded-full px-4 py-[6px] text-[13px] text-[#333] hover:bg-[#f5f5f5] bg-white cursor-pointer">
            {'E util'}
            <ThumbsUp className="w-[14px] h-[14px] text-[#999]" />
            <span className="text-[#999]">{associatedReview.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReviewsSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (photoSrc: string) => {
    const index = allReviewPhotos.findIndex((p) => p.src === photoSrc)
    setLightboxIndex(index >= 0 ? index : 0)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="bg-white border-t border-[#e0e0e0] rounded-b-lg p-4 md:p-6">
        <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-6">{'Opinioes do produto'}</h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
          {/* Overall rating */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[48px] font-light text-[#333]">4.9</span>
              <StarRating rating={5} size={18} />
            </div>
            <p className="text-[13px] text-[#999] mb-2">85 opiniões</p>
            <div className="space-y-[2px]">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[12px] text-[#999] w-[18px]">
                    {star === 5 ? 75 : star === 4 ? 9 : 0}
                  </span>
                  <div className="w-[100px] h-[6px] bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3483fa] rounded-full"
                      style={{
                        width:
                          star === 5 ? "89%" : star === 4 ? "11%" : "0%",
                      }}

                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[13px] text-[#333] font-medium mb-2">{'Avaliacao de caracteristicas'}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#999] w-[100px]">{'Custo-beneficio'}</span>
                  <StarRating rating={5} size={12} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#999] w-[100px]">Qualidade</span>
                  <StarRating rating={5} size={12} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#999] w-[100px]">Design</span>
                  <StarRating rating={5} size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Review content */}
          <div className="flex-1 min-w-0">
            {/* Review photos */}
            <div className="mb-6">
              <p className="text-[14px] text-[#333] font-medium mb-3">{'Opinioes com fotos'}</p>
              <div className="flex gap-2">
                {reviewPhotosPreview.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(photo.src)}
                    className="w-[64px] h-[64px] bg-[#f5f5f5] rounded-[4px] cursor-pointer overflow-hidden border-none p-0"
                  >
                    <img loading="lazy" decoding="async" src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 mb-4">
              <button className="text-[13px] text-[#3483fa] border border-[#3483fa] rounded-full px-4 py-1 bg-white cursor-pointer">
                Ordenar
              </button>
              <button className="text-[13px] text-[#3483fa] border border-[#3483fa] rounded-full px-4 py-1 bg-white cursor-pointer">
                {'Qualificacao'}
              </button>
            </div>

            <p className="text-[14px] text-[#333] font-medium mb-4">{'Opinioes em destaque'}</p>

            {/* Review list */}
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-[#eee] pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.stars} size={14} />
                  </div>
                  <p className="text-[14px] text-[#333] leading-[1.5] mb-3">{review.text}</p>

                  {review.photos.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.photos.map((photo, pIndex) => (
                        <button
                          key={pIndex}
                          onClick={() => openLightbox(photo.src)}
                          className="w-[48px] h-[48px] bg-[#f5f5f5] rounded-[4px] overflow-hidden cursor-pointer border-none p-0"
                        >
                          <img loading="lazy" decoding="async" src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[12px] text-[#999]">
                    <button className="flex items-center gap-1 hover:text-[#333] bg-transparent border-none cursor-pointer text-[#999]">
                      <ThumbsUp className="w-[14px] h-[14px]" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#333] bg-transparent border-none cursor-pointer text-[#999]">
                      <ThumbsDown className="w-[14px] h-[14px]" />
                      <span>{review.dislikes}</span>
                    </button>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="#" className="text-[13px] text-[#3483fa] mt-4 inline-block">
              Mostrar todas as opinioes
            </a>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <PhotoLightbox
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
