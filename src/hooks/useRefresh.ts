import { useEffect, useRef } from 'react';

// this is a hack

export function useOnFocus(callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const onFocus = () => {
      callbackRef.current();
    };

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);
}
