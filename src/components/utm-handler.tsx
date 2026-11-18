import { useEffect } from "react"
import { useSearchParams, usePathname } from "@/lib/next-compat"
import { Suspense } from "react"

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "fbclid",
  "ttclid",
  "sck",
  "gclid",
]

const STORAGE_KEY = "saved_utm_params"

function UtmHandlerInner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Capturar UTMs da URL e salvar no sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const currentParams: Record<string, string> = {}
    let hasNewParams = false

    TRACKED_PARAMS.forEach((key) => {
      const value = searchParams.get(key)
      if (value) {
        currentParams[key] = value
        hasNewParams = true
      }
    })

    // Se a URL atual tem parametros, salvar (sobrescreve os anteriores)
    if (hasNewParams) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentParams))
    }
  }, [searchParams, pathname])

  // Interceptar cliques em links e botoes para adicionar UTMs
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (anchor && anchor.href) {
        const url = new URL(anchor.href, window.location.origin)

        // Apenas links internos
        if (url.origin !== window.location.origin) return

        const saved = sessionStorage.getItem(STORAGE_KEY)
        if (!saved) return

        const params: Record<string, string> = JSON.parse(saved)
        let modified = false

        Object.entries(params).forEach(([key, value]) => {
          if (!url.searchParams.has(key)) {
            url.searchParams.set(key, value)
            modified = true
          }
        })

        if (modified) {
          e.preventDefault()
          window.location.href = url.toString()
        }
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  // Sobrescrever window.location.href para adicionar UTMs
  useEffect(() => {
    if (typeof window === "undefined") return

    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "location")
    if (!originalDescriptor) return

    // Interceptar chamadas de navegacao via history.pushState
    const originalPushState = history.pushState.bind(history)
    history.pushState = function (state, title, url) {
      if (url && typeof url === "string") {
        url = appendUtmsToUrl(url)
      }
      return originalPushState(state, title, url)
    }

    return () => {
      history.pushState = originalPushState
    }
  }, [])

  return null
}

// Funcao utilitaria para adicionar UTMs a uma URL
export function appendUtmsToUrl(url: string): string {
  if (typeof window === "undefined") return url

  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) return url

  try {
    const params: Record<string, string> = JSON.parse(saved)
    const isAbsolute = url.startsWith("http")
    const urlObj = new URL(url, window.location.origin)

    // Apenas URLs internas
    if (urlObj.origin !== window.location.origin) return url

    Object.entries(params).forEach(([key, value]) => {
      if (!urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value)
      }
    })

    return isAbsolute ? urlObj.toString() : urlObj.pathname + urlObj.search + urlObj.hash
  } catch {
    return url
  }
}

// Funcao para obter a query string dos UTMs salvos
export function getSavedUtmQueryString(): string {
  if (typeof window === "undefined") return ""

  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) return ""

  try {
    const params: Record<string, string> = JSON.parse(saved)
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })

    const qs = searchParams.toString()
    return qs ? `?${qs}` : ""
  } catch {
    return ""
  }
}

// Funcao para adicionar UTMs a uma URL existente (com ? ou &)
export function addUtmsToHref(href: string): string {
  if (typeof window === "undefined") return href

  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) return href

  try {
    const params: Record<string, string> = JSON.parse(saved)
    const entries = Object.entries(params)
    if (entries.length === 0) return href

    const utmString = entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")

    if (href.includes("?")) {
      return `${href}&${utmString}`
    } else {
      return `${href}?${utmString}`
    }
  } catch {
    return href
  }
}

export function UtmHandler() {
  return (
    <Suspense fallback={null}>
      <UtmHandlerInner />
    </Suspense>
  )
}
