import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.user.current.$get();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      console.log("DATA: ", data);

      return data;
    },
  });

  return query;
};
