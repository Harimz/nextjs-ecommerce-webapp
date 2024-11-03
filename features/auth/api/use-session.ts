import { useQuery } from "@tanstack/react-query";
import { SessionData } from "../types";

export const useSession = () => {
  const { data, status } = useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: async (c) => {
      const res = await fetch("/api/auth/session");

      return res.json();
    },
    staleTime: 5 * (60 * 1000),
    gcTime: 10 * (60 * 1000),
    refetchOnWindowFocus: true,
  });
  return { session: data, status };
};
