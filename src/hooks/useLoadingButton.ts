import { useState, useCallback } from "react";

export function useLoadingButton(action: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      await action();
    } finally {
      setLoading(false);
    }
  }, [action, loading]);

  return { loading, handleClick };
}
