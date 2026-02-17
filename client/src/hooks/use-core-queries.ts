import { useQuery } from "@tanstack/react-query";
import { api, type ApiCoreQuery } from "@/lib/api";
import { useCallback } from "react";

export function useCoreQueries() {
  const { data: coreQueries = [] } = useQuery<ApiCoreQuery[]>({
    queryKey: ["/api/core-queries"],
    queryFn: () => api.coreQueries.list(),
    staleTime: 5 * 60 * 1000,
  });

  const getContextQuery = useCallback(
    (locationKey: string): string => {
      const match = coreQueries.find((q) => q.locationKey === locationKey);
      return match?.contextQuery || "";
    },
    [coreQueries]
  );

  const prependContext = useCallback(
    (locationKey: string, userContent: string): string => {
      const context = getContextQuery(locationKey);
      if (!context) return userContent;
      return `[System Context: ${context}]\n\n${userContent}`;
    },
    [getContextQuery]
  );

  return { coreQueries, getContextQuery, prependContext };
}
