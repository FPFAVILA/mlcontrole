import { createFileRoute } from "@tanstack/react-router"
import {
  OrderValidationError,
  parseOrderInput,
  priceOrder,
  mapProviderStatus,
} from "@/lib/pixzy-core"

const STABLE_PUBLIC_URL = "https://project--60b5de1e-ccdc-419e-80c0-b6e1a712ec55.lovable.app"

function resolvePublicBaseUrl(request: Request): string {
  const configured = process.env["PUBLIC_APP_URL"]
  if (configured) return configured.replace(/\/$/, "")
  try {
    const url = new URL(request.url)
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return STABLE_PUBLIC_URL
    return `${url.protocol}//${url.host}`
  } catch {
    return STABLE_PUBLIC_URL
  }
}

export const Route = createFileRoute("/api/pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let input
        try {
          input = parseOrderInput(await request.json())
        } catch (error) {
          const message =
            error instanceof OrderValidationError ? error.message : "Dados do pedido invalidos"
          return Response.json({ error: message }, { status: 422 })
        }

        let priced
        try {
          priced = priceOrder(input)
        } catch (error) {
          const message =
            error instanceof OrderValidationError ? error.message : "Nao foi possivel calcular o pedido"
          return Response.json({ error: message }, { status: 422 })
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server")
        const orderCode = `ML-${input.checkoutRef}`.slice(0, 60).toUpperCase()

        // ---- Idempotencia: reaproveita pedido/cobranca existente ----
        const { data: existingOrder } = await supabaseAdmin
          .from("orders")
          .select("id, order_code, status, amount_cents")
          .eq("order_code", orderCode)
          .maybeSingle()

        let orderId = existingOrder?.id ?? null

        if (existingOrder) {
          const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("br_code, status, amount_cents")
            .eq("order_id", existingOrder.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()

          if (
            existingPayment?.br_code &&
            (existingPayment.status === "pending" || existingPayment.status === "paid") &&
            existingOrder.amount_cents === priced.amountCents
          ) {
            return Response.json({
              orderId: existingOrder.id,
              orderCode: existingOrder.order_code,
              brCode: existingPayment.br_code,
              amountCents: existingOrder.amount_cents,
              paymentStatus: existingPayment.status,
              reused: true,
            })
          }
        } else {
          const { data: created, error: insertError } = await supabaseAdmin
            .from("orders")
            .insert({
              order_code: orderCode,
              status: "pending",
              amount_cents: priced.amountCents,
              customer_name: input.customer.name,
              customer_email: input.customer.email,
              customer_doc: input.customer.doc,
              customer_phone: input.customer.phone,
              address: (input.address ?? {}) as never,
              items: priced.lines as never,
              shipping_id: input.shippingId ?? null,
              shipping_date: input.shippingDate ?? null,
              insurance_months: input.insuranceMonths ?? null,
            })
            .select("id")
            .single()

          if (insertError || !created) {
            console.error("[pix] falha ao criar pedido interno")
            return Response.json(
              { error: "Nao foi possivel iniciar seu pedido agora. Tente novamente." },
              { status: 500 },
            )
          }
          orderId = created.id
        }

        if (!orderId) {
          return Response.json(
            { error: "Nao foi possivel iniciar seu pedido agora. Tente novamente." },
            { status: 500 },
          )
        }

        const { createPixzyTransaction } = await import("@/lib/pixzy.server")
        const result = await createPixzyTransaction({
          amountCents: priced.amountCents,
          clientName: input.customer.name,
          clientEmail: input.customer.email,
          clientDoc: input.customer.doc,
          clientPhone: input.customer.phone,
          webhookUrl: `${resolvePublicBaseUrl(request)}/api/public/webhooks/pixzy`,
          pedidoId: orderCode,
          items: priced.lines.map((line) => ({
            name: line.name,
            price: line.priceCents,
            quantity: line.quantity,
          })),
        })

        if (!result.ok) {
          const headers: Record<string, string> = {}
          if (result.retryAfter) headers["Retry-After"] = result.retryAfter
          return Response.json(
            { error: result.userMessage },
            { status: result.httpStatus === 429 ? 429 : 502, headers },
          )
        }

        const paymentStatus = mapProviderStatus(result.status) ?? "pending"

        const { error: paymentError } = await supabaseAdmin.from("payments").insert({
          order_id: orderId,
          provider: "pixzy",
          provider_transaction_id: result.transactionId,
          provider_reference: result.providerReference,
          br_code: result.brCode,
          amount_cents: priced.amountCents,
          status: paymentStatus,
          expires_at: result.expiresAt,
        })

        if (paymentError) console.error("[pix] falha ao salvar cobranca")

        return Response.json({
          orderId,
          orderCode,
          brCode: result.brCode,
          amountCents: priced.amountCents,
          paymentStatus,
          reused: false,
        })
      },
    },
  },
})
