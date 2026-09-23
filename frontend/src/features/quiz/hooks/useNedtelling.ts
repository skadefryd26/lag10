import { useEffect, useRef, useState } from "react";

type UseNedtellingOptions = {
  varighetSekunder?: number;
  aktiv: boolean;
  onTimeout: () => void;
  resetKey: string | number;
};

export function useNedtelling({
  varighetSekunder = 20,
  aktiv,
  onTimeout,
  resetKey
}: UseNedtellingOptions) {
  const [tidGjenstår, setTidGjenstår] = useState(varighetSekunder);
  const timeoutCalledRef = useRef(false);

  useEffect(() => {
    if (resetKey !== undefined) {
      setTidGjenstår(varighetSekunder);
      timeoutCalledRef.current = false;
    }
  }, [resetKey, varighetSekunder]);

  useEffect(() => {
    if (!aktiv) return;

    if (tidGjenstår <= 0) {
      if (!timeoutCalledRef.current) {
        timeoutCalledRef.current = true;
        onTimeout();
      }
      return;
    }

    const interval = setInterval(() => {
      setTidGjenstår((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!timeoutCalledRef.current) {
            timeoutCalledRef.current = true;
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [aktiv, tidGjenstår, onTimeout]);

  return tidGjenstår;
}
