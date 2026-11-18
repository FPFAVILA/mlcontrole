import { createFileRoute } from "@tanstack/react-router"

/** Status oficial do pedido para o frontend. Nunca consulta a Pixzy pelo cliente. */
export const Route = createFileRoute("/api/pix/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const orderId = url.searchParams.get("orderId")
        const orderCode = url.searchParams.get("orderCode")

        if (!orderId && !orderCode) {
          return Response.json({ error: "Pedido nao informado" }, { status: 400 })
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server")

        let query = supabaseAdmin.from("orders").select("id, order_code, status, amount_cents, paid_at")
        query = orderId ? query.eq("id", orderId) : query.eq("order_code", orderCode!)

        const { data, error } = await query.maybeSingle()

        if (error || !data) {
          return Response.json({ error: "Pedido nao encontrado" }, { status: 404 })
        }

        return Response.json({
          orderId: data.id,
          orderCode: data.order_code,
          paymentStatus: data.status,
          amountCents: data.amount_cents,
          paidAt: data.paid_at,
        })
      },
    },
  },
})
