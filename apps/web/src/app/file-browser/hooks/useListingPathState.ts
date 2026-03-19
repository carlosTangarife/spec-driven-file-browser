import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import {
  PATH_INPUT_MAX_LENGTH,
  splitPathInput,
} from '../lib/path-input.utils';
import { useDebouncedValue } from './useDebouncedValue';

/** Debounce before syncing listing/tree wire path (reduces API churn while typing). */
const DEBOUNCE_MS = 500;

export type UseListingPathStateResult = {
  pathInput: string;
  setPathInput: (value: string) => void;
  namePrefix: string;
  listingPath: string;
  onKeyDownPathInput: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * Debounces the **listing wire path** from `splitPathInput`, not the raw string.
 * Enter/Tab flushes the current derived wire path for the query.
 */
export const useListingPathState = (): UseListingPathStateResult => {
  const queryClient = useQueryClient();
  const [pathInput, setPathInputState] = useState('');

  const setPathInput = useCallback((value: string) => {
    setPathInputState(value.slice(0, PATH_INPUT_MAX_LENGTH));
  }, []);

  const { listingWirePath, namePrefix } = useMemo(
    () => splitPathInput(pathInput),
    [pathInput],
  );

  const debouncedListingWirePath = useDebouncedValue(listingWirePath, DEBOUNCE_MS);
  const [listingPath, setListingPath] = useState('');

  useEffect(() => {
    setListingPath(debouncedListingWirePath);
  }, [debouncedListingWirePath]);

  const flushListingPath = useCallback(() => {
    const { listingWirePath: next } = splitPathInput(pathInput);
    setListingPath(next);
    void queryClient.invalidateQueries({ queryKey: ['fileListing', next] });
  }, [pathInput, queryClient]);

  const onKeyDownPathInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        flushListingPath();
      }
    },
    [flushListingPath],
  );

  return {
    pathInput,
    setPathInput,
    namePrefix,
    listingPath,
    onKeyDownPathInput,
  };
};
