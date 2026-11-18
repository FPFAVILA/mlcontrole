import { useCallback, useEffect, useState } from "react"

export type CartItem = {
  id: string
  title: string
  price: number
  image: string
  qty: number
}

const KEY = "ml_cart"
const EVENT = "ml_cart_change"

function read(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const sync = () => setItems(read())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const current = read()
    const existing = current.find((i) => i.id === item.id)
    const next = existing
      ? current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      : [...current, { ...item, qty }]
    write(next)
  }, [])

  const removeItem = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id))
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return write(read().filter((i) => i.id !== id))
    write(read().map((i) => (i.id === id ? { ...i, qty } : i)))
  }, [])

  const clear = useCallback(() => write([]), [])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0)

  return { items, addItem, removeItem, setQty, clear, count, total }
}
