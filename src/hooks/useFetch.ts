import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface FetchOptions {
  autoFetch?: boolean;
}

export function useFetch<T>(url: string, options: FetchOptions = {}): UseFetchResult<T> {
  const { autoFetch = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    // Ne pas faire de fetch si l'URL est vide
    if (!url || url.trim() === '') {
      setLoading(false);
      return;
    }

    if (!autoFetch && trigger === 0) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            setError(err.message);
          }
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: abort fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, [url, autoFetch, trigger]);

  const refetch = () => {
    setTrigger(prev => prev + 1);
  };

  return { data, loading, error, refetch };
}