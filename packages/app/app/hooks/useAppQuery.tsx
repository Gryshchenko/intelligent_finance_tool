import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"

type QueryFn<T> = () => Promise<T>

export function useAppQuery<TData>(
  key: string | any[],
  queryFn: QueryFn<TData>,
  options?: UseQueryOptions<TData>,
): UseQueryResult<TData> {
  return useQuery<TData>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    staleTime: 1000 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  })
}

export function useInvalidateQuery() {
  const queryClient = useQueryClient()

  return (keys: (string | readonly unknown[])[]) => {
    keys.forEach((key) => queryClient.invalidateQueries(Array.isArray(key) ? key : [key]))
  }
}
