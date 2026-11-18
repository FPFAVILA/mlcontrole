import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react"
import { addUtmsToHref } from "@/components/utm-handler"

function VerificacaoPage() {
  const [checked, setChecked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState([false, false, false])
  const [showButton, setShowButton] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleCheck = () => {
    if (checked) return
    setChecked(true)

    // Animar barra de progresso
    let p = 0
    const progressInterval = setInterval(() => {
      p += 2
      setProgress(p)
      if (p >= 100) clearInterval(progressInterval)
    }, 30)

    // Etapa 1: Verificando dispositivo
    setTimeout(() => {
      setSteps((prev) => [true, prev[1], prev[2]])
    }, 800)

    // Etapa 2: Analisando comportamento
    setTimeout(() => {
      setSteps((prev) => [prev[0], true, prev[2]])
    }, 1600)

    // Etapa 3: Confirmando identidade
    setTimeout(() => {
      setSteps((prev) => [prev[0], prev[1], true])
      setVerified(true)
    }, 2400)

    // Mostrar botao
    setTimeout(() => {
      setShowButton(true)
    }, 3000)
  }

  const handleContinue = () => {
    window.location.href = addUtmsToHref("/")
  }

  const stepLabels = [
    "Verificando dispositivo...",
    "Analisando comportamento...",
    "Confirmando identidade...",
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[500px] flex flex-col items-center">
        {/* Titulo */}
        <h1 className="text-[15px] tracking-[3px] text-[#b0b0b0] font-medium uppercase mb-10">
          {"VERIFICA\u00C7\u00C3O DE SEGURAN\u00C7A"}
        </h1>

        {/* Captcha box */}
        <div
          onClick={handleCheck}
          className="w-full max-w-[420px] bg-[#f7f7f7] border border-[#d8d8d8] rounded-xl px-5 py-5 flex items-center justify-between cursor-pointer select-none transition-all"
          style={{
            boxShadow: checked
              ? "0 0 0 2px rgba(76, 175, 80, 0.3)"
              : "0 1px 4px rgba(0,0,0,0.05)",
            borderColor: checked ? "#a5d6a7" : "#d8d8d8",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Checkbox */}
            <div
              className="w-[42px] h-[42px] rounded-lg border-2 flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: checked ? "#4caf50" : "#c0c0c0",
                backgroundColor: checked ? "#4caf50" : "white",
              }}
            >
              {checked && (
                <svg
                  className="w-6 h-6 text-white animate-in zoom-in duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-[18px] font-semibold text-[#333]">
              {"N\u00E3o sou um rob\u00F4"}
            </span>
          </div>

          {/* Logo seguranca */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-[3px]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#00d4aa]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#ff4081]" />
            </div>
            <span className="text-[12px] text-[#999] mt-0.5">
              {"Seguran\u00E7a"}
            </span>
          </div>
        </div>

        {/* Barra de progresso + steps (aparecem apos clicar) */}
        {checked && (
          <div className="w-full max-w-[420px] mt-8 flex flex-col items-center">
            {/* Barra de progresso */}
            <div className="w-full h-[6px] bg-[#e8e8e8] rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-100 ease-linear"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #ff4060, #ff2d55)",
                }}
              />
            </div>

            {/* Texto verificado */}
            {verified && (
              <p className="text-[16px] text-[#b0b0b0] mb-5 animate-in fade-in duration-300">
                Verificado!
              </p>
            )}

            {/* Steps de verificacao */}
            <div className="w-full flex flex-col gap-3 mt-2 px-2">
              {stepLabels.map((label, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    steps[i]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="w-[26px] h-[26px] rounded-full bg-[#4caf50] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-[16px] text-[#666]">{label}</span>
                </div>
              ))}
            </div>

            {/* Botao Continuar */}
            {showButton && (
              <button
                onClick={handleContinue}
                className="mt-8 w-[240px] h-[56px] rounded-full text-white font-bold text-[18px] cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-300"
                style={{
                  background: "linear-gradient(135deg, #ff4060, #ff2d55)",
                  boxShadow: "0 4px 15px rgba(255, 45, 85, 0.35)",
                }}
              >
                Continuar
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-[14px] text-[#b5b5b5] mt-12 text-center">
          {"Seus dados est\u00E3o protegidos e n\u00E3o ser\u00E3o compartilhados"}
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/verificacao")({
  head: () => ({
    meta: [
      { title: "Verificação de segurança | Mercado Livre" },
      { name: "description", content: "Confirme que você não é um robô para continuar navegando." },
      { property: "og:title", content: "Verificação de segurança | Mercado Livre" },
      { property: "og:description", content: "Confirme que você não é um robô para continuar navegando." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificacaoPage,
});
