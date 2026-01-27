import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to sync state with URL query parameters
 * Allows sharing calculator state via URL
 */
export function useQueryState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL or default
  const [state, setState] = useState<T>(() => {
    const urlValue = searchParams.get(key);
    if (urlValue) {
      try {
        return deserialize(decodeURIComponent(urlValue));
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  // Update URL when state changes
  const setStateAndUrl = useCallback(
    (value: T) => {
      setState(value);
      const newParams = new URLSearchParams(searchParams);
      const serialized = serialize(value);
      
      // Only update URL if value is meaningful
      if (serialized && serialized !== serialize(defaultValue)) {
        newParams.set(key, encodeURIComponent(serialized));
      } else {
        newParams.delete(key);
      }
      
      setSearchParams(newParams, { replace: true });
    },
    [key, searchParams, setSearchParams, serialize, defaultValue]
  );

  // Sync from URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const urlValue = searchParams.get(key);
    if (urlValue) {
      try {
        const parsed = deserialize(decodeURIComponent(urlValue));
        setState(parsed);
      } catch {
        // Invalid URL state, keep current
      }
    }
  }, [key, searchParams, deserialize]);

  return [state, setStateAndUrl];
}

/**
 * Simple debounce hook for input fields
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

