import { useEffect, useRef, useState } from "react"
import video from "@/assets/gallery/video.mp4.asset.json"
import p1 from "@/assets/gallery/p1.webp.asset.json"
import p2 from "@/assets/gallery/p2.webp.asset.json"
import p3 from "@/assets/gallery/p3.webp.asset.json"
import p4 from "@/assets/gallery/p4.webp.asset.json"
import p5 from "@/assets/gallery/p5.webp.asset.json"
import p6 from "@/assets/gallery/p6.webp.asset.json"
import p7 from "@/assets/gallery/p7.webp.asset.json"
import p8 from "@/assets/gallery/p8.webp.asset.json"
import p9 from "@/assets/gallery/p9.webp.asset.json"

type Media = { id: number; type: "video" | "image"; src: string; alt: string }

const productMedia: Media[] = [
  { id: 0, type: "video", src: video.url, alt: "Vídeo do Controle Sony DualSense Edge PS5" },
  { id: 1, type: "image", src: p8.url, alt: "Controle DualSense Edge - frente" },
  { id: 2, type: "image", src: p5.url, alt: "Controle DualSense Edge - detalhe frontal dos botões" },
  { id: 3, type: "image", src: p9.url, alt: "Controle DualSense Edge - detalhe do acabamento frontal" },
  { id: 4, type: "image", src: p6.url, alt: "Controle DualSense Edge em uso" },
  { id: 5, type: "image", src: p3.url, alt: "Controle DualSense Edge - vista lateral" },
  { id: 6, type: "image", src: p4.url, alt: "Controle DualSense Edge - botões traseiros" },
  { id: 7, type: "image", src: p1.url, alt: "Controle DualSense Edge - traseira" },
  { id: 8, type: "image", src: p2.url, alt: "Controle DualSense Edge com estojo" },
  { id: 9, type: "image", src: p7.url, alt: "Controle DualSense Edge com estojo, cabo e acessórios" },
]

export function ProductGallery() {
  const [selected, setSelected] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (selected === 0) {
      v.muted = true
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [selected])

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2">
      <div className="flex flex-row md:flex-col gap-[6px] overflow-x-auto md:overflow-x-visible">
        {productMedia.map((m, index) => (
          <button
            key={m.id}
            className={`relative w-[44px] h-[44px] rounded-[4px] border-2 overflow-hidden flex-shrink-0 bg-white ${
              selected === index ? "border-[#3483fa]" : "border-[#e0e0e0]"
            }`}
            onMouseEnter={() => setSelected(index)}
            onClick={() => setSelected(index)}
            aria-label={m.alt}
          >
            {m.type === "video" ? (
              <>
                <video src={`${m.src}#t=0.5`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-[14px]">▶</span>
              </>
            ) : (
              <img src={m.src} alt={m.alt} width={44} height={44} loading="lazy" decoding="async" className="w-full h-full object-contain" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center bg-white rounded-[4px] min-h-[260px] md:min-h-[380px] overflow-hidden">
        <div className="relative w-full h-[300px] md:h-[460px] flex items-center justify-center p-4">
          {productMedia.map((m, index) =>
            m.type === "video" ? (
              <video
                key={m.id}
                ref={videoRef}
                src={m.src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={`max-w-full max-h-full object-contain ${selected === index ? "" : "hidden"}`}
              />
            ) : (
              <img
                key={m.id}
                src={m.src}
                alt={m.alt}
                loading="eager"
                decoding="async"
                className={`max-w-full max-h-full object-contain ${selected === index ? "" : "hidden"}`}
              />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
