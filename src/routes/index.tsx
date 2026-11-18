import { useEffect, useRef, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import productPhoto from "@/assets/gallery/p8.webp.asset.json"

const PRESELL_SEEN_KEY = "presell_seen"

function PresellPage() {
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Só mostra a pressell na primeira entrada da sessão; ao recarregar, vai direto ao produto.
    if (sessionStorage.getItem(PRESELL_SEEN_KEY) === "1") {
      window.location.replace(`/produto${window.location.search}`)
    }
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const continueToProduct = () => {
    if (loading) return
    setLoading(true)
    sessionStorage.setItem(PRESELL_SEEN_KEY, "1")
    timer.current = setTimeout(() => {
      window.location.assign(`/produto${window.location.search}`)
    }, 850)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-card px-4 py-8 font-sans">
      <article className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[8px] bg-card shadow-[var(--shadow-presell)] sm:max-w-[584px]">
        <div className="flex aspect-[8/7] w-full items-center justify-center bg-card">
          <img
            src={productPhoto.url}
            alt="Controle Sony DualSense Edge PS5 branco visto de frente"
            className="h-full w-full object-contain"
            width={1024}
            height={1024}
            fetchPriority="high"
          />
        </div>
        <div className="border-t border-border px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6">
          <h1 className="text-[16px] font-semibold leading-[1.2] text-ml-gray-700 sm:text-[23px]">
            Controle Sony DualSense Edge PS5 Branco
          </h1>
          <p className="mt-3 text-[28px] leading-none text-ml-gray-800 sm:mt-5 sm:text-[38px]">R$ 179,90</p>
          <Button
            type="button"
            onClick={continueToProduct}
            disabled={loading}
            className="mt-5 h-[48px] w-full rounded-[6px] bg-ml-blue text-accent-foreground text-[16px] font-semibold hover:bg-ml-blue/90 sm:mt-8 sm:h-[74px] sm:text-[23px]"
          >
            Continuar
          </Button>
        </div>
      </article>

      {loading && (
        <div role="status" aria-label="Carregando produto" className="fixed inset-0 z-[100] flex items-center justify-center bg-card">
          <span className="size-9 animate-spin rounded-full border-[3px] border-ml-blue/20 border-t-ml-blue motion-reduce:animate-none" />
        </div>
      )}
    </main>
  )
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Controle Sony DualSense Edge PS5 Branco | Oferta" },
      { name: "description", content: "Controle Sony DualSense Edge PS5 Branco por R$ 179,90. Continue para conhecer o produto." },
      { property: "og:title", content: "Controle Sony DualSense Edge PS5 Branco | Oferta" },
      { property: "og:description", content: "Controle Sony DualSense Edge PS5 Branco por R$ 179,90. Continue para conhecer o produto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PresellPage,
})