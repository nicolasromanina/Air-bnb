import { useEffect, useRef } from 'react';

type Options = {
  key: string;
  interval?: number;
  onSave: (data: any) => Promise<void> | void;
  getData: () => any;
};

export const useAutosave = ({ key, interval = 30000, onSave, getData }: Options) => {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const tick = async () => {
      const payload = getData();
      try {
        await onSave(payload);
        localStorage.setItem(`autosave:${key}`, JSON.stringify({ at: Date.now(), payload }));
      } catch (e) {
        console.warn('autosave error', e);
      }
    };

    timer.current = window.setInterval(tick, interval);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [key, interval, onSave, getData]);
};

export default useAutosave;
