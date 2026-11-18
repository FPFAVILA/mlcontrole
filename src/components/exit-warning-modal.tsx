import { X } from "lucide-react"
import { useEffect } from "react"
import vanImg from "@/assets/free-shipping-van.webp"

interface ExitWarningModalProps {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

export function ExitWarningModal({ open, onStay, onLeave }: ExitWarningModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStay()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onStay])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de frete grátis"
    >
      <div className="relative w-full max-w-[300px] rounded-2xl bg-white p-5 pt-5 text-center shadow-xl">
        <button
          type="button"
          onClick={onStay}
          aria-label="Fechar"
          className="absolute right-3 top-3 text-[#999] hover:text-[#333]"
        >
          <X className="size-5" />
        </button>

        {/* Ilustração do caminhão de entrega com selo GRÁTIS */}
        <div className="mx-auto mb-3 flex justify-center">
          <img
            src={vanImg}
            alt="Caminhão de entrega com frete grátis"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-[85px] w-[160px] object-contain"
          />
        </div>

        <h2 className="text-[17px] font-semibold leading-snug text-[#333]">
          Você tem <span className="text-[#00a650]">frete grátis</span>. Se sair,
          perderá esse benefício!
        </h2>

        <div className="mt-3.5 space-y-2">
          <button
            type="button"
            onClick={onStay}
            className="h-11 w-full rounded-md bg-[#3483fa] text-[15px] font-semibold text-white transition-colors hover:bg-[#2968c8]"
          >
            Continuar a compra
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="h-11 w-full rounded-md bg-[#e3edfb] text-[15px] font-semibold text-[#3483fa] transition-colors hover:bg-[#d3e2f8]"
          >
            Sair mesmo assim
          </button>
        </div>
      </div>
    </div>
  )
}
