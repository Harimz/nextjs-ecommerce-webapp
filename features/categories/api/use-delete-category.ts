import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.admin.categories)[":categoryId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.admin.categories)[":categoryId"]["$delete"]
>;

export const useDeleteCategory = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.admin.categories[":categoryId"][
        "$delete"
      ]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Deleted");
      router.push("/admin/categories");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  return mutation;
};
