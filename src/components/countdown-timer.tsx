import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 9, seconds: 30 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(interval)
          setExpired(true)
          return prev
        }
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  if (expired) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f23d4f] border-t border-[#d6293b]">
        <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-3 flex items-center justify-center gap-2">
          <span className="text-[12px] md:text-[14px] text-white font-semibold text-center">
            {'Seu tempo acabou! Voce precisa finalizar sua compra agora para ganhar o desconto extra.'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#c5ddf5] border-t border-[#b0c8e8]">
      <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-2 flex items-center justify-center gap-2 md:gap-3">
        <span className="text-[11px] md:text-[13px] text-[#333] font-medium">Sua oferta termina em:</span>
        <div className="flex items-center gap-1">
          <div className="bg-[#3a4a5c] text-white text-[16px] md:text-[20px] font-bold px-1.5 md:px-2 py-0.5 rounded min-w-[30px] md:min-w-[36px] text-center">
            {pad(time.hours)}
          </div>
          <span className="text-[#333] text-[16px] md:text-[18px] font-bold">:</span>
          <div className="bg-[#3a4a5c] text-white text-[16px] md:text-[20px] font-bold px-1.5 md:px-2 py-0.5 rounded min-w-[30px] md:min-w-[36px] text-center">
            {pad(time.minutes)}
          </div>
          <span className="text-[#333] text-[16px] md:text-[18px] font-bold">:</span>
          <div className="bg-[#3a4a5c] text-white text-[16px] md:text-[20px] font-bold px-1.5 md:px-2 py-0.5 rounded min-w-[30px] md:min-w-[36px] text-center">
            {pad(time.seconds)}
          </div>
        </div>
        <div className="hidden md:flex text-[9px] text-[#666] gap-6 ml-1">
          <span>HORAS</span>
          <span>MIN</span>
          <span>SEG</span>
        </div>
      </div>
    </div>
  )
}
