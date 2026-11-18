import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react"
import { addUtmsToHref } from "@/components/utm-handler"

function VerificacaoFbPage() {
  const [checked, setChecked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState([false, false, false])
  const [showButton, setShowButton] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleCheck = () => {
    if (checked) return
    setChecked(true)

    let p = 0
    const progressInterval = setInterval(() => {
      p += 2
      setProgress(p)
      if (p >= 100) clearInterval(progressInterval)
    }, 30)

    setTimeout(() => {
      setSteps((prev) => [true, prev[1], prev[2]])
    }, 800)

    setTimeout(() => {
      setSteps((prev) => [prev[0], true, prev[2]])
    }, 1600)

    setTimeout(() => {
      setSteps((prev) => [prev[0], prev[1], true])
      setVerified(true)
    }, 2400)

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#F0F2F5" }}>
      <div className="w-full max-w-[500px] flex flex-col items-center">

        {/* Facebook logo */}
        <svg className="w-[48px] h-[48px] mb-5" viewBox="0 0 36 36" fill="none">
          <path
            d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"
            fill="#1877F2"
          />
          <path
            d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
            fill="#FFFFFF"
          />
        </svg>

        {/* Card principal */}
        <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>

          {/* Header azul */}
          <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#1877F2" }}>
            <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-white font-semibold text-[16px]">{"Verifica\u00E7\u00E3o de Seguran\u00E7a"}</span>
          </div>

          {/* Conteudo */}
          <div className="px-6 py-6">
            <p className="text-[14px] mb-5" style={{ color: "#65676B" }}>
              {"Para continuar, confirme que voc\u00EA n\u00E3o \u00E9 um rob\u00F4. Isso ajuda a proteger nossa comunidade."}
            </p>

            {/* Captcha box */}
            <div
              onClick={handleCheck}
              className="w-full rounded-lg px-5 py-4 flex items-center justify-between cursor-pointer select-none transition-all duration-200"
              style={{
                backgroundColor: checked ? "#E7F3FF" : "#F0F2F5",
                border: checked ? "2px solid #1877F2" : "2px solid #E4E6EB",
              }}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div
                  className="w-[40px] h-[40px] rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    border: checked ? "none" : "2px solid #BEC3C9",
                    backgroundColor: checked ? "#1877F2" : "white",
                  }}
                >
                  {checked && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      style={{ animation: "scaleIn 0.2s ease-out" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[17px] font-semibold" style={{ color: "#1C1E21" }}>
                  {"N\u00E3o sou um rob\u00F4"}
                </span>
              </div>

              {/* Logo seguranca */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-[3px]">
                  <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#1877F2" }} />
                  <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#42B72A" }} />
                </div>
                <span className="text-[11px] mt-0.5" style={{ color: "#65676B" }}>
                  {"Seguran\u00E7a"}
                </span>
              </div>
            </div>

            {/* Progress + steps */}
            {checked && (
              <div className="mt-6 flex flex-col items-center">
                {/* Barra de progresso */}
                <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: "#E4E6EB" }}>
                  <div
                    className="h-full rounded-full transition-all duration-100 ease-linear"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#1877F2",
                    }}
                  />
                </div>

                {verified && (
                  <p className="text-[14px] mt-3 font-medium" style={{ color: "#42B72A" }}>
                    Verificado!
                  </p>
                )}

                {/* Steps */}
                <div className="w-full flex flex-col gap-3 mt-4">
                  {stepLabels.map((label, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 transition-all duration-300"
                      style={{
                        opacity: steps[i] ? 1 : 0,
                        transform: steps[i] ? "translateY(0)" : "translateY(8px)",
                      }}
                    >
                      <div
                        className="w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#42B72A" }}
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[15px]" style={{ color: "#65676B" }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Botao Continuar */}
                {showButton && (
                  <button
                    onClick={handleContinue}
                    className="mt-6 w-full h-[48px] rounded-lg text-white font-semibold text-[16px] cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      backgroundColor: "#1877F2",
                      animation: "fadeIn 0.3s ease-out",
                    }}
                  >
                    Continuar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[13px] mt-6 text-center" style={{ color: "#65676B" }}>
          {"Seus dados est\u00E3o protegidos e n\u00E3o ser\u00E3o compartilhados"}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#65676B">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          <span className="text-[12px]" style={{ color: "#8A8D91" }}>Protegido por Meta Security</span>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export const Route = createFileRoute("/verificacao-fb")({
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
  component: VerificacaoFbPage,
});
