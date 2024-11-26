import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.admin.categories)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.admin.categories)["$post"]
>["json"];

export const useCreateCategory = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.admin.categories["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to create category");
      console.error(error);
    },
  });

  return mutation;
};
