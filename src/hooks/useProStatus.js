import { useState, useEffect } from 'react';

export function useProStatus() {
  const [isPro, setIsPro] = useState(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isPro') === 'true';
    }
    return false;
  });

  const activatePro = () => {
    setIsPro(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPro', 'true');
    }
  };

  return { isPro, activatePro };
}
