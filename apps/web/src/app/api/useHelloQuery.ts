import { useQuery } from '@tanstack/react-query';
import { getHelloFromApi } from './hello.service';

/** React Query hook for API connection test (hello message). */
export const useHelloQuery = () =>
  useQuery({
    queryKey: ['hello'],
    queryFn: getHelloFromApi,
  });
