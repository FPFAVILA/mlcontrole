import { useEffect } from "react"
import { usePathname, useSearchParams } from "@/lib/next-compat"
import { useServerFn } from "@tanstack/react-start"
import { sendFacebookConversion } from "@/lib/facebook-conversions"
import { trackPurchase } from "@/lib/track-purchase"

const IC_ROUTES = ["/checkout", "/checkout/identificacao", "/checkout/endereco"]

export function MetaPixelTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sendConversion = useServerFn(sendFacebookConversion)

  useEffect(() => {
    const fbq = (window as any).fbq
    if (typeof fbq !== "function") return

    // PageView em toda mudanca de rota
    fbq("track", "PageView")

    // Normalizar pathname removendo trailing slash
    const path = pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname

    // InitiateCheckout - qualquer rota /checkout exceto /checkout/confirmado (1x por sessao)
    if (path.startsWith("/checkout") && path !== "/checkout/confirmado") {
      if (!sessionStorage.getItem("fb_ic_fired")) {
        fbq("track", "InitiateCheckout")
        sendConversion({ data: { event_name: "InitiateCheckout" } }).catch(() => {})
        sessionStorage.setItem("fb_ic_fired", "1")
      }
    }

    // AddPaymentInfo - apenas 1x por sessao
    if (path === "/checkout/pagamento") {
      if (!sessionStorage.getItem("fb_api_fired")) {
        fbq("track", "AddPaymentInfo")
        sendConversion({ data: { event_name: "AddPaymentInfo" } }).catch(() => {})
        sessionStorage.setItem("fb_api_fired", "1")
      }
    }

    // Purchase - apenas 1x por sessao, com valor dinamico
    // Dispara quando chega na pagina /checkout/confirmado (pagamento ja confirmado)
    if (path === "/checkout/confirmado") {
      const amount = searchParams.get("amount")
      const tid = searchParams.get("tid") || ""
      trackPurchase({
        value: amount ? parseFloat(amount) : 179.9,
        transactionId: tid,
        dedupeKey: "produto",
      })
    }
  }, [pathname, searchParams, sendConversion])

  return null
}
