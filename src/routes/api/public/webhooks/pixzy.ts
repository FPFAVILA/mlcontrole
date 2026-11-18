import { createFileRoute } from "@tanstack/react-router"
import { createHmac, timingSafeEqual } from "node:crypto"
import { canTransition, mapProviderStatus, type PaymentStatus } from "@/lib/pixzy-core"

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/**
 * Webhook publico da Pixzy.
 * Se PIXZY_WEBHOOK_SECRET estiver configurado, valida a assinatura HMAC do corpo bruto.
 * Sempre valida evento, pedido, transacao, valor, status e aplica idempotencia.
 */
export const Route = createFileRoute("/api/public/webhooks/pixzy")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text()

        const secret = process.env["PIXZY_WEBHOOK_SECRET"]
        if (secret) {
          const signature =
            request.headers.get("x-pixzy-signature") ||
            request.headers.get("x-webhook-signature") ||
            request.headers.get("x-signature") ||
            ""
          const expected = createHmac("sha256", secret).update(rawBody).digest("hex")
          const provided = signature.replace(/^sha256=/, "").trim()
          if (!provided || !safeEqual(provided, expected)) {
            return new Response("Invalid signature", { status: 401 })
          }
        }

        let payload: Record<string, unknown>
        try {
          payload = JSON.parse(rawBody) as Record<string, unknown>
        } catch {
          return new Response("Invalid payload", { status: 400 })
        }

        const transaction = (payload["transaction"] ?? payload["data"] ?? {}) as Record<string, unknown>
        const metadata = (transaction["metadata"] ?? {}) as Record<string, unknown>
        const pedidoId = typeof metadata["pedido_id"] === "string" ? metadata["pedido_id"] : null
        const event = String(payload["event"] ?? transaction["status"] ?? "")
        const providerTransactionId =
          transaction["id"] != null ? String(transaction["id"]) : null
        const amountCents = Number(transaction["amount"] ?? NaN)

        if (!pedidoId || !event) {
          return new Response("Missing data", { status: 400 })
        }

        const nextStatus: PaymentStatus | null =
          mapProviderStatus(event) ?? mapProviderStatus(String(transaction["status"] ?? ""))
        if (!nextStatus) {
          return Response.json({ received: true, ignored: true })
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server")

        const eventKey = [
          "pixzy",
          pedidoId,
          providerTransactionId ?? "na",
          nextStatus,
          String(transaction["updated_at"] ?? ""),
        ].join(":")

        // Idempotencia: o mesmo evento nunca e processado duas vezes.
        const { error: eventError } = await supabaseAdmin
          .from("payment_events")
          .insert({ provider: "pixzy", event, event_key: eventKey, payload: payload as never })

        if (eventError) {
          return Response.json({ received: true, duplicate: true })
        }

        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, status, amount_cents")
          .eq("order_code", pedidoId)
          .maybeSingle()

        if (!order) {
          console.error("[pixzy-webhook] pedido nao encontrado para o webhook recebido")
          return Response.json({ received: true, unknownOrder: true })
        }

        const finish = async (result: string) => {
          await supabaseAdmin
            .from("payment_events")
            .update({ order_id: order.id, processed_at: new Date().toISOString(), result })
            .eq("event_key", eventKey)
        }

        if (!canTransition(order.status as PaymentStatus, nextStatus)) {
          await finish("transicao_ignorada")
          return Response.json({ received: true })
        }

        // O valor precisa bater exatamente com o pedido interno.
        if (nextStatus === "paid" && (!Number.isFinite(amountCents) || amountCents !== order.amount_cents)) {
          console.error("[pixzy-webhook] divergencia de valor: pedido mantido pendente para revisao")
          await finish("valor_divergente")
          return Response.json({ received: true, mismatch: true })
        }

        const now = new Date().toISOString()

        await supabaseAdmin
          .from("orders")
          .update({ status: nextStatus, paid_at: nextStatus === "paid" ? now : null })
          .eq("id", order.id)
          .eq("status", "pending")

        let paymentsQuery = supabaseAdmin
          .from("payments")
          .update({
            status: nextStatus,
            paid_at: nextStatus === "paid" ? now : null,
            failure_reason: nextStatus === "failed" ? event : null,
            ...(providerTransactionId ? { provider_reference: providerTransactionId } : {}),
          })
          .eq("order_id", order.id)
        paymentsQuery = paymentsQuery.eq("status", "pending")
        await paymentsQuery

        await finish(`status_${nextStatus}`)

        return Response.json({ received: true, status: nextStatus })
      },
    },
  },
})
