import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type RouteChangeCallback = (prev: string, current: string, pageNumber?: number) => void;

/**
 * Calls onChange(prev, current, pageNumber) when route changes, ignoring `page` param only.
 */
export default function useRouteChangeExcludingPage(onChange: RouteChangeCallback) {
  const location = useLocation();
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);

    // Get page number before removing param
    const pageParam = url.searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam, 10) : undefined;

    // Remove only `page` param, keep everything else
    url.searchParams.delete("page");

    const normalized = url.pathname + (url.search || "");

    if (prevRef.current !== null && prevRef.current !== normalized) {
      try {
        onChange(prevRef.current, normalized, pageNumber);
      } catch (err) {
        console.error("Error running route change callback:", err);
      }
    }

    // update previous path reference
    prevRef.current = normalized;
  }, [location, onChange]);
}
