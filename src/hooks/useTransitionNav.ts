import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useTransitionNav(delay = 700) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const go = useCallback(
    (path: string, before?: () => void) => {
      before?.();
      setLoading(true);
      window.setTimeout(() => {
        navigate(path);
        // hide shortly after route change to let new page paint
        window.setTimeout(() => setLoading(false), 250);
      }, delay);
    },
    [navigate, delay]
  );

  return { loading, go };
}
