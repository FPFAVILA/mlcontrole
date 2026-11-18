/**
 * Cliente HTTP da Pixzy. Somente servidor.
 * O token e lido exclusivamente de process.env.PIXZY_API_TOKEN, dentro das funcoes.
 * Nunca logar, retornar ou persistir o token.
 */
import { friendlyProviderError } from "./pixzy-core"

export const PIXZY_BASE_URL = "https://app.pixzypay.com/api"

export type PixzyCreateInput = {
  amountCents: number
  clientName: string
  clientEmail: string
  clientDoc: string
  clientPhone?: string | null
  webhookUrl: string
  pedidoId: string
  items: { name: string; price: number; quantity: number }[]
}

export type PixzyCreateResult =
  | {
      ok: true
      transactionId: string | null
      providerReference: string | null
      brCode: string
      status: string | null
      expiresAt: string | null
    }
  | { ok: false; userMessage: string; httpStatus: number; retryAfter?: string | null }

function pickString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "string" && value.length > 0) return value
    if (typeof value === "number") return String(value)
  }
  return null
}

export function hasPixzyToken(): boolean {
  return Boolean(process.env["PIXZY_API_TOKEN"])
}

export async function createPixzyTransaction(input: PixzyCreateInput): Promise<PixzyCreateResult> {
  const token = process.env["PIXZY_API_TOKEN"]
  if (!token) {
    console.error("[pixzy] configuracao ausente: variavel de ambiente PIXZY_API_TOKEN nao definida")
    return {
      ok: false,
      httpStatus: 500,
      userMessage: "Pagamento indisponivel no momento. Tente novamente em alguns instantes.",
    }
  }

  let response: Response
  try {
    response = await fetch(`${PIXZY_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount: input.amountCents,
        client_name: input.clientName,
        client_email: input.clientEmail,
        client_doc: input.clientDoc,
        client_phone: input.clientPhone ?? "",
        webhook_url: input.webhookUrl,
        metadata: { pedido_id: input.pedidoId },
        items: input.items,
      }),
    })
  } catch (error) {
    console.error("[pixzy] falha de rede ao criar transacao", (error as Error).name)
    return {
      ok: false,
      httpStatus: 503,
      userMessage: "Nao foi possivel gerar seu Pix agora. Tente novamente em alguns instantes.",
    }
  }

  const text = await response.text()
  let payload: Record<string, unknown> = {}
  try {
    payload = JSON.parse(text) as Record<string, unknown>
  } catch {
    payload = {}
  }

  if (!response.ok) {
    console.error(`[pixzy] erro ao criar transacao (status ${response.status})`)
    return {
      ok: false,
      httpStatus: response.status,
      userMessage: friendlyProviderError(response.status),
      retryAfter: response.headers.get("retry-after"),
    }
  }

  const data = (payload["data"] ?? payload) as Record<string, unknown>
  const brCode = pickString(data, ["br_code", "brCode", "qrcode", "pix_code", "copy_paste"])

  if (!brCode) {
    console.error("[pixzy] resposta sem br_code")
    return {
      ok: false,
      httpStatus: 502,
      userMessage: "Nao foi possivel gerar seu Pix agora. Tente novamente em alguns instantes.",
    }
  }

  return {
    ok: true,
    transactionId: pickString(data, ["transaction_id", "transactionId"]),
    providerReference: pickString(data, ["id", "reference"]),
    brCode,
    status: pickString(data, ["status"]),
    expiresAt: pickString(data, ["expires_at", "expiration_date", "expiresAt"]),
  }
}
