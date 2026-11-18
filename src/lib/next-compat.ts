import { useNavigate, useRouterState } from "@tanstack/react-router";

/** Drop-in replacement for next/navigation's useRouter. */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to: string) => void navigate({ to } as never),
    replace: (to: string) => void navigate({ to, replace: true } as never),
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
    prefetch: () => {},
  };
}

/** Drop-in replacement for next/navigation's usePathname. */
export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

/** Drop-in replacement for next/navigation's useSearchParams. */
export function useSearchParams() {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  return new URLSearchParams(searchStr);
}
