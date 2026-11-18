import { useState } from "react"

export function QuestionsSection() {
  const [text, setText] = useState("")
  const [myQuestions, setMyQuestions] = useState<{ id: number; text: string }[]>([])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setMyQuestions((prev) => [...prev, { id: Date.now(), text: value }])
    setText("")
  }

  return (
    <div className="bg-white border-t border-[#e0e0e0] p-4 md:p-6">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-4">Perguntas e respostas</h2>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-1 h-[44px] px-4 text-[16px] text-[#333] bg-white border border-[#e0e0e0] rounded-[6px] outline-none placeholder:text-[#999] focus:border-[#3483fa]"
        />
        <button
          type="submit"
          className="h-[44px] px-6 bg-[#3483fa] hover:bg-[#2968c8] text-white font-semibold text-[14px] rounded-[6px] flex items-center justify-center gap-2 cursor-pointer"
        >
          Perguntar
        </button>
      </form>

      {myQuestions.length > 0 && (
        <div className="mb-4">
          <p className="text-[14px] font-semibold text-[#333] mb-2">Suas perguntas</p>
          <ul className="space-y-2">
            {myQuestions.map((q) => (
              <li key={q.id} className="text-[14px] text-[#333] bg-[#f5f5f5] rounded-[6px] px-3 py-2">
                {q.text}
                <span className="block text-[12px] text-[#999] mt-1">Aguardando resposta do vendedor</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a href="#" className="text-[13px] text-[#3483fa]">
        Ver todas as perguntas
      </a>
    </div>
  )
}
